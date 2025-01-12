import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Card, CardContent, Container, LinearProgress, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import BaseUserType from 'app/store/user/BaseUserType';
import definitionService from 'src/app/services/definitionService';
import FileDownload from '../FileDownload/FileDownload';
import { useState } from 'react';
import EditTodoDialog from 'app/shared-components/dedicated/LHDialogs/EditTodoDialog';
import { formatDate } from 'src/app/utils';

const CardHeaderImage = styled(Box)<any>(({ theme }) => ({
	borderRadius: '100px',
	maxWidth: '85px',
	marginRight: '1.5rem'
}));

const CardHeader = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
	fontSize: '2.5rem',
	fontWeight: 600,
	margin: role === 'student' ? 'auto 1.5rem auto 0' : 0,
	[theme.breakpoints.down('sm')]: {
		margin: role === 'student' ? '1rem 0' : 0
	}
}));

const TodoData = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	marginTop: '2rem',
	borderTop: '1px solid #F3F3F3',
	paddingTop: '2rem',
	flexDirection: 'row',
	// justifyContent: 'space-between',
	alignItems: 'center'
}));

const TodoDataItem = styled(Box)<any>(({ theme }) => ({
	marginRight: '3rem',
	'& .label': {
		marginBottom: '1rem'
	},
	[theme.breakpoints.down('sm')]: {
		marginBottom: '2rem',
		marginRight: '1 rem'
	}
}));

const IconLabelContainer = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	'& .info-description': {
		marginLeft: '1rem'
	}
}));

const PlusAction = styled(Box)<any>(({ theme }) => ({
	position: 'absolute',
	right: '2rem',
	top: '2rem',
	backgroundColor: 'white',
	display: 'flex',
	borderRadius: '50px',
	padding: '0.5rem',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
	'& .material-icons': {
		color: '#000',
		padding: '0.5rem'
	},
	cursor: 'pointer',
	'& svg': {
		transform: 'scale(0.8)'
	}
}));

interface TodoInfoCardProps {
	todo?: any;
	updateTodo?: any;
}

function TodoInfoCard({ todo, updateTodo }: TodoInfoCardProps) {
    const user: BaseUserType = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
    const headerImage = definitionService.getSkinFromDefinition('card_characters.step_one', null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	
	const openAddTopicModal = () => {
		setEditDialogOpen(true);
	};

	const handleEditDialogClose = () => {
		setEditDialogOpen(false);
	};

	const sendUpdatedTodo = (todo) => {
		updateTodo(todo);
		setEditDialogOpen(false);
	};

	const onRemove = () => {
		updateTodo({
			...todo,
			submission: null
		});
	}

	return (
		<>
			<Card
				className="mt-0 p-24"
				sx={{ position: 'relative', marginBottom: '3rem' }}
			>
				<CardContent sx={{ p: '0 !important' }}>

					{user?.role !== 'student' && isPremium && (
						<PlusAction
							onClick={() => {
								openAddTopicModal();
							}}
						>
							<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
						</PlusAction>
					)}

                    <CardHeader>
						{user?.role === 'student' && headerImage?.image && (
							<CardHeaderImage
								component="img"
								src={headerImage?.image}
								alt={headerImage?.alt ? headerImage.alt : 'Detalles del examen'}
							/>
						)}
						<CardTitle role={user?.role}>{
							user?.role == 'student' ? 'Lee y entiende las instrucciones' :  'Instrucciones'
						}</CardTitle>
					</CardHeader>

                    {/* Instructions / description of the todo */}
                    {todo.description &&
                    <Typography
                        sx={{
                            fontSize: '1.6rem',
                            marginBottom: '2rem'
                        }}
                    >
                        {todo.description}
                    </Typography>
                    }
                    
                    {/* Shown only if the todo has a file attached */}
                    {todo?.file?.url && (
						<FileDownload
							attachment={typeof todo.file === 'object' ? todo.file : {
								name: todo.file.split('/')[todo.file.split('/').length - 1],
								url: todo.file
							}}
							download
							remove={todo.score !== null || todo.score !== 'NA'}
							onRemove={onRemove}
						/>
					)}

                    <TodoData>
						{isPremium && todo.start_date && 
							<TodoDataItem>
								<Typography className="label">Fecha de inicio</Typography>
								<IconLabelContainer>
									<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
									<Typography className="info-description">
										{formatDate(todo.start_date * 1000)}
									</Typography>
								</IconLabelContainer>
							</TodoDataItem>
						}
						{isPremium && todo.start_date && 
							<TodoDataItem>
								<Typography className="label">Fecha límite</Typography>
								<IconLabelContainer>
									<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
									<Typography className="info-description">
										{formatDate(todo.due_date * 1000)}
									</Typography>
								</IconLabelContainer>
							</TodoDataItem>
						}
						<TodoDataItem>
							<Typography className="label">Peso</Typography>
							<IconLabelContainer>
								<FuseSvgIcon>heroicons-outline:scale</FuseSvgIcon>
								<Typography className="info-description">
									{todo.weight ? todo.weight : 0}
								</Typography>
							</IconLabelContainer>
						</TodoDataItem>
					</TodoData>

				</CardContent>
			</Card>
			{editDialogOpen && (
				<EditTodoDialog
					open={editDialogOpen}
					handleClose={handleEditDialogClose}
					todo={todo}
					sendUpdatedTodo={sendUpdatedTodo}
				/>
			)}
		</>
	);
}

export default TodoInfoCard;
