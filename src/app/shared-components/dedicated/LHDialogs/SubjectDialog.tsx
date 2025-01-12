import { DialogContent, DialogTitle, LinearProgress, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { Theme } from '@mui/system/createTheme';
import Box from '@mui/material/Box';
import { BoxProps } from '@mui/system';
import { Link } from 'react-router-dom';
// import { getName } from 'src/app/utils';
import jwtService from 'src/app/auth/services/jwtService';
import { useEffect, useState } from 'react';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import definitionService from 'src/app/services/definitionService';
import StarProgressSvg from 'app/shared-components/general/StarProgress';
import { progressStarsAndMedals } from 'app/shared-components/general/utils';

type SimpleDialogProps = {
	theme?: Theme;
	opacity?: string;
	bgColor?: string;
};

const StyledSimpleDialog = styled(Dialog)<SimpleDialogProps>(({ theme, opacity, bgColor }) => ({
	zIndex: 99999,
	[theme.breakpoints.down('sm')]: {
		'& .MuiPaper-root ': {
			maxWidth: '95%'
		}
	},
	'& .MuiBackdrop-root': {
		// backgroundColor: `${theme.palette.secondary.main}70`,
		backgroundColor: `${bgColor}70`,
		backdropFilter: 'blur(10px)'
	},
	'& .MuiDialog-container .MuiDialog-paper': {
		overflow: 'visible',
		backgroundColor: `${theme?.palette?.ada?.base ? theme?.palette?.ada?.base : '#FFF'}`
	},
	'& .MuiDialog-container .MuiDialog-paper .MuiDialogContent-root .MuiDialogContentText-root': {
		textAlign: 'center'
	}
}));

interface StyledTopImageProps extends BoxProps {
	alt?: string;
	src?: string;
}

const StyledTopImage = styled(Box)<StyledTopImageProps>(({ theme }) => ({
	width: '100%',
	maxHeight: 200,
	objectFit: 'cover',
	borderTopRightRadius: '16px',
	borderTopLeftRadius: '16px',
	marginBottom: '1rem'
	// [theme.breakpoints.up('xl')]: {
	// 	marginBottom: '5em'
	// }
}));

interface StyledTopicRowProps extends BoxProps {
	topics?: any[];
	idx?: number;
	theme?: Theme;
}

const StyledTopicRow = styled(Box)<StyledTopicRowProps>(({ topics, idx, theme }) => ({
	[theme.breakpoints.up('sm')]: {
		display: 'flex'
	},
	display: 'block',
	width: '100%',
	color: 'black',
	marginBottom: '1.5rem',
	paddingBottom: '1.5rem',
	borderBottom: topics[idx + 1] ? `1px solid #F3F3F3` : 'none'
}));

interface StyledTopicImageColProps extends BoxProps {
	session: any;
	theme?: Theme;
}

const StyledTopicImageCol = styled(Box)<StyledTopicImageColProps>(({ session, theme }) => ({
	marginRight: '2rem',
	width: '100%',
	'& #topic-image': {
		objectFit: 'cover',
		borderRadius: '1rem',
		marginBottom: '1rem',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			marginBottom: '1.5rem'
		}
	},
	'& #topic-progress-line': {
		height: '0.5rem',
		borderRadius: '10rem',
		// backgroundColor: '#E5E5E5',
		// '&:before': {
		// 	content: '""',
		// 	borderRadius: '1rem',
		// 	backgroundColor: `${session?.stars == 3 ? '#FFD143' : '#39C74A'}`,
		// 	width: `${session?.progress}%`,
		// 	height: '0.5rem',
		// 	display: 'block'
		// },
		[theme.breakpoints.down('sm')]: {
			marginBottom: '1.5rem'
		}
	},
	[theme.breakpoints.up('sm')]: {
		width: '30%'
	}
}));

interface StyledTopicInfoColProps extends BoxProps {
	theme?: Theme;
}

const StyledTopicInfoCol = styled(Box)<StyledTopicInfoColProps>(({ theme }) => ({
	flexGrow: 1,
	width: '100%',
	'& #topic-name': {
		fontWeight: 600,
		marginTop: '-0.5rem'
	},
	'& #topic-stars-wrapper': {
		display: 'flex',
		marginTop: '1rem',
		'& .star-svg': {
			width: '2rem',
			marginRight: '0.5rem',
			'& .star-svg-fill-path': {
				fill: '#FFD143'
			}
		}
	},
	[theme.breakpoints.up('sm')]: {
		width: '70%'
	}
}));

