import axios, { AxiosResponse } from 'axios';
import { getName } from 'src/app/utils';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import BaseUserType from 'app/store/user/BaseUserType';
import { showMessage } from 'app/store/fuse/messageSlice';
import { LoadingButton } from '@mui/lab';
import { IStudents, TablePaginationActions } from './CourseGradesCard';
import GradeTextField from './GradeTextField';

const SESSION_ITEMS_TYPES = ['exam', 'quiz', 'activity'];

interface SessionsItemsGrades {
	id: number;
	name: string;
	type: string;
	score: number;
	weight: number;
	active: boolean;
	hidden: boolean;
}

interface SessionsGrades {
	id: number;
	name: string;
	session_items: SessionsItemsGrades[];
	stars: number;
	medals: number;
}

interface TopicsGrades {
	id: number;
	name: string;
	sessions: SessionsGrades[];
}

interface SubjectGrades {
	id: number;
	name: string;
	topics: TopicsGrades[];
}

interface CourseGradeSummary {
	id: string;
	name: string;
	subject: SubjectGrades;
}

interface CourseStudentGradeResponse {
	id: number;
	first_name: string;
	middle_name: string;
	last_name: string;
	course: CourseGradeSummary;
}

interface IChangeGradeSchema {
	[key: string]: {
		studentId: number;
		courseId: number;
		sessionItemId: number;
		score: number;
	};
}

interface StudentGradeSummaryProps {
	student: IStudents | null;
	setReload: Dispatch<SetStateAction<boolean>>;
}

