import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useMediaQuery, useTheme, Container, Box, Stack } from '@mui/material';
import { Banner } from 'app/shared-components/general/Banner';
import GlobalProgressCard from 'app/shared-components/dedicated/GlobalProgressCard/GlobalProgressCard';
import definitionService from 'src/app/services/definitionService';
import BaseUserType from 'app/store/user/BaseUserType';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import { getName } from 'src/app/utils';

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

function HomePage() {
	// const { t } = useTranslation('examplePage');
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const bannerImage = definitionService.getWelcomeBannerImage();
	const user: BaseUserType = useSelector(selectUser);

	return (
		<Root
			header={
				<Container maxWidth="lg">
					<Banner
						subtitle="¡Qué bueno verte,"
						title={`${getName(user, 'fm')}!`}
						subtitlePosition="above"
					>
						<Box className="banner-image">
							{bannerImage && (
								<img
									src={bannerImage.image}
									alt={bannerImage.alt ? bannerImage.alt : 'Personaje de bienvenida'}
									style={{
										width: isMobile ? '15vh' : '20vh',
										zIndex: 99,
										position: 'relative',
										left: '35%',
										transform: 'translate(-50%, 0)',
										top: isMobile ? '4vh' : '8vh'
									}}
								/>
							)}
						</Box>
					</Banner>
				</Container>
			}
			content={
				<Container maxWidth="lg">
					<Stack spacing={2}>
						<GlobalProgressCard />
						{/* <SessionsProgressCard /> */}
					</Stack>
				</Container>
			}
		/>
	);
}

export default HomePage;
