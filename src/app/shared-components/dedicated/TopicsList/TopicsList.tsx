import { Box, Typography } from '@mui/material';
import { BoxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import jwtService from 'src/app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import DeleteItemDialog from '../LHDialogs/DeleteItemDialog';
import ActionMenuPopOver from './ActionMenuPopOver';
import EditTopicDialog from '../LHDialogs/EditTopicDialog';

interface StyledTopImageProps extends BoxProps {
	alt?: string;
	src?: string;
}

const StyledTopImage = styled(Box)<StyledTopImageProps>(({ theme }) => ({
	maxHeight: 120,
	width: 200,
	maxWidth: 200,
	objectFit: 'cover',
	borderRadius: '16px',
	boxShadow: '0 2px 3px 3px rgba(0,0,0,0.10)'
}));

const SingleTopicWrapper = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	padding: '1rem',
	position: 'relative',
	borderRadius: '1rem',
	'&:hover': {
		backgroundColor: 'rgba(0,0,0,0.1)'
	}
}));

const TopicsWrapper = styled(Box)<any>(({ theme }) => ({
	marginTop: '2rem',
	position: 'relative',
	'& .single-topic-wrapper:not(:last-child) div': {
		marginBottom: '1rem'
	}
}));

const TopicDescription = styled(Box)<any>(({ theme }) => ({
	marginLeft: '1.5rem',
	color: '#000',
	'& .topic-name': {
		fontSize: '1.6rem',
		fontWeight: '700',
		color: '#000'
	}
}));

const LinkTopicWrapper = styled(Link)<any>(({ theme }) => ({
	textDecoration: 'none',
	'&.topic-hidden': {
		opacity: 0.5
	}
}));

const PlusAction = styled(Box)<any>(({ theme }) => ({
	position: 'absolute',
	right: '0.5rem',
	top: '0.5rem',
	backgroundColor: 'white',
	display: 'flex',
	borderRadius: '50px',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	}
}));

function TopicsList({ topics, subjectid, courseid, sendUpdateTopic, isPremium }) {
	const [open, setOpen] = useState(false);
	const [actionsMenu, setActionsMenu] = useState<HTMLElement | null>(null);
	const [selectedTopic, setSelectedTopic] = useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [editTopicModalOpen, setEditTopicModalOpen] = useState(false);
	const [topicToDelete, setTopicToDelete] = useState(null);
	const [topicToEdit, setTopicToEdit] = useState(null);
	const dispatch = useAppDispatch();

	const handleAction = (e, topic) => {
		e.preventDefault();
		setSelectedTopic(topic);
		setActionsMenu(e.currentTarget);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const actionsMenuClose = () => {
		setActionsMenu(null);
	};

	const updateTopic = (updatedTopic) => {
		sendUpdateTopic(updatedTopic);
		setEditTopicModalOpen(false);
	};

	const handleTopicDelete = (topic) => {
		setTopicToDelete(topic);
		setDeleteModalOpen(true);
	};

	const handleTopicEdit = (topic) => {
		setTopicToEdit(topic);
		setEditTopicModalOpen(true);
	}	

	const handleEditTopicClose = () => {
		setEditTopicModalOpen(false);
	}	

	const deleteTopic = () => {
		const payload = {
			active: false,
			name: topicToDelete.name,
			order: topicToDelete.order
		};
		jwtService
			.updateTopic(topicToDelete.id, payload, courseid)
			.then((res: any) => {
				const updatedTopic = { ...topicToDelete, ...payload };
				updateTopic(updatedTopic);
				finishUpdate('El tema fue eliminado con éxito.', 'success');
			})
			.catch((e) => {
				console.error('Error updating topic: ', e);
				finishUpdate('Hubo un problema eliminando el tema. Por favor, intenta de nuevo.', 'error');
			});
	};

	const finishUpdate = (message, variant) => {
		setTopicToDelete(null);
		setDeleteModalOpen(false);

		dispatch(
			showMessage({
				message,
				autoHideDuration: 10000, // ms
				anchorOrigin: {
					vertical: 'top', // top bottom
					horizontal: 'center' // left center right
				},
				variant // success error info warning null
			})
		);
	};

	return topics ? (
		<TopicsWrapper className="topics-wrapper">
			{topics.map(
				(topic) =>
					topic.active && (
						<LinkTopicWrapper
							to={`topics/${topic?.id}`}
							style={{ textDecoration: 'none' }}
							className={`single-topic-wrapper ${topic.hidden ? 'topic-hidden' : ''}`}
						>
							<SingleTopicWrapper key={`topic-wrapper-${topic.id}`}>
								{isPremium && (
									<PlusAction
										disabled={!isPremium}
										onClick={(e) => {
											handleAction(e, topic);
										}}
									>
										<i className="material-icons">add</i>
									</PlusAction>
								)}
								<StyledTopImage
									component="img"
									alt="Topic image"
									src={topic?.image ? topic?.image : 'assets/images/mock/new-topic.png'}
								/>
								<TopicDescription>
									<Typography className="topic-name">{topic.name}</Typography>
									<Typography>{topic.description}</Typography>
								</TopicDescription>

								{selectedTopic && (
									<ActionMenuPopOver
										topic={selectedTopic}
										actionsMenu={actionsMenu}
										setActionsMenu={actionsMenuClose}
										updateTopic={updateTopic}
										handleDelete={handleTopicDelete}
										handleEdit={handleTopicEdit}
									/>
								)}
							</SingleTopicWrapper>
						</LinkTopicWrapper>
					)
			)}
			{deleteModalOpen && (
				<DeleteItemDialog
					open={deleteModalOpen}
					handleClose={() => setDeleteModalOpen(false)}
					message="¿Estás seguro de que quieres eliminar este tema?"
					handleAccept={deleteTopic}
				/>
			)}
			{topicToEdit && editTopicModalOpen && (
				<EditTopicDialog
					open={editTopicModalOpen}
					handleClose={handleEditTopicClose}
					subjectid={subjectid}
					courseid={courseid}
					topic={topicToEdit}
					sendUpdateTopic={updateTopic}
				/>
			)}
		</TopicsWrapper>
	) : (
		''
	);
}

export default TopicsList;
