import { Card, CardContent, Grid, Typography } from '@mui/material';
import GradeCard from 'app/shared-components/general/GradeCard/GradeCard';
import { useState } from 'react';
import { selectUser } from 'app/store/user/userSlice';
import { useSelector } from 'react-redux';
import BaseUserType from 'app/store/user/BaseUserType';
import SubjectDialog from '../../LHDialogs/SubjectDialog';
import { Course, GlobalGrades } from '../GlobalGradesSummary';

interface GlobalProgressCardProps {
	grades: GlobalGrades | null;
	onSelect: (course: Course) => void;
	selectedCourseId: number;
	showDetails?: boolean;
}

function GlobalProgressCard({ grades, onSelect, selectedCourseId, showDetails }: GlobalProgressCardProps) {
	const user: BaseUserType = useSelector(selectUser);
	const [openTopicDialog, setOpenTopicDialog] = useState<boolean>(false);
	const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
	const maxGrade = user?.tenant?.max_grade ? user.tenant.max_grade : 10;

	const handleCloseDialog = () => {
		setSelectedCourse(null);
		setOpenTopicDialog(false);
	};
	return (
		<Card sx={{ maxHeight: '100%' }}>
			<CardContent>
				{/* Title */}
				<Typography
					variant="h5"
					fontWeight="600"
				>
					{grades ? '¡Mira todo tu progreso!' : 'Hubo un problema al cargar tus calificaciones.'}
				</Typography>
				{/* Cards Layout */}
				{Boolean(grades) && (
					<Grid
						container
						spacing={2}
						mt={4}
						rowGap={2}
					>
						{/* Trophy */}
						<Grid
							item
							xs={12}
							sm={5}
						>
							<GradeCard
								maxGrade={maxGrade}
								grade={
									typeof grades?.average_score === 'number'
										? Math.round(grades.average_score * 10) / 10
										: 0
								}
								color="#F8D87C"
								bgColor="#fdf4d8"
								isGlobal
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={7}
							width="100%"
							justifyContent="center"
							alignItems="center"
							sx={{ maxHeight: '500px', overflowY: 'scroll' }}
						>
							{/* Grid Layout Subjects */}
							<Grid
								container
								spacing={2}
								rowGap={2}
							>
								{grades?.courses.map((course) => {
									const { id, score, subject, color, background_color } = course;
									return (
										<Grid
											onClick={() => {
												if (showDetails) {
													onSelect(course);
												} else {
													setSelectedCourse(course.id);
													setOpenTopicDialog(true);
												}
											}}
											key={subject.id}
											item
											xs={6}
											sm={6}
											lg={4}
										>
											<GradeCard
												grade={Math.round(score * maxGrade) / maxGrade}
												subject={subject.name}
												color={color}
												bgColor={background_color}
												changeColor={selectedCourseId !== id && showDetails}
												showDetails={showDetails}
												maxGrade={maxGrade}
											/>
										</Grid>
									);
								})}
							</Grid>
						</Grid>
					</Grid>
				)}
			</CardContent>
			<SubjectDialog
				open={openTopicDialog}
				handleClose={handleCloseDialog}
				courseId={selectedCourse}
			/>
		</Card>
	);
}

export default GlobalProgressCard;
