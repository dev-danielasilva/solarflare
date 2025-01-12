import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { getName } from 'src/app/utils';

const Root = styled('div')(({ theme }) => ({
	'& .username, & .email': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},

	'& .avatar': {
		// background: theme.palette.background.default,
		background: '#43B2AE',
		fontSize: '30px',
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

/**
 * The user navbar header.
 */
function UserNavbarHeader() {
	const user = useSelector(selectUser);

	return (
		<Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
			<div className="mb-24 flex items-center justify-center">
				<Avatar
					sx={{
						color: '#FFF',
						width: '10rem',
						height: '10rem',
						marginTop: '3rem'
					}}
					className="avatar text-32 font-bold"
					src={user?.avatar?.image}
					alt={getName(user)}
				>
					{getName(user).charAt(0)}
				</Avatar>
			</div>
			<Typography className="username whitespace-nowrap text-14 font-bold">{getName(user, 'fl')}</Typography>
			<Typography className="username whitespace-nowrap text-14 font-regular text-gray-500 capitalize">
				{user?.role === 'teacher' && 'Docente'}
				{user?.role === 'student' && 'Estudiante'}
			</Typography>
		</Root>
	);
}

export default UserNavbarHeader;
