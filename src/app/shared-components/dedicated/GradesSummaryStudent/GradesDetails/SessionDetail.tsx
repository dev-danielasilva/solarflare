import { CardContent, Paper, Stack, Typography, Divider } from '@mui/material';
import { SessionItem } from 'app/shared-components/general/SessionSlideshow/SessionSlideshow';
import { TopicSummary } from './GradesDetailsCard';
import StarsAndMedals from './StarsAndMedals';

interface SessionDetailProps {
	topic: TopicSummary;
}

function SessionDetail({ topic }: SessionDetailProps) {
	// TODO: Implementation of multiple sessions in a Topic
	const sessionItems: SessionItem[] = topic.sessions[0].session_items.filter((si) => !!si.active && !si.hidden);
	return (
		<Paper
			elevation={0}
			sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
		>
			<CardContent>
				<Stack spacing={2}>
					<Typography
						variant="body2"
						fontWeight={600}
					>
						{topic.name}
					</Typography>

					{!!topic.sessions[0]?.possible_stars && (
						<StarsAndMedals
							medalsOrStars="stars"
							numberOf={topic.sessions[0]?.stars}
							possibleNumber={topic.sessions[0]?.possible_stars}
						/>
					)}
					{/* <StarsAndMedals
						medalsOrStars="medals"
						numberOf={typeof session?.medals !== 'number' ? '-' : `${session?.medals}`}
					/> */}
				</Stack>

				{!!sessionItems.length && <Divider sx={{ mt: 1 }} />}
				{!sessionItems.length && (
					<Stack
						direction="row"
						justifyContent="space-between"
						sx={{ mt: 1 }}
					>
						<Typography
							variant="caption"
							sx={{
								display: 'flex',

								textAlign: 'center',
								justifyContent: 'center',
								lineHeight: '1.2',
								textWrap: 'wrap'
							}}
							width="100%"
						>
							No hay actividades ni exámenes en esta lección.
						</Typography>
					</Stack>
				)}
				{sessionItems
					.filter((si) => si.type === 'quiz' || si.type === 'activity')
					.map((si) => (
						<Stack
							direction="row"
							justifyContent="space-between"
							sx={{ mt: 1 }}
						>
							<Typography
								variant="body2"
								sx={{ textDecoration: 'underline' }}
							>
								{si.name}
							</Typography>
							<Typography fontWeight={600}>
								{typeof si.score !== 'number' ? '-' : `${si.score}`}
							</Typography>
						</Stack>
					))}
			</CardContent>
		</Paper>
	);
}

export default SessionDetail;
