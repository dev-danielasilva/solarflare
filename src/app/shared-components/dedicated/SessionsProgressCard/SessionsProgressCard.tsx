import { Card, CardContent, Stack, Typography } from '@mui/material';
import SessionProgress from 'app/shared-components/general/SessionProgress/SessionProgress';

export interface ISessionProgress {
	id: number;
	stars: number;
	progress: number;
	topic: Topic;
}

interface Topic {
	id: number;
	name: string;
	image: string;
	subject: {
		id: number;
		name: string;
	};
}

const sessionsProgress: ISessionProgress[] = [
	{
		id: 1,
		stars: 1.85,
		progress: 90,
		topic: {
			id: 1,
			name: 'Multiplicaciones y divisiones',
			image: 'assets/images/lessons-images/lesson_image_maths.png',
			subject: {
				id: 1,
				name: 'Matemáticas'
			}
		}
	},
	{
		id: 2,
		stars: 0.5,
		progress: 20,
		topic: {
			id: 2,
			name: 'Arte antiguo',
			image: 'assets/images/lessons-images/lesson_image_arts.png',
			subject: {
				id: 2,
				name: 'Historia'
			}
		}
	},
	{
		id: 3,
		stars: 0,
		progress: 0,
		topic: {
			id: 3,
			name: 'Pronouns',
			image: 'assets/images/lessons-images/lesson_image_english.png',
			subject: {
				id: 3,
				name: 'Lengua Extranjera'
			}
		}
	},
	{
		id: 1,
		stars: 1.85,
		progress: 90,
		topic: {
			id: 1,
			name: 'Multiplicaciones y divisiones',
			image: 'assets/images/lessons-images/lesson_image_maths.png',
			subject: {
				id: 1,
				name: 'Matemáticas'
			}
		}
	},
	{
		id: 2,
		stars: 0.5,
		progress: 20,
		topic: {
			id: 2,
			name: 'Arte antiguo',
			image: 'assets/images/lessons-images/lesson_image_arts.png',
			subject: {
				id: 2,
				name: 'Historia'
			}
		}
	},
	{
		id: 3,
		stars: 0,
		progress: 0,
		topic: {
			id: 3,
			name: 'Pronouns',
			image: 'assets/images/lessons-images/lesson_image_english.png',
			subject: {
				id: 3,
				name: 'Lengua Extranjera'
			}
		}
	}
];
function SessionsProgressCard() {
	return (
		<Card>
			<CardContent>
				{/* Title */}
				<Typography
					variant="h5"
					fontWeight="600"
					mb={2}
				>
					Continúa donde te quedaste
				</Typography>
				{/* Cards Layout */}
				<Stack
					direction="row"
					spacing={5}
					sx={{
						overflowX: 'scroll'
					}}
				>
					{sessionsProgress.map((sp, idx) => {
						return <SessionProgress session={sp} key={`sp-${idx}`}/>;
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default SessionsProgressCard;
