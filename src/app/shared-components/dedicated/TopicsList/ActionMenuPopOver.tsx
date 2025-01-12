import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import jwtService from 'src/app/auth/services/jwtService';
import { useParams } from 'react-router';

const ActionMenuItem = styled(MenuItem)<any>(({ theme }) => ({
	// boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
}));

function TopicsList({ topic, actionsMenu, setActionsMenu, updateTopic, handleDelete, handleEdit}) {
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

	const handleMenuItemClick = (e, type) => {
		e.preventDefault();
		setActionsMenu(null);

		if (type === 'delete') {
			handleDelete(topic);
		} else if (type === 'edit') {
			handleEdit(topic);
		} else {
			const newHidden = !topic.hidden;
			upadateTopicVisibility(topic.id, newHidden);
		}
	};

	function upadateTopicVisibility(topicid, hidden) {
		const payload = {
			hidden,
			name: topic.name,
			order: topic.order
		};
		jwtService
			.updateTopic(topicid, payload, courseid)
			.then((res: any) => {
				const updatedTopic = { ...topic, ...payload };
				updateTopic(updatedTopic);
			})
			.catch((e) => {
				console.error('Error updating topic: ', e);
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
					onClick={(e) => handleMenuItemClick(e, '')}
					role="button"
				>
					{topic.hidden ? (
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
				<ActionMenuItem
					component={Box}
					onClick={(e) => handleMenuItemClick(e, 'edit')}
					role="button"
				>
					<>
						<ListItemIcon className="min-w-40">
							<i className="material-icons">edit</i>
						</ListItemIcon>
						<ListItemText primary="Editar" />
					</>
				</ActionMenuItem>
				<ActionMenuItem
					component={Box}
					onClick={(e) => handleMenuItemClick(e, 'delete')}
					role="button"
				>
					<>
						<ListItemIcon className="min-w-40">
							<i className="material-icons">delete</i>
						</ListItemIcon>
						<ListItemText primary="Eliminar" />
					</>
				</ActionMenuItem>
			</>
		</ActionMenuPopOver>
	);
}

export default TopicsList;
