import { Theme, ThemeProvider, styled } from '@mui/material/styles'
import AppBar, { AppBarProps } from '@mui/material/AppBar'
import Hidden from '@mui/material/Hidden'
import Toolbar from '@mui/material/Toolbar'
import clsx from 'clsx'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import {
  selectFuseCurrentLayoutConfig,
  selectToolbarTheme,
} from 'app/store/fuse/settingsSlice'
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice'
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config'
import NavbarToggleButton from '../../shared-components/NavbarToggleButton'
import UserMenu from '../../shared-components/UserMenu'

type ToolbarLayout1Props = {
  className?: string
}

type ExtendedAppBarProps = AppBarProps & {
  toolbarTheme?: Theme
}

const StyledAppBar = styled(AppBar)<ExtendedAppBarProps>(
  ({ theme, toolbarTheme }) => ({
    backgroundColor:
      theme.palette.mode === 'light'
        ? toolbarTheme.palette.background.paper
        : toolbarTheme.palette.background.default,
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
    [theme.breakpoints.up('md')]: {
      width: '80%',
      maxWidth: '1200px',
      margin: 'auto',
    },
  })
)

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
  const { className } = props
  const config = useSelector(
    selectFuseCurrentLayoutConfig
  ) as Layout1ConfigDefaultsType
  const navbar = useSelector(selectFuseNavbar)
  const toolbarTheme = useSelector(selectToolbarTheme)

  return (
    <ThemeProvider theme={toolbarTheme}>
      <StyledAppBar
        id="fuse-toolbar"
        className={clsx('relative z-20 flex shadow-md', className)}
        color="default"
        toolbarTheme={toolbarTheme}
        // sx={{
        // 	backgroundColor: (theme) =>
        // 		theme.palette.mode === 'light'
        // 			? toolbarTheme.palette.background.paper
        // 			: toolbarTheme.palette.background.default,
        // }}
        position="static"
      >
        <Toolbar className="min-h-48 p-0 md:min-h-64">
          <div className="flex flex-1 px-16">
            {/* <img
							width="156"
							src="assets/images/logo/learning-hub-logo.svg"
							alt="logo"
						/> */}
            {/* <img width="100" src="assets/images/logo/logo-ada.svg" alt="logo" /> */}
            <img width="100" src="assets/images/logo/logo-client.svg" alt="logo" />
            {/* <Hidden lgDown>
							<NavigationShortcuts />
						</Hidden> */}
          </div>

          <div className="flex h-full items-center overflow-x-auto px-8">
            {/* <LanguageSwitcher /> */}
            {/* <AdjustFontSize /> */}
            {/* <FullScreenToggle /> */}
            {/* <NavigationSearch /> */}
            {/* <QuickPanelToggleButton /> */}
            {/* <NotificationPanelToggleButton /> */}
            <UserMenu />
          </div>

          {config.navbar.display && config.navbar.position === 'right' && (
            <>
              <Hidden lgDown>
                {!navbar.open && (
                  <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />
                )}
              </Hidden>

              <Hidden lgUp>
                <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  )
}

export default memo(ToolbarLayout1)
