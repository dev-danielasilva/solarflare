import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useMediaQuery, useTheme, Container, Box, Stack } from '@mui/material';
import { Banner } from 'app/shared-components/general/Banner';
import GlobalGradesSummary from 'app/shared-components/dedicated/GradesSummaryStudent/GlobalGradesSummary';
import BaseUserType from 'app/store/user/BaseUserType';
import { selectUser } from 'app/store/user/userSlice';
import { useSelector } from 'react-redux';
import { getName } from 'src/app/utils';
import TeacherGradesSummary from 'app/shared-components/general/TeacherGradesSummary/TeacherGradesSummary';
import definitionService from 'src/app/services/definitionService';
import WeeklyCard from '../weekly-activities/WeeklyCard';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Dashboard() {
	const user: BaseUserType = useSelector(selectUser);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTeacher = user.role === 'teacher';
	const bannerImage = definitionService.getWelcomeBannerImage();

	return (
		<Root
			header={
				<Container maxWidth="lg">
					<Banner
						subtitle="¡Qué bueno verte,"
						title={`${getName(user, 'f')}!`}
						subtitlePosition="above"
					>
						{!isTeacher && bannerImage && (
							<Box className="banner-image">
								<img
									src={bannerImage.image}
									alt={bannerImage.alt ? bannerImage.alt : 'Personaje de bienvenida'}
									style={{
										width: isMobile ? '15vh' : '20vh',
										zIndex: 99,
										position: 'relative',
										left: '35%',
										transform: 'translate(-50%, 0)',
										top: isMobile ? '4vh' : '3vh',
										display: isMobile ? 'none' : 'block'
									}}
								/>
							</Box>
						)}
					</Banner>
				</Container>
			}
			content={
				<Container
					maxWidth="lg"
					sx={{ pb: 10 }}
				>
					<Stack spacing={2}>
						{!isTeacher ? (
							<>
								<GlobalGradesSummary />
								<WeeklyCard />
								{/* <SessionsProgressCard /> */}
							</>
						) : (
							<TeacherGradesSummary />
						)}
					</Stack>
				</Container>
			}
		/>
	);
}

export default Dashboard;
