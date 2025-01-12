import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Container } from '@mui/material';
import { useParams } from 'react-router';

const Root = styled(FusePageSimple)(() => ({
	// '& .FusePageSimple-header': {
	// 	backgroundColor: theme.palette.background.paper,
	// 	borderBottomWidth: 1,
	// 	borderStyle: 'solid',
	// 	borderColor: theme.palette.divider
	// },
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function CoursePage() {
	const { courseid } = useParams();

	return (
		<Root
			content={
				<Container maxWidth="lg">
					<Card className="p-24">
						<CardContent>
							<p>Course id: {courseid}</p>
						</CardContent>
					</Card>
				</Container>
			}
		/>
	);
}

export default CoursePage;
