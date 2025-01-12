import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFooterTheme } from 'app/store/fuse/settingsSlice';
import clsx from 'clsx';
import { Typography } from '@mui/material';

type FooterLayout1Props = { className?: string };

/**
 * The footer layout 1.
 */
function FooterLayout1(props: FooterLayout1Props) {
	const { className } = props;

	const footerTheme = useSelector(selectFooterTheme);
	const year = new Date().getFullYear();

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className={clsx('relative z-20 shadow-md', className)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? footerTheme.palette.background.paper
							: footerTheme.palette.background.default
				}}
			>
				<Toolbar
					sx={{ height: '3rem !important', minHeight: '3rem !important', maxHeight: '3rem !important' }}
					className="px-8 sm:px-12 py-0 flex justify-center items-center overflow-x-auto"
				>
					<Typography
						variant="body2"
						fontWeight="500"
						sx={{ color: (theme) => theme.palette.text.disabled }}
					>
						Copyright © {year} Vermic Studios S.A. de C.V. Todos los derechos reservados.{' '}
					</Typography>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(FooterLayout1);
