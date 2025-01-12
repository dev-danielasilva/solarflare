import { useNavigate } from 'react-router';
import { Box, Chip, Divider, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { SessionItemWeeklyActivities } from './WeeklyCard';
import { getMonthOrDay } from './utils';

function WeeklyActivity({ si, to }: { si: SessionItemWeeklyActivities; to: string }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const dueDate = new Date(si.due_date * 1000);
	const dayOfWeek = getMonthOrDay('dayOfWeek', dueDate.getDay());
	const day = dueDate.getDate();
	const month = getMonthOrDay('month', dueDate.getMonth() + 1);
	const year = dueDate.getFullYear();
	const daysUntilDueDate = (dueDate: Date, status: boolean, isGraded) => {
		const currentDate = new Date();
		const timeDiff = dueDate.getTime() - currentDate.getTime();
		const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

		if (isGraded) {
			return { label: 'Calificado', color: '#2D9723', backgroundColor: '#CBF5CD' };
		}

		if (status) {
			return { label: 'Completado', color: '#2D9723', backgroundColor: '#CBF5CD' };
		}

		if (dayDiff === 0) {
			return { label: 'Hoy', color: '#847700', backgroundColor: '#FFF3D6' };
		}
		if (dayDiff === 1) {
			return { label: 'Mañana', color: '#004D84', backgroundColor: '#D6E6FF' };
		}
		if (dayDiff > 1) {
			return {
				label: `En ${dayDiff} días`,
				color: '#004D84',
				backgroundColor: '#D6E6FF'
			};
		}
		return {
			label: `Hace ${Math.abs(dayDiff)} ${Math.abs(dayDiff) === 1 ? 'día' : 'días'}`,
			color: '#C90000',
			backgroundColor: '#E4BCBC'
		};
	};

	const daysRemaining = daysUntilDueDate(
		dueDate,
		Boolean(si.submission) || Boolean(si.quiz_status),
		si.score !== null
	);

	return (
		<Box
			sx={{ position: 'relative', pt: 2, mx: 3, cursor: 'pointer' }}
			onClick={() => navigate(to)}
		>
			<Paper
				elevation={0}
				sx={{ backgroundColor: (theme) => theme.palette.grey[100], p: 2 }}
			>
				<Grid container>
					<Grid
						item
						xs={12}
						sm={4}
						md={3}
						lg={3}
						sx={{
							px: 2,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: { sm: 'flex-start', xs: 'center', md: 'flex-start', lg: 'flex-start' }
						}}
					>
						<div>
							<Chip
								label={daysRemaining.label}
								sx={{
									px: 1,
									color: daysRemaining.color,
									backgroundColor: daysRemaining.backgroundColor
								}}
							/>
						</div>
						<Typography
							variant="body2"
							sx={{ color: (theme) => theme.palette.grey[700], mt: 1 }}
						>
							Fecha límite
						</Typography>
						<Stack
							direction="row"
							mt={1}
						>
							<CalendarMonthOutlinedIcon />
							<Typography
								variant="body2"
								sx={{ ml: 1 }}
							>
								{dayOfWeek} {day} <br /> {month} {year}
							</Typography>
						</Stack>
					</Grid>
					<Grid
						item
						xs={12}
						sm={8}
						md={9}
						lg={9}
						sx={{
							width: '100%',
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row', md: 'row', lg: 'row' },
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Divider
							orientation={isMobile ? 'horizontal' : 'vertical'}
							variant="middle"
							flexItem
							sx={{
								mr: 2,
								borderColor: (theme) => `${theme.palette.grey[300]} !important`,
								borderWidth: '0.12rem !important',
								mt: 2
							}}
						/>
						{!!si.image && (
							<Box
								sx={{
									minWidth: '180px',
									width: '180px',
									mr: 2,
									justifyContent: 'center'
								}}
							>
								<img
									style={{
										borderRadius: '1rem',
										objectFit: 'cover',
										aspectRatio: '16 / 9',
										overflow: 'hidden',
										marginTop: 10
									}}
									src={si.image || 'assets/images/mock/new-topic.png'}
									alt="Portada de Actividad o Examen"
								/>
							</Box>
						)}
						<Stack sx={{ width: '100%' }}>
							<Typography
								variant="body2"
								fontWeight={600}
								sx={{ mt: 1 }}
							>
								{si.name}
							</Typography>
							<Typography
								variant="body2"
								sx={{ mt: 2 }}
							>
								{si.description}
							</Typography>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
			<Chip
				sx={{
					position: 'absolute',
					top: 0,
					right: 0,
					backgroundColor: si.type === 'exam' || si.type === 'quiz' ? '#D579DA' : '#79BDDA',
					color: 'white'
				}}
				label={si.type === 'exam' || si.type === 'quiz' ? 'Examen' : 'Actividad'}
			/>
		</Box>
	);
}

export default WeeklyActivity;
