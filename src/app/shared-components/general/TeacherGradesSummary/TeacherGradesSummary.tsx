import { Box, Skeleton, Stack } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { getFullDate } from 'src/app/utils';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import TeacherGradesSummaryCard from './TeacherGradesSummaryCard';
import NoItemsFoundCard from '../NoItemsFoundCard/NoItemsFoundCard';

interface CoursesGradesAverage {
	id: number;
	name: string;
	grade: string;
	group: string;
	student_count: number; // All `student` users that are part of the course
	start_date: string;
	end_date: string;
	score: number; // To calculate the score for a non-student, for each course sum all averages for every student that is part of the course and divide by number of students.
	color: string;
	background_color: string;
	subject: {
		id: number;
		name: string;
	};
}

export interface GroupsGradesAverage {
	name: string;
	student_count: number;
	start_date: string;
	end_date: string;
	courses: CoursesGradesAverage[];
}

export default function TeacherGradesSummary() {
	const dispatch = useDispatch();
	const [groupsGrades, setGroupsGrades] = useState<GroupsGradesAverage[]>([] as GroupsGradesAverage[]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getGroupsGrades = () =>
		new Promise((resolve, reject) => {
			axios
				.get('v1/grades/average')
				.then((response: AxiosResponse<{ courses: CoursesGradesAverage[] }>) => {
					if (response?.data?.courses?.length > 0) {
						let groups: { [key: string]: GroupsGradesAverage } = {};
						response.data.courses.forEach((course) => {
							const keyName = `${course.grade}${course.group}`;
							const startDate = parseInt(course.start_date);
							if (!groups[keyName]) {
								groups = {
									...groups,
									[keyName]: {
										name: `${course.grade} ${course.group}`,
										student_count: course.student_count,
										start_date: getFullDate(startDate),
										end_date: getFullDate(course.end_date),
										courses: [course]
									}
								};
							} else {
								const existingGroup: GroupsGradesAverage = groups[keyName];
								groups = {
									...groups,
									[keyName]: { ...existingGroup, courses: [...existingGroup.courses, course] }
								};
							}
						});
						const groupsList: GroupsGradesAverage[] = Object.values(groups);
						setGroupsGrades(groupsList);
						resolve(response.data);
					} else {
						reject('No courses found');
					}
					setIsLoading(false);
				})
				.catch(() => {
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
					setIsLoading(false);
				});
		});

	useEffect(() => {
		if (isLoading && !groupsGrades.length) {
			getGroupsGrades().catch((e) => {
				console.error(e);
			});
		}
	}, [isLoading, groupsGrades]);

	return (
		<Stack spacing={2}>
			{!!groupsGrades.length && groupsGrades.map((group) => <TeacherGradesSummaryCard group={group} />)}
			{!isLoading && groupsGrades.length == 0 && (
				<NoItemsFoundCard
					message="No tienes ningún curso asignado."
					title="Cursos"
				/>
			)}
			{
				isLoading &&           
					<Box>
						<Skeleton
							variant="rounded"
							height={300}

						></Skeleton>
												<Skeleton
							variant="rounded"
							height={300}
							sx={{ marginTop: '30px' }}
						></Skeleton>
					</Box>
			}
		</Stack>
	);
}
