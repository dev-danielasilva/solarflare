import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import ActionMenuPopOver from './ActionMenuPopOver';
import TodosPanelTypeGroup from './TodosPanelTypeGroup';

const PanelLabel = styled(Box)<any>(({ theme }) => ({
	backgroundColor: '#D0E4F5',
	padding: '0.5rem 1.5rem',
	borderRadius: '4rem',
	display: 'inline-block',
	marginBottom: '1rem',
	marginTop: '3rem'
}));

const TodosContainer = styled(Box)<any>(({ theme }) => ({
	//   borderLeft: `2px solid #D0E4F5`,
	//   paddingLeft: '1rem',
}));

const PlusAction = styled(Box)<any>(({ theme }) => ({
	position: 'absolute',
	right: '1rem',
	top: '1rem',
	backgroundColor: 'white',
	display: 'flex',
	borderRadius: '50px',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	},
	cursor: 'pointer',
	transform: 'scale(0.9)'
}));

const SingleTodoContainer = styled(Link)<any>(({ theme }) => ({
	// padding: '1rem',
	padding: '1.5rem',
	position: 'relative',
	display: 'flex',
	cursor: 'pointer',
	borderRadius: '1rem',
	boxShadow: '-1px 2px 8px -1px rgba(0,0,0,0.16)',
	'&:hover': {
		backgroundColor: 'rgba(0,0,0,0.1)'
	},
	':not(:last-child)': {
		marginBottom: '2rem'
	}
}));

const TopicImage = styled(Box)<any>(({ theme }) => ({
	maxHeight: 120,
	width: 200,
	maxWidth: 200,
	objectFit: 'cover',
	borderRadius: '16px',
	boxShadow: '-1px 2px 8px -1px rgba(0,0,0,0.16)'
}));

const TopicDescription = styled(Box)<any>(({ theme, isHidden }) => ({
	// marginLeft: '1rem',
	opacity: isHidden ? 0.5 : 1,
	'& .topic-name': {
		fontWeight: 700,
		marginBottom: '1rem'
	}
}));

const TopicInfoContainer = styled(Box)<any>(({ theme }) => ({
	'& .info-name': {
		fontSize: '1.3rem',
		color: '#656565',
		margin: '1rem 0 0.5rem 0'
	},
	'& svg': {
		marginRight: '0.7rem'
	},
	'& .info-description': {
		color: '#414141'
	}
}));

const IconLabelContainer = styled(Box)<any>(({ theme }) => ({
	display: 'flex'
}));

const SectionTitle = styled(Typography)<any>(({ type }) => ({
	backgroundColor: type === 'activity' ? '#D0E4F5' : '#F0D1F2',
	padding: '0.5rem 1.5rem',
	borderRadius: '100px',
	display: 'inline-block',
	marginBottom: '2rem'
}));

function TodosPanel({ type, todos, sendUpdateTodo, isPremium }) {
	const [actionsMenu, setActionsMenu] = useState<HTMLElement | null>(null);
	const [selectedTodo, setSelectedTodo] = useState(null);
	const user = useSelector(selectUser);

	const quizTodos = todos.filter((todo) => todo.type === 'quiz')
	const activityTodos = todos.filter((todo) => todo.type === 'activity')

	const formatDate = (timestamp: number): string => {
		const dueDate = new Date(timestamp);
		const dueDateFormatted = moment(dueDate).format('DD-MM-YYYY');
		return dueDateFormatted;
	};

	const handleAction = (e, todo) => {
		e.preventDefault();
		setSelectedTodo(todo);
		setActionsMenu(e.currentTarget);
	};

	const actionsMenuClose = () => {
		setActionsMenu(null);
	};

	const updateTodo = (updatedTodo) => {
		sendUpdateTodo(updatedTodo);
	};

	return (
		<Box>
			<TodosContainer>
				<Box sx={{marginBottom: '3rem'}}>
					<SectionTitle type={'activity'} >Actividades</SectionTitle>
					<TodosPanelTypeGroup 
						todos={activityTodos}
						handleAction={handleAction}
						isPremium={isPremium}
						type={'activity'}
					/>
				</Box>
				<Box>
					<SectionTitle type={'quiz'} >Exámenes</SectionTitle>
					<TodosPanelTypeGroup 
						todos={quizTodos}
						handleAction={handleAction}
						isPremium={isPremium}
						type={'quiz'}
					/>
				</Box>
			</TodosContainer>
			{selectedTodo && (
				<ActionMenuPopOver
					todo={selectedTodo}
					actionsMenu={actionsMenu}
					setActionsMenu={actionsMenuClose}
					updateTodo={updateTodo}
				/>
			)}
		</Box>
	);
}

export default TodosPanel;
