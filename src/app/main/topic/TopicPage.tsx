import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	IconButton,
	LinearProgress,
	Tooltip,
	Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Banner } from 'app/shared-components/general/Banner';
import TodosPanel from 'app/shared-components/dedicated/TodosTopicSummary/TodosPanel';
import jwtService from 'src/app/auth/services/jwtService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getValueSafe } from 'src/app/utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import definitionService from 'src/app/services/definitionService';
import LoadingPage from 'app/shared-components/general/LoadingComponents/LoadingPage';
import NoItemsFound from 'app/shared-components/general/NoItemsFound/NoItemsFound';
import AddTodoDialog from 'app/shared-components/dedicated/LHDialogs/AddTodoDialog';
import { SessionItem } from 'app/shared-components/general/SessionSlideshow/SessionSlideshow';
import _ from '@lodash';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import SliderCoverImage from './SliderCoverImage';
import DownloadResourcesButton from './DownloadResourcesButton';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {
		height: '10px'
	},
	'& .FusePageSimple-sidebarContent': {}
}));

const SliderCover = styled(Box)(({ theme }) => ({
	marginBottom: '1rem',
	textAlign: 'center'
}));

export const SliderStartButton = styled(Button)<any>(({ theme }) => ({
	margin: '2rem',
	color: 'white',
	backgroundColor: '#6F99F5',
	'&:hover': {
		backgroundColor: '#5174C2'
	}
}));

const PlusAction = styled(IconButton)<any>(({ theme }) => ({
	// boxShadow: 3
	// position: 'absolute',
	// right: '2rem',
	// top: '2rem',
	// backgroundColor: 'white',
	// display: 'flex',
	// borderRadius: '50px',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
	// cursor: 'pointer'
}));

const LinkStartSessionWrapper = styled(Link)<any>(({ theme }) => ({
	textDecoration: 'none'
}));

const CardHeader = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	marginBottom: '1rem',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const CardHeaderImage = styled(Box)<any>(({ theme }) => ({
	borderRadius: '100px',
	maxWidth: '85px',
	marginRight: '1.5rem',
	[theme.breakpoints.down('sm')]: {
		marginBottom: '1rem'
	}
}));

