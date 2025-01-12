import { Stack, Typography } from '@mui/material';
import MedalProgressSvg from 'app/shared-components/general/MedalProgress';
import StarProgressSvg from 'app/shared-components/general/StarProgress';
import { progressStarsAndMedals } from 'app/shared-components/general/utils';

interface StarsAndMedalsProps {
	medalsOrStars: 'medals' | 'stars';
	numberOf: string | number;
	possibleNumber: string | number;
}

// {
// 	progressStarsAndMedals(parseFloat(topic?.sessions[0].stars), parseFloat(topic?.sessions[0].possible_stars)).map(
// 		(fillHalfOrEmpty, idx) => (
// 			<StarProgressSvg
// 				color="#F8D87C"
// 				value={fillHalfOrEmpty}
// 				width="1.5em"
// 				key={`sm-${idx}`}
// 			/>
// 		)
// 	);
// }

function StarsAndMedals({ medalsOrStars, numberOf, possibleNumber }: StarsAndMedalsProps) {
	const starsOrMedals = medalsOrStars === 'medals' ? 'medallas' : 'estrellas';
	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			alignItems="flex-start"
		>
			<Stack spacing={0}>
				<Typography variant="body2">{starsOrMedals}</Typography>
				<Typography
					variant="body2"
					fontWeight={600}
				>
					{numberOf}/{possibleNumber}
				</Typography>
			</Stack>

			<Stack
				direction="row"
				mt={1}
			>
				{progressStarsAndMedals(
					typeof numberOf === 'number' ? numberOf : parseFloat(numberOf),
					typeof possibleNumber === 'number' ? possibleNumber : parseFloat(possibleNumber)
				).map((fillHalfOrEmpty, idx) => {
					return medalsOrStars === 'stars' ? (
						<StarProgressSvg
							color="#F8D87C"
							value={fillHalfOrEmpty}
							width="1.5em"
							key={`sm-${idx}`}
						/>
					) : (
						<MedalProgressSvg
							color="#F8D87C"
							value={fillHalfOrEmpty}
							width="1.5em"
							key={`sm-${idx}`}
						/>
					);
				})}
			</Stack>
		</Stack>
	);
}

export default StarsAndMedals;
