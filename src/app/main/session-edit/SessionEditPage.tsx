import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { useParams } from 'react-router';
import jwtService from 'src/app/auth/services/jwtService';
import { useState, useEffect } from 'react';
import { Banner } from 'app/shared-components/general/Banner';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

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

function SessionEditPage() {
	const { courseid, topicid, subjectid, sessionid } = useParams();
	const [session, setSession] = useState(null);

	useEffect(() => {
		if (courseid && topicid && sessionid) {
			getSession();
		}
	}, [courseid, topicid, sessionid]);

	function getSession() {
		jwtService
			.getSession(courseid, topicid, sessionid)
			.then((session: any) => {
				filterSession(session);
			})
			.catch((e) => {
				console.error('Error on getSession() ', e);
			});
	}

	function filterSession(session) {
		setSession(session);
	}

	return session ? (
		<Root
			header={
				<Container
					maxWidth="lg"
					sx={{
						maxWidth: '70%',
						margin: 0
					}}
				>
					<Banner
						subtitle="Conceptos básicos de operaciones matemáticas que involucran la adición y la sustracción de números."
						title="Multiplicaciones y divisiones"
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
							<Typography
								sx={{
									fontSize: '2rem',
									fontWeight: 600,
									marginBottom: '1rem'
								}}
							>
								Diapositivas
							</Typography>
							<Typography
								sx={{
									fontSize: '1.6rem'
								}}
							>
								Selecciona la diapositiva para editarla.
							</Typography>

							<SlidesThumbnailsWrapper>
								{session.session_items}
								{/* <SlideImage
								component="img"
								alt={topic.imageAlt}
								src={topic.image}
							> */}
							</SlidesThumbnailsWrapper>
						</CardContent>
					</Card>
				</Container>
			}
		/>
	) : (
		''
	);
}

export default SessionEditPage;
