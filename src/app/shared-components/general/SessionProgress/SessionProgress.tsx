import { Box, Stack, Typography } from '@mui/material';
import { ISessionProgress } from 'app/shared-components/dedicated/SessionsProgressCard/SessionsProgressCard';
import StarProgressSvg from '../StarProgress';
import { progressStarsAndMedals } from '../utils';

interface SessionProgressProps {
	session: ISessionProgress;
}
function SessionProgress({ session }: SessionProgressProps) {
	const { stars, progress, topic } = session;
	const { name, subject, image } = topic;

	return (
		<Stack spacing={1}>
			<img
				src={image}
				alt="Avatar"
				style={{ borderRadius: '10%', minWidth: '230px', aspectRatio: '16/9' }}
			/>

			{/* <LinearProgress
				value={progress}
				color="success"
				variant="determinate"
			/> */}

			<Stack
				direction="row"
				sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
			>
				<Typography
					variant="body1"
					fontWeight="bold"
					sx={{ textWrap: 'wrap' }}
				>
					{name}
				</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'row', mt: 0.75 }}>
					{progressStarsAndMedals(stars).map((fillHalfOrEmpty) => (
						<StarProgressSvg
							color="#F8D87C"
							value={fillHalfOrEmpty}
							width="1em"
						/>
					))}
				</Box>
			</Stack>
			<Typography
				variant="caption"
				sx={{ textWrap: 'wrap', mt: '0 !important' }}
			>
				{subject.name}
			</Typography>
		</Stack>
	);
}

export default SessionProgress;
