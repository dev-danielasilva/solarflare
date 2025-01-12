import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import jwtService from 'src/app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';

const ActionMenuItem = styled(MenuItem)<any>(({ theme }) => ({
	// boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}));

function TopicsList({ todo, actionsMenu, setActionsMenu, updateTodo }) {
	const dispatch = useAppDispatch();
	const { courseid } = useParams();
	const ActionMenuPopOver = styled(Popover)<any>(({ theme }) => ({
		'& .MuiPopover-paper': {
			boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
		},
		marginTop: '1rem'
	}));

	const actionsMenuClose = (e) => {
		e.preventDefault();
		setActionsMenu(null);
	};

	const handleMenuItemClick = (e) => {
		e.preventDefault();
		setActionsMenu(null);
		const newHidden = !todo.hidden;
		upadateTopicVisibility(todo.id, newHidden);
	};

	function upadateTopicVisibility(todoid, hidden) {
		const payload = {
			hidden,
			name: todo.name
		};
		jwtService
			.updateTodo(courseid, todoid, payload)
			.then((res: any) => {
				const updatedTodo = { ...todo, ...payload };
				updateTodo(updatedTodo);
				dispatch(
					showMessage({
						message: 'La visibilidad del examen se actualizó correctamente.', // text or html
						autoHideDuration: 6000, // ms
						anchorOrigin: {
							vertical: 'top', // top bottom
							horizontal: 'center' // left center right
						},
						variant: 'success' // success error info warning null
					})
				);
			})
			.catch((e) => {
				console.error('Error updating topic: ', e);
				dispatch(
					showMessage({
						message: 'Ocurrió un error. Por favor intenta de nuevo.', // text or html
						autoHideDuration: 6000, // ms
						anchorOrigin: {
							vertical: 'top', // top bottom
							horizontal: 'center' // left center right
						},
						variant: 'error' // success error info warning null
					})
				);
			});
	}

	return (
		<ActionMenuPopOver
			open={Boolean(actionsMenu)}
			anchorEl={actionsMenu}
			onClose={actionsMenuClose}
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
			<>
				<ActionMenuItem
					component={Box}
					onClick={(e) => handleMenuItemClick(e)}
					role="button"
				>
					{todo.hidden ? (
						<>
							<ListItemIcon className="min-w-40">
								<i className="material-icons">visibility</i>
							</ListItemIcon>
							<ListItemText primary="Mostrar" />
						</>
					) : (
						<>
							<ListItemIcon className="min-w-40">
								<i className="material-icons">visibility_off</i>
							</ListItemIcon>
							<ListItemText primary="Ocultar" />
						</>
					)}
				</ActionMenuItem>
			</>
		</ActionMenuPopOver>
	);
}

export default TopicsList;
