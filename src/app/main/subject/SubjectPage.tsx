import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import {
	Container,
	Card,
	CardContent,
	Typography,
	IconButton,
	Box,
	Tooltip,
	useTheme,
	useMediaQuery
} from '@mui/material';
import { useParams } from 'react-router';
import { Banner } from 'app/shared-components/general/Banner';
import { useEffect, useState } from 'react';
import jwtService from 'src/app/auth/services/jwtService';
import TopicsList from 'app/shared-components/dedicated/TopicsList/TopicsList';
import AddTopicDialog from 'app/shared-components/dedicated/LHDialogs/AddTopicDialog';
import AccessDenied from 'app/shared-components/general/AccessDenied/AccessDenied';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { useAppDispatch } from 'app/store';
import LoadingPage from 'app/shared-components/general/LoadingComponents/LoadingPage';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

const PlusAction = styled(IconButton)<any>(({ theme }) => ({
	// position: 'absolute',
	// right: '2rem',
	// top: '2rem'
	// backgroundColor: 'white',
	// display: 'flex',
	// borderRadius: '50px',
	boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
	// '& .material-icons': {
	// 	color: '#000',
	// 	padding: '0.5rem'
	// }
}));

function SubjectPage() {
	const { courseid, subjectid } = useParams();
	const user = useSelector(selectUser);
	const isPremium = user?.tenant?.license.type.toLowerCase() === 'premium';
	const theme = useTheme();
	const [course, setCourse] = useState();
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [accessDenied, setAccessDenied] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user?.role === 'student') {
			setAccessDenied(true);
		} else if (courseid) {
			getCourse(courseid);
		}
	}, [courseid]);

	function getCourse(courseId) {
		jwtService
			.getCourse(courseId)
			.then((course: any) => {
				setCourse(course);
			})
			.catch((e) => {
				console.error('Error retrieving course: ', e);
				if (e?.response?.status === 400 || e?.response?.status === 401) {
					setAccessDenied(true);
				}
			});
	}

	function updateCourseWithTopic(topic) {
		const newtopics = course.subject.topics;
		const topicIdx = newtopics.findIndex((nt) => nt.id === topic.id);
		newtopics[topicIdx] = { ...newtopics[topicIdx], ...topic };
		setCourse((prevCourse) => {
			return {
				...prevCourse,
				subject: {
					...prevCourse.subject,
					topics: newtopics
				}
			};
		});
	}

	function openAddTopicModal(e) {
		setAddDialogOpen(true);
	}

	function handleAddTopicModalClose() {
		setAddDialogOpen(false);
	}

	const addTopic = (topic) => {
		const newtopics = course.subject.topics;
		newtopics.push(topic);
		setCourse((prevCourse) => {
			return {
				...prevCourse,
				subject: {
					...prevCourse.subject,
					topics: newtopics
				}
			};
		});
		setAddDialogOpen(false);
	};

	return course ? (
		<Root
			header={
				<Container maxWidth="lg">
					<Banner
						subtitle={`${course?.grade} - ${course?.group}`}
						title={course?.subject?.name}
						subtitlePosition="under"
					/>
				</Container>
			}
			content={
				<Container maxWidth="lg">
					<Card
						className="mt-0 p-24"
						sx={{ position: 'relative' }}
					>
						<CardContent>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}
							>
								<Box>
									<Typography
										sx={{
											fontSize: '2rem',
											fontWeight: 600,
											marginBottom: '1rem'
										}}
									>
										Temas
									</Typography>
									<Typography
										sx={{
											fontSize: '1.6rem'
										}}
									>
										Selecciona el tema que quieres ver.
									</Typography>
								</Box>
								<Tooltip
									title={
										isPremium
											? 'Agrega un nuevo tema'
											: 'Para usar esta función, necesitas la versión premium. ¡Actualiza ahora y disfruta de todos los beneficios!'
									}
								>
									<Box>
										<PlusAction
											size="small"
											sx={{ cursor: isPremium ? 'pointer' : 'default', mr: '4px' }}
											disabled={!isPremium}
											onClick={(e) => {
												if (isPremium) {
													openAddTopicModal(e);
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
									</Box>
								</Tooltip>
							</Box>
							<TopicsList
								topics={course.subject.topics}
								subjectid={course.subject.id}
								courseid={course.id}
								sendUpdateTopic={updateCourseWithTopic}
								isPremium={isPremium}
							/>
						</CardContent>
					</Card>
					<AddTopicDialog
						open={addDialogOpen}
						handleClose={handleAddTopicModalClose}
						subjectid={course.subject.id}
						courseid={course.id}
						addTopic={addTopic}
					/>
				</Container>
			}
		/>
	) : accessDenied ? (
		<AccessDenied />
	) : (
		<LoadingPage />
	);
}

export default SubjectPage;
