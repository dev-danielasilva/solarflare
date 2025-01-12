import { Box, Typography } from '@mui/material';
import MedalProgressSvg from './MedalProgressSvg';
import TrophyProgressSvg from './TrophyProgressSvg';

interface GradeCardProps {
	grade: number;
	subject?: string;
	color: string;
	bgColor: string;
	isGlobal?: boolean;
	changeColor?: boolean;
	// showDetails?: boolean;
	maxGrade: number;
}

function GradeCard({ subject, grade, color, bgColor, isGlobal, changeColor, maxGrade }: GradeCardProps) {
	return (
		<Box
			sx={{
				borderRadius: 5,
				backgroundColor: bgColor,
				width: '100%',
				height: '100%',
				opacity: changeColor ? 0.3 : 1,
				cursor: !isGlobal ? 'pointer' : 'default'
			}}
		>
			<Box
				position="relative"
				width="100%"
				sx={{
					position: 'relative',
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Box
					sx={{
						borderRadius: 5,
						background: bgColor,
						position: 'absolute',
						padding: 1,
						px: '1.25em',
						top: '-1em',
						opacity: changeColor ? 0.3 : 1
					}}
				>
					<Typography
						variant={isGlobal ? 'h6' : 'body2'}
						fontWeight="bold"
						color="black"
					>
						{!!grade || grade === 0 ? grade : '-'} / {maxGrade}
					</Typography>
				</Box>
			</Box>
			{!isGlobal ? (
				<Box
					px="2em"
					pt={3}
					pb={2}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between',
						height: '100%'
					}}
				>
					<MedalProgressSvg
						grade={grade}
						color={color}
						changeColor={changeColor}
						maxGrade={maxGrade}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%'
						}}
					>
						<Typography
							variant="body1"
							fontSize="1.1em"
							fontWeight="bold"
							textAlign="center"
							mt={1}
							lineHeight={1}
							sx={{ opacity: changeColor ? 0.3 : 1 }}
						>
							{subject}
						</Typography>
					</Box>
				</Box>
			) : (
				<Box
					px="2em"
					pt={5}
					pb={2}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%'
					}}
				>
					<TrophyProgressSvg
						grade={grade}
						color={color}
						maxGrade={maxGrade}
					/>
				</Box>
			)}
		</Box>
	);
}

export default GradeCard;
