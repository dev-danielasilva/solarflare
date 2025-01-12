import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';

function WeeklyCardHeader() {
	return (
		<Stack
			direction="row"
			gap={2}
			alignItems="center"
			mb={3}
		>
			<Avatar
				sx={{ width: 100, height: 100 }}
				src="https://ada.assets.vermicstudios.com/media/jiraffe_4l6qOjh.png"
			/>
			<Stack gap={1}>
				<Typography
					variant="h5"
					fontWeight="600"
				>
					¡Completa tus actividades de esta semana!
				</Typography>
				<Typography variant="body1">Haz clic o toca la actividad para ver los detalles.</Typography>
			</Stack>
		</Stack>
	);
}

export default WeeklyCardHeader;
