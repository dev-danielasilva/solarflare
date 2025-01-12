import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import _ from '@lodash';
import definitionService from 'src/app/services/definitionService';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import FileDownload from 'app/shared-components/general/FileDownload/FileDownload';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import jwtService from 'src/app/auth/services/jwtService';
import BaseUserType from 'app/store/user/BaseUserType';
import EditExamDialog from './EditExamDialog';
import { formatDate } from 'src/app/utils';

const ActionButton = styled(Button)<any>(({ theme }) => ({
	marginRight: '2rem',
	color: 'white',
	backgroundColor: '#6F99F5',
	'&:hover': {
		backgroundColor: '#5174C2'
	}
}));

const ActionButtons = styled(Box)<any>(({ theme }) => ({
	//   marginTop: "3rem",
	textAlign: 'right'
}));

const CardHeader = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const CardHeaderImage = styled(Box)<any>(({ theme }) => ({
	borderRadius: '100px',
	maxWidth: '85px',
	marginRight: '1.5rem'
}));

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
	fontSize: '2.5rem',
	fontWeight: 600,
	margin: role === 'student' ? 'auto 1.5rem auto 0' : 0,
	[theme.breakpoints.down('sm')]: {
		margin: role === 'student' ? '1rem 0' : 0
	}
}));

const ExamData = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	flexWrap: 'wrap',
	marginTop: '2rem',
	borderTop: '1px solid #F3F3F3',
	paddingTop: '2rem',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const ExamDataItem = styled(Box)<any>(({ theme }) => ({
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

const DetailsHolder = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

function ExamDetailsCard({
	todo,
	// startExam,
	previewExam,
	updateTodo,
	updateExam
}) {
	const user: BaseUserType = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const theme = useTheme();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const headerImage = definitionService.getSkinFromDefinition('card_characters.quiz_details', null);
	
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

	const triggerExamAction = () => {
		jwtService.clearExamCache();

		if (user.role === 'student') {
			if (_.isNumber(todo.score) && todo.quiz_status) {
				updateExam({
					state: 'review'
				});
			} else {
				updateExam({
					state: 'active'
				});
			}
		} else {
			window.localStorage.removeItem(`examprogress-${todo.id}`);
			updateExam({
				state: 'review'
			});
		}
	};

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
						<CardTitle role={user?.role}>Detalles del examen</CardTitle>
					</CardHeader>
					<Typography
						sx={{
							fontSize: '1.6rem',
							marginBottom: '2rem'
						}}
					>
						{todo.description}
					</Typography>

					{/* {todo.files?.length > 0 &&
            todo.files.map((file) => {
              return <FileDownload attachment={file} download={true} />
            })} */}

					{todo?.file?.url && (
						<FileDownload
							attachment={todo.file}
							download
						/>
					)}

					<ExamData>

						<DetailsHolder sx={{display: 'flex'}}>

							{isPremium && todo.start_date &&
									<ExamDataItem>
									<Typography className="label">Fecha de inicio</Typography>
									<IconLabelContainer>
										<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
										<Typography className="info-description">
										{formatDate(todo.start_date * 1000)}
										</Typography>
									</IconLabelContainer>
								</ExamDataItem>
							}
							{isPremium && todo.due_date &&
								<ExamDataItem>
								<Typography className="label">Fecha límite</Typography>
								<IconLabelContainer>
									<FuseSvgIcon>heroicons-outline:calendar</FuseSvgIcon>
									<Typography className="info-description">
									{formatDate(todo.due_date * 1000)}
									</Typography>
								</IconLabelContainer>
								</ExamDataItem>
							}
							
							<ExamDataItem>
								<Typography className="label">Peso</Typography>
								<IconLabelContainer>
									<FuseSvgIcon>heroicons-outline:scale</FuseSvgIcon>
									<Typography className="info-description">
										{todo.weight ? todo.weight : 0}
									</Typography>
								</IconLabelContainer>
							</ExamDataItem>
						</DetailsHolder>

							{/* <ExamDataItem>
              <Typography className="label">Límite de tiempo</Typography>
              <IconLabelContainer>
                <FuseSvgIcon>heroicons-outline:clock</FuseSvgIcon>
                <Typography className="info-description">
                  {todo.duration ? `${todo.duration} minutos` : "Sin límite"}
                </Typography>
              </IconLabelContainer>
            </ExamDataItem> */}

							{/* <ExamDataItem>
              <Typography className="label">Límite de intentos</Typography>
              <IconLabelContainer>
                <FuseSvgIcon>heroicons-outline:arrow-uturn-right</FuseSvgIcon>
                <Typography className="info-description">
                  {todo.attempts_limit ? todo.attempts_limit : "Sin límite"}
                </Typography>
              </IconLabelContainer>
            </ExamDataItem> */}

							{/* {user.role === "student" && (
                <ExamDataItem>
                  <Typography className="label">Intentos</Typography>
                  <IconLabelContainer>
                    <Typography className="info-description">
                      {todo.attempts ? todo.attempts : 0}
                    </Typography>
                  </IconLabelContainer>
                </ExamDataItem>
              )} */}

						<ActionButtons>
							{/* {user?.role === "student" && (
                <ActionButton
                  variant="contained"
                  disabled={
                    // (todo.attempts_limit && todo.attempts >= todo.attempts_limit) ||
                    (_.isNumber(todo.score))
                  }
                  onClick={() => startExam()}
                >
                  Empezar exámen
                </ActionButton>
              )}

              {user?.role === "student" && (
                <ActionButton
                  variant="contained"
                  disabled={
                    // (todo.attempts_limit && todo.attempts >= todo.attempts_limit) ||
                    (_.isNumber(todo.score))
                  }
                  onClick={() => startExam()}
                >
                  Empezar exámen
                </ActionButton>
               )}

              {user?.role === "teacher" && (
                <ActionButton variant="contained" onClick={() => previewExam()}>
                  Ver exámen
                </ActionButton>
              )} */}

							<ActionButton
								variant="contained"
								onClick={() => triggerExamAction()}
								disabled={
									(user.role === 'student' && _.isNumber(todo.score) && !todo.quiz_status) ||
									!_.isObject(todo.content)
								}
							>
								{user.role === 'student' && _.isNumber(todo.score) && 'Ver examen'}
								{user.role === 'student' && !_.isNumber(todo.score) && 'Empezar examen'}
								{user.role !== 'student' && 'Ver examen'}
							</ActionButton>
						</ActionButtons>
					</ExamData>
				</CardContent>
			</Card>
			{editDialogOpen && (
				<EditExamDialog
					open={editDialogOpen}
					handleClose={handleEditDialogClose}
					todo={todo}
					sendUpdatedTodo={sendUpdatedTodo}
				/>
			)}
		</>
	);
}

export default ExamDetailsCard;
