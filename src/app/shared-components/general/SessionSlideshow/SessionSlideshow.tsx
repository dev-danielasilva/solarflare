import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtService from 'src/app/auth/services/jwtService';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { SlideshowToolbar, ToolbarAction } from './SlideshowToolbar';
import SlideshowArrows from './SlideshowArrows';
import SlideshowItem from './SlideshowItem';
import SlideshowSlidesDialog from './SlideshowSlidesDialog';
import SlideshowNotes from './SlideshowNotes';

interface IParams {
	coursesid: string;
	sessionsid: string;
	topicsid: string;
}

export interface SessionItem {
	image: string;
	hidden: boolean;
	id: number;
	content: string;
	name: string;
	note: string;
	type: string;
	weight: number;
	due_date: string;
	status: 'pending' | 'completed' | 'graded';
	position?: number;
	active?: boolean;
	score: number;
}

// interface Session {
// 	id: number;
// 	name: string;
// 	progress: number;
// 	stars: number;
// 	session_items: SessionItem[];
// }

function SessionSlideshow() {
	const navigate = useNavigate();
	const user = useSelector(selectUser);
	const dispatch = useAppDispatch();
	const { pathname } = window.location;
	const [sessionItems, setSessionItems] = useState<SessionItem[]>([] as SessionItem[]);
	const [actualSessionItem, setActualSessionItem] = useState<SessionItem | null>(null);
	const [openSlides, setOpenSlides] = useState<boolean>(false);
	const [openNotes, setOpenNotes] = useState<boolean>(false);
	const [isNoteLoading, setIsNoteLoading] = useState<boolean>(false);

	const isTeacher = user.role === 'teacher';
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';

	const params: IParams = useMemo(() => {
		const listOfParams = pathname.replace('/', '').split('/');
		let objectOfParams = {} as IParams;
		listOfParams.forEach((p, ix) => {
			// eslint-disable-next-line
      if (!parseInt(p) && p !== 'slideshow') {
				objectOfParams = { ...objectOfParams, [`${p}id`]: listOfParams[ix + 1] };
			}
		});
		return objectOfParams;
	}, [pathname]);

	function getSession(courseid, topicid) {
		jwtService
			.getTopic(courseid, topicid)
			.then((topic: any) => {
				const _sessionItems = topic.sessions[0].session_items
					.filter(
						(si) =>
							si.type.toLowerCase() === 'image' ||
							si.type.toLowerCase() === 'html' ||
							si.type.toLowerCase() === 'video'
					)
					.sort((a, b) => a.order - b.order) // Sort session items by the order property
					.map((si, ix) => ({ ...si, position: ix }));

				setSessionItems(_sessionItems);

				if (!actualSessionItem) {
					if (topic.sessions[0].last_slide_visited) {
						const _lastSeenSlide = _sessionItems.find(
							(si) => si.id === topic.sessions[0].last_slide_visited
						);
						setActualSessionItem(_lastSeenSlide || _sessionItems[0]);
					} else {
						setActualSessionItem(_sessionItems[0]);
					}
				}
			})
			.catch((e) => {
				console.error('Error on getTopic() ', e);
			});
	}

	function closeSlideShow() {
		const targetPagePath = pathname.split('/sessions/');
		navigate(targetPagePath[0]);
	}

	function updateSessionItem(newNote: string) {
		setIsNoteLoading(true);
		jwtService
			.updateTodo(params.coursesid, actualSessionItem.id, {
				note: newNote
			})
			.then((_) => {
				const newSlide: SessionItem = { ...actualSessionItem, note: newNote };
				const newSessionItems = [...sessionItems];
				newSessionItems[newSlide.position] = newSlide;

				setActualSessionItem(newSlide);
				setSessionItems(newSessionItems);
				setIsNoteLoading(false);
				dispatch(
					showMessage({
						message: 'Nota exitosamente guardada.',
						autoHideDuration: 10000, // ms
						anchorOrigin: {
							vertical: 'top', // top bottom
							horizontal: 'center' // left center right
						},
						variant: 'success' // success error info warning
					})
				);
			})
			.catch((e) => {
				setIsNoteLoading(false);
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
				//  eslint-disable-next-line
        console.error('Error saving note: ', e)
			});
	}

	const onSaveSlideNote = (newNote: string) => {
		updateSessionItem(newNote);
	};

	const TOOLBAR_ACTIONS: ToolbarAction[] = [
		{
			label: 'Close',
			icon: <CloseRoundedIcon fontSize="small" />,
			onClick: closeSlideShow,
			shouldShow: true
		},
		{
			label: 'Booked',
			icon: <BookmarkBorderRoundedIcon fontSize="small" />,
			onClick: () => {},
			shouldShow: false
		},
		{
			label: 'Notes',
			icon: <TextSnippetOutlinedIcon fontSize="small" />,
			onClick: () => setOpenNotes(true),
			shouldShow: isTeacher && (!!actualSessionItem?.note || isPremium)
		},
		{
			label: 'Diapositivas',
			icon: <FilterNoneRoundedIcon fontSize="small" />,
			onClick: () => setOpenSlides(true),
			shouldShow: sessionItems?.length > 1
		}
	];

	useEffect(() => {
		console.log('course', params.coursesid, 'topic', params.topicsid);
		if (params.coursesid && params.topicsid) {
			getSession(params.coursesid, params.topicsid);
		}
	}, [params]);

	return (
		<Box
			sx={{
				position: 'absolute',
				zIndex: 99999,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: '#000'
			}}
		>
			{!!actualSessionItem && (
				<>
					{sessionItems?.length > 1 && (
						<SlideshowArrows
							sessionItems={sessionItems}
							setActualSessionItem={setActualSessionItem}
							actualSessionItem={actualSessionItem}
						/>
					)}
					<SlideshowToolbar actionButtons={TOOLBAR_ACTIONS} />
					<SlideshowItem
						actualSessionItem={actualSessionItem}
						sessionId={params.sessionsid}
						courseId={params.coursesid}
					/>
					<SlideshowSlidesDialog
						open={openSlides}
						onClose={() => setOpenSlides(false)}
						sessionItems={sessionItems}
						actualSessionItem={actualSessionItem}
						setActualSessionItem={setActualSessionItem}
					/>
					<SlideshowNotes
						open={openNotes}
						onClose={() => setOpenNotes(false)}
						note={actualSessionItem.note}
						onSubmitNote={onSaveSlideNote}
						isLoading={isNoteLoading}
						setIsLoading={setIsNoteLoading}
					/>
				</>
			)}
		</Box>
	);
}

export default SessionSlideshow;
