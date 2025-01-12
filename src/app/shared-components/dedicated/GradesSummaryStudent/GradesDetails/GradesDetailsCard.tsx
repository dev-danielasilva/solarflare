import { Card, CardContent, Grid, Typography } from '@mui/material';
import { SessionItem } from 'app/shared-components/general/SessionSlideshow/SessionSlideshow';
import SessionDetail from './SessionDetail';

export interface TopicSummary {
	id: number;
	name: string;
	sessions: ISessionDetail[];
}

interface SubjectSummary {
	id: number;
	name: string;
	topics: TopicSummary[];
}

export interface GradesSummary {
	id: number;
	name: string;
	subject: SubjectSummary;
}

export interface ISessionDetail {
	id: number;
	name: string;
	stars: number;
	medals: number;
	session_items: SessionItem[];
}

interface GradesDetailsCardProps {
	course: GradesSummary;
}

// Curso: Matemáticas 1
// Subject: Matemáticas
// Topic: Sumas y Restas
// Session: Sumas
// SessionItem: Ejercicio de sumas

function GradesDetailsCard({ course }: GradesDetailsCardProps) {
	return (
		<Card>
			<CardContent>
				<Typography
					variant="h5"
					fontWeight="600"
					sx={{ mb: 2 }}
				>
					{course ? `${course.subject.name}` : 'Hubo un problema al cargar tus calificaciones.'}
				</Typography>
				<Grid
					container
					spacing={2}
					sx={{ minHeight: '25em', maxHeight: '40em', overflowY: 'scroll' }}
				>
					{course?.subject?.topics.map((topic) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
						>
							<SessionDetail topic={topic} />
						</Grid>
					))}
				</Grid>
			</CardContent>
		</Card>
	);
}

export default GradesDetailsCard;
