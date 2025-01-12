import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/user/userSlice';
import { getName } from 'src/app/utils';
import { ProfileModal } from './ProfileModal';

/**
 * The user menu.
 */
function UserMenu() {
	const user = useSelector(selectUser);

	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
	const [openProfile, setOpenProfile] = useState<boolean>(false);

	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={userMenuClick}
				color="inherit"
			>
				<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{getName(user, 'fl')}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="text.secondary"
					>
						{user?.role === 'teacher' && 'Docente'}
						{user?.role === 'student' && 'Estudiante'}
						{/* {!_.isObject(user.role) && user.role === 'teacher' ? 'Docente' : (user.role as RoleType).name} */}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.avatar?.image ? (
					<Avatar
						className="md:mx-4"
						alt="user photo"
						src={user.avatar?.image}
					/>
				) : (
					<Avatar
						sx={{ bgcolor: '#43B2AE' }}
						className="md:mx-4"
					>
						{getName(user)[0]}
					</Avatar>
				)}
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{!user.role || (user.role as string[]).length === 0 ? (
					<>
						<MenuItem
							component={Link}
							to="/log-in"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign In" />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign up" />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							component={NavLink}
							to="/"
							onClick={() => {
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:home</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Inicio" />
						</MenuItem>
						<MenuItem
							// component={NavLink}
							// to="/profile"
							onClick={() => {
								setOpenProfile(true);
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Perfil" />
						</MenuItem>
						<MenuItem
							component={NavLink}
							to="/grades"
							onClick={() => {
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:chart-bar</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Calificaciones" />
						</MenuItem>
						<MenuItem
							component={NavLink}
							to="/sign-out"
							onClick={() => {
								userMenuClose();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Salir" />
						</MenuItem>
					</>
				)}
			</Popover>
			<ProfileModal
				open={openProfile}
				onClose={() => setOpenProfile(false)}
			/>
		</>
	);
}

export default UserMenu;
