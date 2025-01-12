import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import jwtService from 'src/app/auth/services/jwtService';
import { useParams } from 'react-router';
import { debug, formatDate, getName, getValueSafe, unmaskQuiz } from 'src/app/utils';
import { Alert, Box, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import _, { isNull } from 'lodash';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { LoadingButton } from '@mui/lab';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

interface Column {
	id: 'full_name' | 'submission_date' | 'score' | 'preview';
	label: string;
	minWidth?: number;
	align?: 'right' | 'center';
	format?: (value: any) => string;
}

const columns: readonly Column[] = [
	{ id: 'full_name', label: 'Nombre', minWidth: 200 },
	// {
	//   id: "submission_date",
	//   label: "Fecha de entrega",
	//   minWidth: 100,
	//   align: "center",
	// },
	{ id: 'score', label: 'Calificación', minWidth: 60, align: 'center' },
	{ id: 'preview', label: '', minWidth: 50, align: 'center' }
];

interface Data {
	user_id: number;
	full_name: string;
	submission_date: string;
	score: number;
	quiz_status: string;
}

function createRow(submission: any): Data {
	const full_name = getName(submission.user);
	const submission_date = formatDate(submission.submission_date);
	return {
		user_id: submission.user.id,
		full_name,
		submission_date,
		score: submission.score,
		quiz_status: submission.quiz_status
	};
}

export default function ExamResultsTable({ clickOnPreviewFor }) {
	const [page, setPage] = React.useState(0);
	const [rows, setRows] = React.useState([]);
	const user = useSelector(selectUser);
	const [resultsState, setResultsState] = React.useState('');
	const [loadingStudentQuiz, setLoadingStudentQuiz] = React.useState('');
	const [scoresToSend, setScoresToSend] = React.useState(null);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [customError, setCustomError] = React.useState<any>({});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { courseid, topicid, todoid } = useParams();
	const dispatch = useAppDispatch();
	const theme = useTheme();

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const changedGrade = (e: any, userid: number) => {
		triggerError('');
		const score = e.target.value;
		if (scoreIsValid(score)) {
			setScoresToSend((prevScoresToSend) => {
				return {
					...prevScoresToSend,
					[userid]: [
						{
							course: courseid,
							session_item_id: todoid,
							score: _.toNumber(score)
						}
					]
				};
			});
		}
	};

	const scoreIsValid = (score) => {
		const maxGrade = _.toNumber(getValueSafe(() => user.tenant.max_grade, 10));

		if (isNaN(_.toNumber(score))) {
			triggerError(
				`Solo puedes ingresar números para la calificación. Revisa los valores que ingresaste e intenta de nuevo.`
			);
			return false;
		}

		if (score > maxGrade) {
			triggerError(
				`La máxima calificación que puedes dar es ${maxGrade}. Revisa los valores que ingresaste e intenta de nuevo.`
			);
			return false;
		}

		return true;
	};

	const getSubmissions = (courseid, todoid) => {
		setResultsState('loading');
		jwtService
			.getSubmissions(courseid, todoid)
			.then((submissions: any) => {
				if (submissions.length === 0) {
					setResultsState('empty');
				} else {
					const simpleRows = [];
					submissions.forEach((submission) => {
						const item = createRow(submission);
						simpleRows.push(item);
					});

					setRows(simpleRows);
					setResultsState('success');
				}
			})
			.catch((e) => {
				debug('GET Error on getSubmissions() ', e);
				setResultsState('error');
			});
	};

	const triggerError = (message) => {
		setCustomError({
			message
		});
	};

	const submitChanges = () => {
		setIsLoading(true);
		jwtService
			.updateGrades(scoresToSend)
			.then((submissions: any) => {
				setIsLoading(false);
				dispatch(
					showMessage({
						message: '¡Perfecto! Las calificaciones se guardaron correctamente.',
						autoHideDuration: 6000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					})
				);
			})
			.catch((e) => {
				setIsLoading(false);
				debug('GET Error on updateGrades() ', e);
			});
	};

	const handleOnPreview = (userid, enabled) => {
		if (!enabled) {
			return;
		}

		setLoadingStudentQuiz(userid);

		jwtService
			.getGradesSummary(courseid, userid)
			.then((response: any) => {
				const userSessionItem = unmaskQuiz(response, topicid, todoid);
				setLoadingStudentQuiz('');
				if (userSessionItem) {
					userSessionItem.user = {
						first_name: response.first_name,
						last_name: response.last_name,
						middle_name: response.middle_name
					};
					clickOnPreviewFor(userSessionItem);
				} else {
					showError();
				}
			})
			.catch((e) => {
				setLoadingStudentQuiz('');
				debug('GET Error on getGradesSummary() ', e);
				showError();
			});
	};

	const showError = () => {
		dispatch(
			showMessage({
				message:
					'Ocurrió un error cargando el examen del alumno seleccionado. Por favor, intenta de nuevo más tarde.',
				autoHideDuration: 6000,
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'center'
				},
				variant: 'error'
			})
		);
	};

	React.useEffect(() => {
		if (courseid && todoid) {
			getSubmissions(courseid, todoid);
		}
	}, [courseid, todoid]);

	return (
		<Box>
			{customError && customError.message && (
				<Box>
					<Alert
						sx={{ marginBottom: '1.5rem', width: 'unset !important' }}
						severity="error"
					>
						{customError.message}
					</Alert>
				</Box>
			)}
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table
						stickyHeader
						aria-label="sticky table"
					>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{resultsState !== 'success' && resultsState !== '' && (
								<TableRow>
									<TableCell
										align="center"
										colSpan={3}
									>
										{resultsState === 'loading' && <CircularProgress />}
										{resultsState === 'error' && (
											<Typography>Ocurrió un error. Por favor intenta de nuevo.</Typography>
										)}
										{resultsState === 'empty' && (
											<Typography>No hay resultados que mostrar.</Typography>
										)}
									</TableCell>
								</TableRow>
							)}
							{resultsState === 'success' &&
								rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
									return (
										<TableRow
											hover
											role="checkbox"
											tabIndex={-1}
											key={row.user_id}
											sx={{
												'&:hover': {
													backgroundColor: 'inherit !important'
												}
											}}
										>
											{columns.map((column) => {
												const value = row[column.id];
												return (
													<TableCell
														key={column.id}
														align={column.align}
													>
														{column.id === 'score' ? (
															<TextField
																id="outlined-basic"
																size="small"
																variant="outlined"
																placeholder="-"
																defaultValue={value}
																onChange={(e) => {
																	changedGrade(e, row.user_id);
																}}
															/>
														) : column.id === 'preview' ? (
															<Box
																sx={{
																	cursor:
																		row.quiz_status && !_.isEmpty(row.quiz_status)
																			? 'pointer'
																			: 'auto',
																	width: '20px',
																	'& svg': {
																		opacity:
																			row.quiz_status &&
																			!_.isEmpty(row.quiz_status)
																				? 1
																				: 0.5
																		// '&:hover':{
																		//     opacity: 1,
																		// }
																	}
																}}
																onClick={() => {
																	handleOnPreview(
																		row.user_id,
																		row.quiz_status && !_.isEmpty(row.quiz_status)
																	);
																}}
															>
																{loadingStudentQuiz === row.user_id ? (
																	<CircularProgress size="2rem" />
																) : (
																	<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
																)}
																{/* <pre>{JSON.stringify(row, null, 2)}</pre> */}
																{/* <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon> */}
															</Box>
														) : (
															value
														)}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) => {
						return `${from}-${to} de ${count}`;
					}}
					labelRowsPerPage="Filas por página"
				/>
			</Paper>
			<LoadingButton
				loading={isLoading}
				variant="contained"
				color="secondary"
				className=" mt-16"
				aria-label="Guardar calificaciones"
				disabled={customError.message || isNull(scoresToSend)}
				type="button"
				size="medium"
				sx={{
					color: theme.palette.common.white,
					float: 'right'
				}}
				onClick={() => {
					submitChanges();
				}}
			>
				Guardar cambios
			</LoadingButton>
		</Box>
	);
}