function TopicPage() {
	const user = useSelector(selectUser);
	const navigate = useNavigate();
	const { courseid, topicid } = useParams();
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const [topic, setTopic] = useState(null);
	const [allTodos, setAllTodos] = useState([]);
	const [slides, setSlides] = useState([]);
	const [reload, setReload] = useState<boolean>(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();
	const errorMessage = 'Ocurrió un error recuperando este tema. Por favor intenta más tarde.';
	const headerImage = definitionService.getSkinFromDefinition('card_characters.topic_summary', null);

	useEffect(() => {
		if (courseid && topicid) {
			getTopic(courseid, topicid);
		}
		if (reload) setReload(false);
	}, [courseid, topicid, reload]);

	const getSlides = (slides: SessionItem[]) => {
		const isThereAGoogleSlides = slides?.filter(
			(slide) => slide.type.toLowerCase() === 'presentation' && slide.active && slide.hidden != true
		);
		if (isThereAGoogleSlides.length) {
			return isThereAGoogleSlides;
		}

		return slides.filter(
			(slide) =>
				slide.type.toLowerCase() !== 'quiz' && slide.type !== 'activity' && slide.active && slide.hidden != true
		);
	};

	useEffect(() => {
		if (topic) {
			setSlides(getSlides(topic?.sessions[0]?.session_items));
			setAllTodos(
				topic?.sessions[0]?.session_items?.filter(
					(session_item) =>
						(session_item.type === 'quiz' || session_item.type === 'activity') &&
						session_item.active &&
						((session_item.hidden != true && user.role === 'student') || user.role === 'teacher')
				)
			);
		}
	}, [topic]);

	function getTopic(courseid, topicid) {
		setLoading(true);
		jwtService
			.getTopic(courseid, topicid)
			.then((topic: any) => {
				if (_.isObject(topic.sessions[0])) {
					setTopic(topic);
				} else {
					console.error('Error retrieving topic');
					triggerMessage(errorMessage);
				}
				setLoading(false);
			})
			.catch((e) => {
				console.error('Error on getTopic() ', e);
				triggerMessage(errorMessage);
				setLoading(false);
			});
	}

	const onReload = () => {
		setReload(true);
	};

	function handleAddTopicModalClose() {
		setAddDialogOpen(false);
	}

	function openAddTodoModal(e) {
		setAddDialogOpen(true);
	}

	const addTodo = (todo) => {
		const newTodos = topic.sessions[0].session_items;
		newTodos.push(todo);
		setTopic((prevTopic) => {
			return {
				...prevTopic,
				sessions: [
					{
						...topic.sessions[0],
						session_items: newTodos
					}
				]
			};
		});
		setAddDialogOpen(false);
	};

	const handleUpdateTodo = (updatedTodo) => {
		if (updatedTodo.id) {
			const idxUpdatedTodo = topic.sessions[0].session_items.findIndex((si) => si.id === updatedTodo.id);
			const updatedTodos = topic.sessions[0].session_items;

			if (updatedTodos[idxUpdatedTodo]) {
				updatedTodos[idxUpdatedTodo] = updatedTodo;
				setTopic((prevTopic) => {
					return {
						...prevTopic,
						sessions: [
							{
								...topic.sessions[0],
								session_items: updatedTodos
							}
						]
					};
				});
			}
		}
	};

	const triggerMessage = (message) => {
		dispatch(
			showMessage({
				message,
				autoHideDuration: 10000, // ms
				anchorOrigin: {
					vertical: 'top', // top bottom
					horizontal: 'center' // left center right
				},
				variant: 'error' // success error info warning null
			})
		);
	};

	return topic ? (
		<Root
			header={
				<Container
					maxWidth="lg"
					sx={{
						maxWidth: '70%',
						height: '100%',
						margin: 0
					}}
				>
					<Banner
						subtitle={getValueSafe(() => topic?.description, '')}
						title={getValueSafe(() => topic?.name, 'Tema sin nombre')}
						subtitlePosition="under"
						boxStyle={{ minHeight: 'auto', marginTop: '24px' }}
					/>
					{typeof topic?.sessions[0].progress === 'number' && (
						<LinearProgress
							color={topic?.sessions[0].progress === 100 ? 'success' : 'warning' || 'warning'}
							sx={{ backgroundColor: '#E5E5E5', my: 2 }}
							variant="determinate"
							value={typeof topic?.sessions[0].progress === 'number' ? topic?.sessions[0].progress : 0}
						/>
					)}
				</Container>
			}
			content={
				<Container maxWidth="lg">
					{topic.sessions[0].resource && (
						<DownloadResourcesButton
							resources={topic.sessions[0].resource}
							courseTopicSession={{
								courseId: courseid,
								topicId: topic.id,
								sessionId: topic.sessions[0].id
							}}
							isChanged={topic.sessions[0].resources_changed}
						/>
					)}
					<SliderCover>
						<SliderCoverImage
							image={topic.image}
							slide={slides[0] || null}
							sessionid={topic.sessions[0].id}
							sessionName={topic.name}
							onReload={onReload}
							startClass={() => {
								navigate(`sessions/${topic?.sessions[0].id}/slideshow`);
							}}
						/>
					</SliderCover>
					<Box
						sx={{
							position: 'relative',
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						{slides[0] && slides[0]?.type?.toLowerCase() !== 'presentation' && (
							<LinkStartSessionWrapper to={`sessions/${topic?.sessions[0].id}/slideshow`}>
								<SliderStartButton variant="contained">Empezar clase</SliderStartButton>
							</LinkStartSessionWrapper>
						)}
					</Box>
					<Card
						className="mt-0 p-24"
						sx={{ position: 'relative', marginBottom: '4rem' }}
					>
						<CardContent sx={{ padding: '0 !important' }}>
							<CardHeader>
								{user?.role === 'student' && headerImage?.image && (
									<CardHeaderImage
										component="img"
										src={headerImage?.image}
										alt={headerImage?.alt ? headerImage.alt : 'Detalles del examen'}
									/>
								)}
								<Box
									sx={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between'
									}}
								>
									<Box sx={{ marginBottom: '1rem' }}>
										<Typography
											sx={{
												fontSize: '2rem',
												fontWeight: 600,
												marginBottom: '0.5rem'
											}}
										>
											Exámenes y actividades
										</Typography>
										<Typography
											sx={{
												fontSize: '1.6rem'
											}}
										>
											Selecciona el examen o la actividad para ver los detalles.
										</Typography>
									</Box>
									{user.role !== 'student' && (
										<Tooltip
											arrow
											placement="bottom"
											title={
												isPremium
													? 'Agrega un nuevo examen.'
													: 'Para usar esta función, necesitas la versión premium. ¡Actualiza ahora y disfruta de todos los beneficios!'
											}
											slotProps={{
												popper: {
													modifiers: [
														{
															name: 'offset',
															options: {
																offset: [0, -50]
															}
														}
													]
												}
											}}
										>
											<div>
												<PlusAction
													size="small"
													disabled={!isPremium}
													onClick={(e) => {
														if (isPremium) {
															openAddTodoModal(e);
														}
													}}
												>
													<i
														className="material-icons"
														style={{ color: isPremium ? 'black' : '' }}
													>
														add
													</i>
												</PlusAction>
											</div>
										</Tooltip>
									)}
								</Box>
							</CardHeader>

							{allTodos?.length > 0 ? (
								<TodosPanel
									type="quiz"
									todos={allTodos}
									sendUpdateTodo={handleUpdateTodo}
									isPremium={isPremium}
								/>
							) : (
								<NoItemsFound />
							)}
						</CardContent>
					</Card>
					{addDialogOpen && (
						<AddTodoDialog
							open={addDialogOpen}
							handleClose={handleAddTopicModalClose}
							sessionid={topic.sessions[0].id}
							courseid={courseid}
							addTodo={addTodo}
						/>
					)}
				</Container>
			}
		/>
	) : loading ? (
		<LoadingPage />
	) : (
		''
	);
}

export default TopicPage;
