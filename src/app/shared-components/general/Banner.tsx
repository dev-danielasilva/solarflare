import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { selectUser } from 'app/store/user/userSlice';
import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import CSS from 'csstype';

interface IBannerProps {
	title?: string;
	subtitle?: string;
	subtitlePosition?: 'above' | 'under';
	children?: ReactElement;
	isContent?: boolean;
	boxStyle?: CSS.Properties;
}

export function Banner({ title, subtitle, subtitlePosition, children, isContent, boxStyle }: IBannerProps) {
	const theme = useTheme();
	const user = useSelector(selectUser);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Box
			sx={{
				minHeight: isContent ? '25vh' : isMobile ? '17vh' : user.role === 'student' ? '25vh' : '20vh',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				...(boxStyle || {})
			}}
			className="sf-header"
		>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				{subtitlePosition === 'above' && (
					<Typography
						variant="h6"
						lineHeight="1"
						sx={{
							marginBottom: '1.5rem'
						}}
					>
						{subtitle}
					</Typography>
				)}
				<Typography
					variant="h3"
					fontWeight="bold"
					lineHeight="1.2"
				>
					{title}
				</Typography>
				{subtitlePosition === 'under' && (
					<Typography sx={{ marginTop: '1.8rem', fontSize: '1.8rem' }}>{subtitle}</Typography>
				)}
			</Box>
			{children}
		</Box>
	);
}
