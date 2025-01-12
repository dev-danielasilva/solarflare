import { Stack } from '@mui/material';
import { useState } from 'react';
import CourseGradesCard, { IStudents } from './CourseGradesCard';
import StudentGradeSummary from './StudentGradeSummary';

function GradesSummaryTeacher() {
	const [selectedStudentGrade, setSelectedStudentGrade] = useState<IStudents | null>(null);
	const [reload, setReload] = useState<boolean>(null);
	// const [groupSubjects, setGroupSubjects] = useState<ISubjectsAndGroupsOptions[]>([] as ISubjectsAndGroupsOptions[]);

	const handleStudentSelection = (studentGrade: IStudents) => {
		setSelectedStudentGrade(studentGrade);
	};

	return (
		<Stack spacing={2}>
			<CourseGradesCard
				selectStudentGrade={handleStudentSelection}
				selectedStudent={selectedStudentGrade}
				reload={reload}
				setReload={setReload}
			/>
			<StudentGradeSummary
				student={selectedStudentGrade}
				setReload={setReload}
			/>
		</Stack>
	);
}

export default GradesSummaryTeacher;
