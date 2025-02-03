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