function StudentGradeSummary({ student, setReload }: StudentGradeSummaryProps) {
	const user: BaseUserType = useSelector(selectUser);
	const dispatch = useDispatch();
	const [gradesSummaryStatus, setGradesSummaryStatus] = useState<'successful' | 'loading' | 'error'>('loading');
	const [gradedSessionItems, setGradedSessionItems] = useState<SessionsItemsGrades[]>([] as SessionsItemsGrades[]);
	const [changedGrades, setChangedGrades] = useState<IChangeGradeSchema>({} as IChangeGradeSchema);
	const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChange = (sessionItemId: number, score: number) => {
		const changedValue = {
			[`${sessionItemId}`]: {
				studentId: student.id,
				courseId: student.course_id,
				sessionItemId,
				score
			}
		};
		setChangedGrades((prev) => {
			return { ...prev, ...changedValue };
		});
	};

	const getGradesByStudentAndCourse = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/courses/${student.course_id}/grades/summary/?uid=${student.id}`)
				.then((response: AxiosResponse<CourseStudentGradeResponse>) => {
					if (response.data.course?.id) {
						let sessionsItems: SessionsItemsGrades[] = [] as SessionsItemsGrades[];
						response.data.course.subject.topics.forEach((to) => {
							to.sessions.forEach((session) => {
								sessionsItems = [...sessionsItems, ...session.session_items];
							});
						});
						setGradedSessionItems(
							sessionsItems.filter((si) => si.active && SESSION_ITEMS_TYPES.includes(si.type))
						);
						setGradesSummaryStatus('successful');
						resolve(response.data);
					} else {
						setGradedSessionItems([] as SessionsItemsGrades[]);
						setGradesSummaryStatus('error');
						reject(response.data);
					}
				})
				.catch(() => {
					setGradesSummaryStatus('error');
					setGradedSessionItems([] as SessionsItemsGrades[]);
				});
		});

	const saveNewGrades = () =>
		new Promise((resolve, reject) => {
			const payload = {
				[`${student.id}`]: Object.values(changedGrades)
					.filter((newValue) => newValue.score !== null && newValue.score !== undefined)
					.map((newValue) => {
						return {
							course: newValue.courseId,
							session_item_id: newValue.sessionItemId,
							score: newValue.score
						};
					})
			};
			axios
				.post(`v1/todo/score`, payload)
				.then((response: AxiosResponse<CourseStudentGradeResponse>) => {
					if (response.status === 200 || response.status === 201) {
						setChangedGrades({} as IChangeGradeSchema);
						resolve(response.data);
						setReload(true);
						setIsSaving(false);
						dispatch(
							showMessage({
								message: 'Calificaciones guardadas exitosamente.',
								autoHideDuration: 10000, // ms
								anchorOrigin: {
									vertical: 'top', // top bottom
									horizontal: 'center' // left center right
								},
								variant: 'success' // success error info warning
							})
						);
					} else {
						setIsSaving(false);
						console.error("We couldn't save you data. Please try again.");
						reject(response.data);
						dispatch(
							showMessage({
								message:
									'Hubo un problema al guardar las calificaciones, por favor intenta nuevamente.',
								autoHideDuration: 10000, // ms
								anchorOrigin: {
									vertical: 'top', // top bottom
									horizontal: 'center' // left center right
								},
								variant: 'error' // success error info warning
							})
						);
					}
				})
				.catch(() => {
					setIsSaving(false);
					setGradesSummaryStatus('error');
					setGradedSessionItems([] as SessionsItemsGrades[]);
					dispatch(
						showMessage({
							message: 'Hubo un problema al guardar las calificaciones, por favor intenta nuevamente.',
							autoHideDuration: 10000, // ms
							anchorOrigin: {
								vertical: 'top', // top bottom
								horizontal: 'center' // left center right
							},
							variant: 'error' // success error info warning
						})
					);
				});
		});

	useEffect(() => {
		if (student) {
			setGradesSummaryStatus('loading');
			getGradesByStudentAndCourse();
		}
	}, [student]);

	useEffect(() => {
		if (isSaving) {
			saveNewGrades();
		}
	}, [isSaving]);

	useEffect(() => {
		let isAGradeWrong = false;
		const gradesArray = Object.values(changedGrades);
		gradesArray.forEach((grade) => {
			if (grade.score > user.tenant.max_grade || grade.score < 0) isAGradeWrong = true;
		});
		setDisableSaveButton(isAGradeWrong);
	}, [changedGrades]);

	return (
		<Card>
			<CardContent
				sx={{
					padding: '16px !important'
				}}
			>
				{!student && (
					<Typography
						width="100%"
						variant="body2"
						textAlign="center"
						sx={{
							padding: '1rem'
						}}
					>
						Aquí aparecerán los detalles del alumno que selecciones.
					</Typography>
				)}
				{student && <CardHeader title={getName(student)} />}

				{student && (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
									<TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Actividad / examen</TableCell>
									<TableCell
										sx={{ fontWeight: 'bold' }}
										align="center"
									>
										Peso
									</TableCell>
									<TableCell
										sx={{ fontWeight: 'bold' }}
										align="center"
									>
										Calificación
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{gradesSummaryStatus === 'successful' &&
									!!gradedSessionItems?.length &&
									gradedSessionItems
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((si) => {
											return (
												<TableRow key={si.id}>
													<TableCell
														component="th"
														scope="row"
														sx={
															si.hidden
																? { color: (theme) => theme.palette.grey[400] }
																: {}
														}
													>
														<Tooltip
															title={
																si.hidden
																	? 'Esta actividad/examen está oculta/o. Puedes cambiar la calificación pero no afectará el promedio del estudiante.'
																	: ''
															}
														>
															<Typography>{si.name}</Typography>
														</Tooltip>
													</TableCell>
													<TableCell
														align="center"
														sx={
															si.hidden
																? { color: (theme) => theme.palette.grey[400] }
																: {}
														}
													>
														{!!si.weight && si.weight !== 'NA' ? `${si.weight}%` : '0%'}
													</TableCell>
													<TableCell align="center">
														<GradeTextField
															score={si.score}
															maxGrade={user.tenant.max_grade}
															sessionItemId={si.id}
															handleChange={handleChange}
														/>
													</TableCell>
												</TableRow>
											);
										})}
								{gradesSummaryStatus === 'error' && (
									<TableRow>
										<TableCell
											align="center"
											colSpan={4}
											rowSpan={5}
										>
											<Typography
												variant="body1"
												mb={2}
											>
												Ha habido un error al cargar la lista de calificaciones. Vuelva a
												intentarlo
											</Typography>
											<Button
												variant="contained"
												onClick={() => {
													setGradesSummaryStatus('loading');
													getGradesByStudentAndCourse();
												}}
											>
												Intentar de nuevo
											</Button>
										</TableCell>
									</TableRow>
								)}
								{gradesSummaryStatus === 'loading' && (
									<TableRow>
										<TableCell
											align="center"
											colSpan={4}
											rowSpan={5}
										>
											<CircularProgress />
										</TableCell>
									</TableRow>
								)}
								{gradesSummaryStatus === 'successful' && !gradedSessionItems?.length && (
									<TableRow>
										<TableCell
											align="center"
											colSpan={2}
											rowSpan={5}
										>
											<Typography
												variant="body1"
												mb={2}
											>
												No hay actividades para calificar.
											</Typography>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
							{!!gradedSessionItems?.length && (
								<TableFooter>
									<TableRow>
										<TablePagination
											labelRowsPerPage="Filas por página"
											rowsPerPageOptions={[
												5,
												10,
												25,
												{ label: 'Todos', value: gradedSessionItems?.length }
											]}
											colSpan={3}
											count={gradedSessionItems?.length}
											rowsPerPage={rowsPerPage}
											page={page}
											onPageChange={handleChangePage}
											onRowsPerPageChange={handleChangeRowsPerPage}
											ActionsComponent={TablePaginationActions}
										/>
									</TableRow>
								</TableFooter>
							)}
						</Table>
					</TableContainer>
				)}
			</CardContent>

			{student && (
				<CardActions sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
					<LoadingButton
						loading={isSaving}
						variant="contained"
						color="secondary"
						disabled={disableSaveButton}
						onClick={() => {
							setIsSaving(true);
						}}
					>
						Guardar
					</LoadingButton>
				</CardActions>
			)}
		</Card>
	);
}

export default StudentGradeSummary;