function SubjectDialog({ open, handleClose, courseId }) {
	const theme = useTheme();
	const [course, setCourse] = useState();
	const [currentTopic, setCurrentTopic] = useState({});
	const [loading, setLoading] = useState(false);
	const [topics, setTopics] = useState([]);
	const dispatch = useAppDispatch();
	const bgColor = definitionService.getBackgroundColor();

	useEffect(() => {
		setLoading(true);
		if (courseId) {
			getGradesSummary(courseId);
		}
	}, [courseId, open]);

	useEffect(() => {
		if (course?.id) {
			const topic = course?.subject?.topics?.find((topic) => topic?.sessions[0]?.stars !== 3);
			if (topic) {
				setCurrentTopic(() => {
					return topic || course.subject.topics[0];
				});
			}

			const visibleTopics = course?.subject?.topics?.filter((topic) => topic.hidden != true);
			setTopics(visibleTopics);
		}
		setLoading(false);
	}, [course]);

	function getGradesSummary(courseId) {
		jwtService
			.getCourse(courseId)
			.then((course: any) => {
				setCourse(course);
				setLoading(false);
			})
			.catch((e) => {
				console.error('Error retrieving summary: ', e);
				handleClose();
				setLoading(false);
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
		course && (
			<StyledSimpleDialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="sm"
				className="subject-modal"
				bgColor={bgColor}
			>
				{!loading ? (
					<>
						{course?.subject?.image?.url && (
							<StyledTopImage
								component="img"
								src={course?.subject?.image?.url}
								alt={course?.subject?.image?.atl}
							/>
						)}
						<DialogTitle>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									marginBottom: '2rem'
								}}
							>
								<Box>
									<Typography variant="h5">
										<b>{course?.subject?.name}</b>
									</Typography>
									{/* <Typography variant='subtitle1'>Docente(s):
							{CourseMock.teachers.map((teacher, idx) => (<span key={`teacher-${idx}`}>
								{` `}{getName(teacher)}{CourseMock.teachers[idx + 1] ? ', ' : ''}
								</span>)
							)}</Typography> */}
								</Box>
								{/* <Link
                    onClick={() => handleClose()}
                    to={`courses/${course?.id}/subjects/${course?.subject?.id}/topics/${currentTopic?.id}`}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        color: 'white',
                        backgroundColor: '#43B2AE',
                        '&:hover': {
                          backgroundColor: '#2D7B78',
                        },
                      }}
                    >
                      Continuar
                    </Button>
                  </Link> */}
							</Box>
							<Typography sx={{ fontSize: '20px' }}>
								<b>Temas</b>
							</Typography>
						</DialogTitle>
						<DialogContent>
							<Box>
								{topics.map((topic, idx) => {
									return (
										topic.active && (
											<Link
												onClick={() => handleClose()}
												key={`topic-${topic?.id}-${idx}`}
												to={`courses/${course?.id}/subjects/${course?.subject?.id}/topics/${topic?.id}`}
												style={{ textDecoration: 'none' }}
											>
												<StyledTopicRow
													topics={topics}
													idx={idx}
												>
													<StyledTopicImageCol
														session={topic?.sessions[0]}
														theme={theme}
													>
														<Box
															component="img"
															id="topic-image"
															src={
																topic.image
																	? topic.image
																	: 'assets/images/mock/new-topic.png'
															}
															alt={topic.imageAlt}
															sx={{
																boxShadow: '-1px 2px 8px -1px rgba(0,0,0,0.16)'
															}}
														/>
														<Box id="topic-progress-line">
															{typeof topic?.sessions[0].progress === 'number' && (
																<LinearProgress
																	color={
																		topic?.sessions[0].progress === 100
																			? 'success'
																			: 'warning' || 'warning'
																	}
																	sx={{ backgroundColor: '#E5E5E5' }}
																	variant="determinate"
																	value={topic?.sessions[0].progress || 0}
																/>
															)}
														</Box>
													</StyledTopicImageCol>
													<StyledTopicInfoCol>
														<Typography
															id="topic-name"
															variant="subtitle1"
														>
															{topic?.name}
														</Typography>
														<Typography variant="body1">{topic?.description}</Typography>

														<Box id="topic-stars-wrapper">
															{progressStarsAndMedals(
																parseFloat(topic?.sessions[0].stars),
																parseFloat(topic?.sessions[0].possible_stars)
															).map((fillHalfOrEmpty, idx) => (
																<StarProgressSvg
																	color="#F8D87C"
																	value={fillHalfOrEmpty}
																	width="1.5em"
																	key={`sm-${idx}`}
																/>
															))}
														</Box>
													</StyledTopicInfoCol>
												</StyledTopicRow>
											</Link>
										)
									);
								})}
							</Box>
						</DialogContent>
					</>
				) : (
					''
				)}
			</StyledSimpleDialog>
		)
	);
}

export default SubjectDialog;
