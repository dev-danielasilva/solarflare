import {
	Autocomplete,
	Box,
	Button,
	Card,
	CircularProgress,
	IconButton,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
	useTheme
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import jwtService from 'src/app/auth/services/jwtService';
import { getName } from 'src/app/utils';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

interface CoursesResponse {
	grade: number;
	group: string;
	id: number;
	name: string;
	subject: { id: number; name: string };
	tenant: number;
}

export interface IStudents {
	id: number;
	first_name: string;
	middle_name: string;
	last_name: string;
	course_id: number;
	score?: number | null | 'NA';
}

interface GradesResponse {
	id: number;
	name: string;
	grade: number;
	group: string;
	students: IStudents[];
}
export interface ISubjectsAndGroupsOptions {
	id: number;
	name: string;
}

interface IGroupsOptions {
	[key: string]: ISubjectsAndGroupsOptions[];
}

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

interface CourseGradesProps {
	selectStudentGrade: (k: IStudents) => void;
	selectedStudent: IStudents;
	reload: boolean;
	setReload: Dispatch<SetStateAction<boolean>>;
}

function CourseGradesCard({ selectStudentGrade, selectedStudent, reload, setReload }: CourseGradesProps) {
	const dispatch = useDispatch();
	const [groupsPerSubject, setGroupsPerSubject] = useState<IGroupsOptions>(null);
	const [groups, setGroups] = useState<ISubjectsAndGroupsOptions[]>([] as ISubjectsAndGroupsOptions[]);
	const [subjects, setSubjects] = useState<ISubjectsAndGroupsOptions[]>([] as ISubjectsAndGroupsOptions[]);
	const [selectedSubject, setSelectedSubject] = useState<ISubjectsAndGroupsOptions>(null);
	const [selectedGroup, setSelectedGroup] = useState<ISubjectsAndGroupsOptions>(null);

	const [students, setStudents] = useState<IStudents[] | null>([] as IStudents[]);
	const [studentsStatus, setStudentsStatus] = useState<'successful' | 'loading' | 'error'>('loading');

	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);

	const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	function getCourses() {
		jwtService
			.getCourses()
			.then((courses: CoursesResponse[]) => {
				let _subjects: ISubjectsAndGroupsOptions[] = [] as ISubjectsAndGroupsOptions[];
				let _groupsPerSubject: IGroupsOptions = {};
				courses.forEach((c) => {
					const subjectExists = _subjects.find((s) => s.id === c.subject.id);
					if (!subjectExists) {
						_subjects = [..._subjects, { id: c.subject.id, name: c.subject.name }];
					}

					if (!_groupsPerSubject[c.subject.id]) {
						_groupsPerSubject = {
							..._groupsPerSubject,
							...{ [`${c.subject.id}`]: [{ id: c.id, name: `${c.grade} ${c.group}` }] }
						};
					} else {
						const subjectsGroups = [
							..._groupsPerSubject[c.subject.id],
							{ id: c.id, name: `${c.grade} ${c.group}` }
						];
						_groupsPerSubject = { ..._groupsPerSubject, ...{ [`${c.subject.id}`]: subjectsGroups } };
					}
				});
				setSubjects(_subjects);
				setGroupsPerSubject(_groupsPerSubject);
				setSelectedSubject(_subjects[0]);
			})
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error('There has been an error trying to get courses. ', e);
			});
	}
	const getGrades = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/courses/${selectedGroup?.id}/students/grades`)
				.then((response: AxiosResponse<GradesResponse>) => {
					if (response.data.students) {
						setStudentsStatus('successful');
						setStudents(
							response.data.students.map((st) => {
								const _st = { ...st, course_id: response.data.id };
								return _st;
							})
						);
						resolve(response.data);
					} else {
						setStudents([]);
						setStudentsStatus('error');
						reject(response.data);
					}
					setReload(false);
				})
				.catch((e) => {
					dispatch(
						showMessage({
							message: 'Ocurrió un error. Por favor intenta de nuevo.', // text or html
							autoHideDuration: 6000, // ms
							anchorOrigin: {
								vertical: 'top', // top bottom
								horizontal: 'center' // left center right
							},
							variant: 'error' // success error info warning null
						})
					);
					setStudentsStatus('error');
					setStudents(null);
					setReload(false);
				});
		});

	useEffect(() => {
		if (selectedSubject?.id) {
			setGroups(groupsPerSubject[selectedSubject.id]);
			setSelectedGroup(groupsPerSubject[selectedSubject.id][0]);
		}
	}, [selectedSubject]);

	useEffect(() => {
		setStudentsStatus('loading');
		if (selectedGroup?.id) {
			getGrades();
		}
	}, [selectedGroup, reload]);

	useEffect(() => {
		getCourses();
	}, []);

	return (
		<Card>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', m: 3, gap: 3 }}>
				<Stack spacing={2}>
					<Typography
						variant="h5"
						fontWeight="bold"
					>
						Promedios
					</Typography>
					<Typography>Selecciona al alumno para ver más detalles sobre su calificación</Typography>
				</Stack>
				<Stack
					direction="row"
					spacing={2}
					alignItems="flex-end"
				>
					{/* Subject */}
					{!!subjects?.length && selectedSubject && (
						<Autocomplete
							disablePortal
							disableClearable
							value={selectedSubject}
							onChange={(_, value) => {
								setSelectedSubject(value);
							}}
							options={subjects}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Materia"
									sx={{ width: 170 }}
								/>
							)}
						/>
					)}
					{/* Group */}
					{!!groups?.length && (
						<Autocomplete
							disableClearable
							value={selectedGroup}
							onChange={(_, value) => setSelectedGroup(value)}
							options={groups}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Grupo"
									sx={{ width: 100 }}
								/>
							)}
						/>
					)}
				</Stack>
			</Box>
			<Box m={3}>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}>
								<TableCell sx={{ fontWeight: 'bold' }}>Alumno</TableCell>
								<TableCell
									sx={{ fontWeight: 'bold' }}
									align="center"
									width="30%"
								>
									Promedio
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{studentsStatus === 'successful' &&
								!!students?.length &&
								students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => {
									return (
										<TableRow
											key={student.id}
											sx={{
												cursor: 'pointer',
												...(selectedStudent?.id === student.id
													? { backgroundColor: (theme) => theme.palette.grey[100] }
													: {})
											}}
											onClick={() => {
												selectStudentGrade(student);
											}}
										>
											<TableCell
												component="th"
												scope="row"
											>
												{getName(student)}
											</TableCell>
											<TableCell align="center">
												{student.score !== undefined &&
												student.score !== null &&
												student.score !== 'NA'
													? student.score
													: '-'}
											</TableCell>
										</TableRow>
									);
								})}
							{studentsStatus === 'error' && (
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
											Ha habido un error al cargar la lista de alumnos. Vuelva a intentarlo
										</Typography>
										<Button
											variant="contained"
											onClick={() => {
												setStudentsStatus('loading');
												getGrades();
											}}
										>
											Intentar de nuevo
										</Button>
									</TableCell>
								</TableRow>
							)}
							{studentsStatus === 'loading' && (
								<TableRow>
									<TableCell
										align="center"
										colSpan={2}
										rowSpan={5}
									>
										<CircularProgress />
									</TableCell>
								</TableRow>
							)}
							{studentsStatus === 'successful' && !students?.length && (
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
											Aún no tienes alumnos asignados a este grupo.
										</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						{!!students?.length && (
							<TableFooter>
								<TableRow>
									<TablePagination
										labelRowsPerPage="Filas por página"
										rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: students?.length }]}
										colSpan={2}
										count={students?.length}
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
			</Box>
		</Card>
	);
}

export default CourseGradesCard;
