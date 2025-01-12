/* eslint-disable */
import { ThemeProvider } from '@mui/material/styles';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectNavbarTheme } from 'app/store/fuse/settingsSlice';
import { selectFuseNavbar, navbarCloseMobile } from 'app/store/fuse/navbarSlice';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import NavbarToggleFabLayout1 from 'app/theme-layouts/layout1/components/NavbarToggleFabLayout1';
import { useLocation } from 'react-router';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch } from 'app/store';
import NavbarToggleButton from 'app/theme-layouts/shared-components/NavbarToggleButton';
import clsx from 'clsx';
import { useTheme } from '@mui/styles';
import NavbarStyle1 from './navbar/style-1/NavbarStyle1';
import NavbarStyle2 from './navbar/style-2/NavbarStyle2';
import NavbarStyle3 from './navbar/style-3/NavbarStyle3';

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperLayout1() {
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useSelector(selectFuseNavbar);
	const location = useLocation();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { pathname } = location;
	const dispatch = useAppDispatch();
	const theme = useTheme();

	useEffect(() => {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
	}, [pathname, isMobile]);

	const navbarTheme = useSelector(selectNavbarTheme);

	const isNavBarOpen = isMobile ? navbar.mobileOpen : navbar.open;

	return (
		<>
			<ThemeProvider theme={navbarTheme}>
				<>
					<div
						className={`flex shrink-0 flex-row items-center bg-white sidebar-button-toggle`}
						style={{
							position: 'fixed',
							// left: !isNavBarOpen ? '0px' : '275px',
							top: '60px',
							zIndex: 99990,
							borderRadius: '0% 30% 30% 0%',
							padding: '1px',
							backgroundColor: theme.palette.background.paper,
							...(!isNavBarOpen && {
								transition: theme.transitions.create('margin', {
									easing: theme.transitions.easing.easeOut,
									duration: theme.transitions.duration.leavingScreen
								})
							}),
							...(isNavBarOpen && {
								transition: theme.transitions.create('margin', {
									easing: theme.transitions.easing.easeOut,
									duration: theme.transitions.duration.enteringScreen
								}),
								marginLeft: `280px`
							})
						}}
					>
						<NavbarToggleButton className="h-40 w-40 p-0" />
					</div>
					{config.navbar.style === 'style-1' && <NavbarStyle1 />}
					{config.navbar.style === 'style-2' && <NavbarStyle2 />}
					{config.navbar.style === 'style-3' && <NavbarStyle3 />}
					{config.navbar.style === 'style-3-dense' && <NavbarStyle3 dense />}
				</>
			</ThemeProvider>
			{config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFabLayout1 />}
		</>
	);
}

export default memo(NavbarWrapperLayout1);
