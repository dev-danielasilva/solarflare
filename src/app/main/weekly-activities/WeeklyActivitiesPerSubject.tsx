import { Box, Chip, Stack } from '@mui/material';
import { CourseWeeklyActivities } from './WeeklyCard';
import WeeklyActivity from './WeeklyActivity';

interface WeeklyActivitiesPerSubjectProps {
	courses: CourseWeeklyActivities[];
}

function WeeklyActivitiesPerSubject({ courses }: WeeklyActivitiesPerSubjectProps) {
	return (
		<Stack
			gap={4}
			sx={{ maxHeight: 600, overflow: 'scroll' }}
		>
			{courses.map((course, index) => (
				<Stack
					gap={2}
					key={index}
				>
					<div>
						<Chip
							sx={{ backgroundColor: course.background_color, px: 2 }}
							label={course.subject.name}
						/>
					</div>
					<Box
						sx={{
							borderLeft: '0.25rem solid',
							borderColor: course.background_color
						}}
					>
						{course.subject.topics.map((topic) => (
							<>
								{topic.sessions[0].session_items.map((si) => {
									return (
										<WeeklyActivity
											si={si}
											to={`courses/${course.id}/subjects/${course.subject.id}/topics/${
												topic.id
											}/todos/${si.id}/${si.type === 'activity' ? 'activity' : 'exam'}`}
										/>
									);
								})}
							</>
						))}
					</Box>
				</Stack>
			))}
		</Stack>
	);
}

export default WeeklyActivitiesPerSubject;
