// react
import { useEffect, useState } from 'react';
// axios
import axios, { AxiosResponse } from 'axios';
// mui
import { Box, Button, Card, CardContent, Skeleton, Typography } from '@mui/material';
// components
import WeeklyCardHeader from './WeeklyCardHeader';
import WeeklyActivitiesPerSubject from './WeeklyActivitiesPerSubject';
import { getWeekBounds } from './utils';

// courses/3/subjects/3/topics/30/todos/1033/exam

// const MOCK_COURSES: CourseWeeklyActivities[] = [
// 	{
// 		id: 3,
// 		background_color: '#D0E4F5',
// 		subject: {
// 			id: 3,
// 			name: 'Matemáticas',
// 			topics: [
// 				{
// 					id: 30,
// 					sessions: [
// 						{
// 							id: 1,
// 							name: 'Álgebra Básica',
// 							sessionItems: [
// 								{
// 									id: 1033,
// 									name: 'Ejercicio de multiplicaciones',
// 									description:
// 										'Práctica para fortalecer habilidades matemáticas, resolviendo problemas que requieren multiplicar números y aplicar diferentes estrategias de cálculo.',
// 									type: 'activity',
// 									dueDate: '2024-07-12',
// 									status: 'pending',
// 									image: ''
// 								},
// 								{
// 									id: 1033,
// 									name: 'Examen de multiplicaciones',
// 									description:
// 										'Evaluación para medir la habilidad de resolver problemas de multiplicación básica utilizando números pequeños y comprensión de conceptos matemáticas.',
// 									type: 'exam',
// 									dueDate: '2024-07-11',
// 									status: 'pending',
// 									image: ''
// 								}
// 							]
// 						}
// 					]
// 				}
// 			]
// 		}
// 	},
// 	{
// 		id: 3,
// 		background_color: '#FFD6C4',
// 		subject: {
// 			id: 33,
// 			name: 'Lengua Materna',
// 			topics: [
// 				{
// 					id: 30,
// 					sessions: [
// 						{
// 							id: 2,
// 							name: 'Gramática y Vocabulario',
// 							sessionItems: [
// 								{
// 									id: 1033,
// 									name: 'Ejercicio de sinónimos',
// 									description:
// 										'Una actividad efectiva para aprender las diferencias entre los sinónimos y antónimos es proporcionar listas de palabras relacionadas y pedir a los estudiantes que las clasifiquen según su similitud o cointrariedad de significado.',
// 									type: 'activity',
// 									dueDate: '2024-07-08',
// 									status: 'completed',
// 									image: ''
// 								},
// 								{
// 									id: 1033,
// 									name: 'Sinónimos y antónimos',
// 									description:
// 										'El examen evaluará el dominio de los conceptos clave del curso, incluyendo análisis, síntesis y aplicación del conocimiento adquirido.',
// 									type: 'exam',
// 									dueDate: '2024-07-01',
// 									status: 'pending',
// 									image: ''
// 								}
// 							]
// 						}
// 					]
// 				}
// 			]
// 		}
// 	}
// ];

export interface SessionItemWeeklyActivities {
	id: number;
	name: string;
	description: string;
	type: 'activity' | 'exam';
	due_date: string;
	status: string;
	image: string;
}

interface SessionWeeklyActivities {
	id: number;
	name: string;
	session_items: SessionItemWeeklyActivities[];
}

interface TopicWeeklyActivities {
	id: number;
	sessions: SessionWeeklyActivities[];
}

interface SubjectWeeklyActivities {
	id: number;
	name: string;
	topics: TopicWeeklyActivities[];
}

export interface CourseWeeklyActivities {
	id: number;
	background_color: string;
	subject: SubjectWeeklyActivities;
}

function WeeklyCard() {
	const [courses, setCourses] = useState<CourseWeeklyActivities[]>([] as CourseWeeklyActivities[]);
	const [weeklyCardStatus, setWeeklyCardStatus] = useState<'loading' | 'error' | 'success'>('loading');
	const { firstDay, lastDay } = getWeekBounds();

	console.log({ firstDay, lastDay });
	const getWeeklyActivities = () =>
		new Promise(() => {
			axios
				.get(`v1/subjects/weekly/summary/?startDate=${firstDay.valueOf()}&lastStartDate=${lastDay.valueOf()}`)
				.then((response: AxiosResponse<CourseWeeklyActivities[]>) => {
					if (response.data.length) {
						setCourses(response.data);
					} else {
						setCourses([] as CourseWeeklyActivities[]);
					}
					setWeeklyCardStatus('success');
				})
				.catch(() => {
					setWeeklyCardStatus('error');
					setCourses([] as CourseWeeklyActivities[]);
					// setCourses(MOCK_COURSES);
					// setWeeklyCardStatus('success');
				});
		});

	useEffect(() => {
		if (weeklyCardStatus === 'loading') {
			getWeeklyActivities();
		}
	}, [weeklyCardStatus]);
	return weeklyCardStatus !== 'loading' ? (
		<Card>
			<CardContent sx={{ p: 6, pb: '48px !important' }}>
				{weeklyCardStatus === 'success' ? (
					<>
						<WeeklyCardHeader />
						<WeeklyActivitiesPerSubject courses={courses} />
						{courses.length === 0 && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 2
								}}
							>
								<Typography variant="body1">
									No tienes actividades o examenes que entregar durante esta semana.
								</Typography>
							</Box>
						)}
					</>
				) : (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2
						}}
					>
						<Typography variant="body1">
							Ha habido un error al cargar tus actividades. Inténtalo de nuevo.
						</Typography>
						<Button
							variant="contained"
							onClick={() => {
								setWeeklyCardStatus('loading');
							}}
						>
							Recargar
						</Button>
					</Box>
				)}
			</CardContent>
		</Card>
	) : (
		<Skeleton
			variant="rounded"
			width="100%"
			height={500}
		/>
	);
}

export default WeeklyCard;
