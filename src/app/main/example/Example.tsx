import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { Card, CardContent, useMediaQuery, useTheme, Container, Box } from '@mui/material';
import { Banner } from 'app/shared-components/general/Banner';

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

function Example() {
	// const { t } = useTranslation('examplePage');
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Root
			header={
				<Container maxWidth="lg">
					<Banner
						subtitle="¡Qué bueno verte,"
						title="Armando!"
						subtitlePosition="above"
					>
						<Box>
							<img
								src="assets/images/characters/fox-header.svg"
								alt="fox"
								style={{
									width: isMobile ? '15vh' : '20vh',
									zIndex: 99,
									position: 'relative',
									left: '35%',
									transform: 'translate(-50%, 0)',
									top: isMobile ? '4vh' : '8vh'
								}}
							/>
						</Box>
					</Banner>
				</Container>
			}
			content={
				<Container maxWidth="lg">
					<Card className="p-24">
						<CardContent>
							<h4>Content</h4>
							<br />
							<DemoContent />
						</CardContent>
					</Card>
				</Container>
			}
		/>
	);
}

export default Example;
