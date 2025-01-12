// import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// The content of this page is irrelevant, please take a look at SessionSlideshow.tsx instead.

const SlideImage = styled(Box)<any>(({ theme }) => ({
	maxHeight: 120,
	width: 200,
	maxWidth: 200,
	objectFit: 'cover',
	borderRadius: '16px'
}));

const SlidesThumbnailsWrapper = styled(Box)<any>(({}) => ({
	display: 'flex'
}));

function SessionPageSlideshow() {
	// const { courseid, topicid, subjectid, sessionid } = useParams();
	// const [session, setSession] = useState(null);

	// useEffect(() => {
	// 	if (courseid && topicid && sessionid) {
	// 		getSession();
	// 	}
	// }, [courseid, topicid, sessionid]);

	// function getSession() {
	// 	jwtService.getSession(courseid, topicid, sessionid).then((session:any) => {
	// 		console.log('The session! ', session);
	// 		filterSession(session)
	// 	}).catch((e) => {
	// 		console.log('Error on getSession() ', e)
	// 	})
	// }

	// function filterSession(session) {
	// 	setSession(session);
	// }

	return <Box>Hey</Box>;
}

export default SessionPageSlideshow;
