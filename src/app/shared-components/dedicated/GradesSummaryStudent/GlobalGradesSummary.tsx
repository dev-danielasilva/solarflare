import { Skeleton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import _ from '@lodash';
import GlobalProgressCard from './GlobalProgressCard/GlobalProgressCard';
import GradesDetailsCard, { GradesSummary } from './GradesDetails/GradesDetailsCard';

interface Subject {
	id: number;
	name: string;
}

export interface Course {
	id: number;
	name: string;
	score: number;
	color: string;
	background_color: string;
	subject: Subject;
}

export interface GlobalGrades {
	courses: Course[];
	average_score: number;
}

interface GlobalGradesSummaryProps {
	showDetails?: boolean;
}

function GlobalGradesSummary({ showDetails }: GlobalGradesSummaryProps) {
	const [gradesAverage, setGradesAverage] = useState<GlobalGrades | null>(null);
	const [isLoadingGlobalGrades, setIsLoadingGlobalGrades] = useState<boolean>(true);
	const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

	const [selectedCourse, setSelectedCourse] = useState<GradesSummary | null>(null);
	const [isLoadingGradesSummary, setIsLoadingGradesSummary] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const getCourseGradesSummary = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/courses/${selectedCourseId}/grades/summary`)
				.then((response: AxiosResponse<GradesSummary>) => {
					if (response.data.id) {
						setSelectedCourse(response.data);
						resolve(response.data);
					} else {
						setSelectedCourse(null);
						reject(response.data);
					}
					setIsLoadingGradesSummary(false);
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
					setIsLoadingGradesSummary(false);
					setSelectedCourse(null);
				});
		});

	useEffect(() => {
		if (isLoadingGradesSummary && selectedCourseId) {
			getCourseGradesSummary();
		}
	}, [isLoadingGradesSummary, selectedCourseId]);

	const getGradesAverage = () =>
		new Promise((resolve) => {
			axios
				.get('v1/grades/average')
				.then((response: AxiosResponse<GlobalGrades>) => {
					if (response.data.courses && _.isNumber(response.data.average_score)) {
						setGradesAverage(response.data);
						if (showDetails) {
							setSelectedCourseId(response.data.courses[0].id);
							setIsLoadingGradesSummary(true);
						}
						resolve(response.data);
					} else {
						// reject(response.data);
						resolve(response.data);
					}
					setIsLoadingGlobalGrades(false);
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
					setIsLoadingGlobalGrades(false);
				});
		});

	const selectCourseId = (course: Course) => {
		if (showDetails) {
			if (course.id !== selectedCourse?.id) {
				setSelectedCourseId(course.id);
				setIsLoadingGradesSummary(true);
			}
		}
	};

	useEffect(() => {
		if (isLoadingGlobalGrades) {
			getGradesAverage();
		}
	}, [isLoadingGlobalGrades]);

	return (
		<Stack
			spacing={2}
			pb={5}
		>
			{!isLoadingGlobalGrades ? (
				<GlobalProgressCard
					grades={gradesAverage}
					onSelect={selectCourseId}
					showDetails={showDetails}
					selectedCourseId={selectedCourseId}
				/>
			) : (
				<Skeleton
					variant="rounded"
					width="100%"
					height={500}
				/>
			)}

			{isLoadingGradesSummary && showDetails && (
				<Skeleton
					variant="rounded"
					width="100%"
					height={500}
				/>
			)}
			{selectedCourseId === selectedCourse?.id && !isLoadingGlobalGrades && showDetails && (
				<GradesDetailsCard course={selectedCourse} />
			)}
		</Stack>
	);
}

export default GlobalGradesSummary;
