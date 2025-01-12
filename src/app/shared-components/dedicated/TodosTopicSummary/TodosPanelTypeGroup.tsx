import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import ActionMenuPopOver from './ActionMenuPopOver';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { formatDateDayOfMonth, getDayOfWeekAsName, formatDateMonth, getFullYear, daysUntilDueDate } from 'src/app/utils';
import StatusTag from 'app/shared-components/general/StatusTag/StatusTag';
import { Theme } from '@mui/system';

const PanelLabel = styled(Box)<any>(({ theme }) => ({
	backgroundColor: '#D0E4F5',
	padding: '0.5rem 1.5rem',
	borderRadius: '4rem',
	display: 'inline-block',
	marginBottom: '1rem',
	marginTop: '3rem'
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

const LockIndicator = styled(Box)<any>(({userRole}) => ({
	position: 'absolute',
	right: userRole === 'student' ? '1rem' : '5rem',
	top: '1rem',
	backgroundColor: 'white',
	display: 'flex',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	},
	transform: 'scale(0.9)'
}));

const TodoContainer = styled(Box)<any>(({ type }) => ({
	  borderLeft: `2px solid`,
	  borderColor: type === 'activity' ? '#D0E4F5' : '#F0D1F2',
	  paddingLeft: '1rem',
	  '& .single-todo:not(:last-child)':{
		marginBottom: '1.5rem'
	  }
}));

const SingleTodoContainer = styled(Link)<any>(({ isVisible, userRole, theme }) => ({
	padding: '1.5rem',
	position: 'relative',
	display: 'block',
	cursor: !isVisible && userRole === 'student' ? 'auto' : 'pointer',
	borderRadius: '1rem',
	boxShadow: '-1px 2px 8px -1px rgba(0,0,0,0.16)',
	backgroundColor: 'white',
	pointerEvents: !isVisible && userRole === 'student' ? 'none' : 'auto',
	'&:hover': {
		backgroundColor: !isVisible ? 'white' : 'rgba(0,0,0,0.1)'
	},
	[theme.breakpoints.up('sm')]: {
		display: 'flex'
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
	opacity: isHidden ? 0.5 : 1,
	display: 'block',
	alignItems: 'center',
	width: '100%',
	'& .topic-name': {
		fontWeight: 700,
		marginBottom: '0.5rem'
	},
	[theme.breakpoints.up('sm')]: {
		display: 'flex'
	}
}));

const TopicInfoContainer = styled(Box)<any>(({ theme }) => ({
	paddingRight: '1rem',
	marginRight: '1rem',
	marginBottom: '1rem !important',
	minHeight: '50px',
	borderBottom: '1px solid rgba(0,0,0,0.5)',
	width: '100%',
	'& .info-name': {
		fontSize: '1.3rem',
		color: '#656565',
		margin: '0rem 0 0.5rem 0'
	},
	'& svg': {
		marginRight: '0.5rem',
		transform: 'scale(0.9)'
	},
	'& .info-description': {
		color: '#414141',
		fontSize: '1.3rem'
	},
	[theme.breakpoints.up('sm')]: {
		borderRight: '1px solid rgba(0,0,0,0.5)',
		borderBottom: 'none',
		width: '140px',
		marginBottom: '0rem !important',
	}
}));

const IconLabelContainer = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	paddingBottom: '1.5rem',
	[theme.breakpoints.up('sm')]: {
		paddingBottom: '0',
	}
}));

function TodosPanelTypeGroup({ todos, handleAction, isPremium, type }) {
	const user = useSelector(selectUser);
	todos.map((todo) => {
		if(todo.start_date){
			const currentDate = new Date()
			const startDate = new Date(todo.start_date * 1000)
			todo.is_visible = currentDate >= startDate
		}else{
			todo.is_visible = true
		}

		if(!isPremium){
			todo.is_visible = true
		}
		return todo
	})

	return (
		<TodoContainer type={type} className="main-todo-container">
		{todos.length > 0 ? todos.map((todo) => {
					return (
						<Box
						sx={{
							position: 'relative',
							marginBottom: '1rem'
						}}>
						<SingleTodoContainer
							to={`todos/${todo.id}/${todo?.type === 'quiz' ? 'exam' : 'activity'}`}
							style={{
								textDecoration: 'none',
								color: '#000',
								opacity: !todo.is_visible ? 0.5 : 1
							}}
							isHidden={todo.hidden}
							isVisible={todo.is_visible}
							userRole={user.role}
							className='single-todo'
						>
							{/* <TopicImage
								component="img"
								alt={todo.image_alt}
								src={
								todo.image ? todo.image : 'assets/images/mock/new-topic.png'
								}
							/> */}

							{!todo.is_visible && (
								<Tooltip title="Esta actividad no está activa. La fecha de inicio aún no llega." sx={{cursor: 'default', pointerEvents: 'auto'}} onClick={(e) => {e.preventDefault()}} enterTouchDelay={0}>
									<LockIndicator userRole={user.role}>
										<i className="material-icons">lock</i>
									</LockIndicator>
							  	</Tooltip>
							)}

							<TopicDescription isHidden={todo.hidden}>

									{isPremium &&
										<TopicInfoContainer>
											{
												user.role === 'student' && todo.is_visible && todo.due_date && <StatusTag
													bgColor={daysUntilDueDate(todo.due_date * 1000, todo.status, todo.score).backgroundColor}
													color={daysUntilDueDate(todo.due_date * 1000, todo.status, todo.score).color}
												>
													{daysUntilDueDate(todo.due_date * 1000, todo.status, todo.score).label}
												</StatusTag>
											}
											{
												user.role === 'student' && todo.is_visible && !todo.due_date && (todo.status != 'pending' || todo.score) && <StatusTag
													bgColor={daysUntilDueDate(null, todo.status, todo.score).backgroundColor}
													color={daysUntilDueDate(null, todo.status, todo.score).color}
												>
													{daysUntilDueDate(null, todo.status, todo.score).label}
												</StatusTag>
											}
											<Typography className="info-name">{todo.due_date ? 'Fecha límite' : 'Sin fecha límite'}</Typography>
											{todo.due_date &&
												<IconLabelContainer>
													<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
													<Typography className="info-description">
													<Box>
														<span className="capitalize">{getDayOfWeekAsName(todo.due_date * 1000)} {formatDateDayOfMonth(todo.due_date * 1000)} - {formatDateMonth(todo.due_date * 1000)}, {getFullYear(todo.due_date * 1000)}</span>
													</Box>
													{/* <Box>
														<span className="capitalize">{formatDateMonth(todo.due_date * 1000)}, {getFullYear(todo.due_date * 1000)}</span>
													</Box> */}
													
													</Typography>
												</IconLabelContainer>
											}
										</TopicInfoContainer>
									}
									<Box>
										<Typography className="topic-name" >{todo.name}</Typography>
										<Typography>{todo.description}</Typography>
									</Box>
							</TopicDescription>
						</SingleTodoContainer>
						{user.role !== 'student' && isPremium && (
								<PlusAction
									onClick={(e) => {
										handleAction(e, todo)
									}}
								>
									<i className="material-icons">add</i>
								</PlusAction>
							)}
						</Box>
					);
				}) : 
					<Box sx={{
						padding: '1rem',
						backgroundColor: '#F1F0F0',
						borderRadius: '10px'
					}}>
						{
							type === 'quiz' ? 'Aún no hay exámenes en esta lección.' : 'Aún no hay actividades en esta lección.'
						}
					</Box>
				}
		</TodoContainer>
	);
}

export default TodosPanelTypeGroup;
