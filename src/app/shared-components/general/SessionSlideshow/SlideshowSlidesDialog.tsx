import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Box, Paper } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { SessionItem } from './SessionSlideshow';

interface SlideshowSlidesDialogProps {
	open: boolean;
	onClose: () => void;
	sessionItems: SessionItem[];
	actualSessionItem: SessionItem;
	setActualSessionItem: Dispatch<SetStateAction<SessionItem>>;
}
function SlideshowSlidesDialog({
	open,
	onClose,
	sessionItems,
	actualSessionItem,
	setActualSessionItem
}: SlideshowSlidesDialogProps) {
	const extractIframeSrc = (iframeString: string): string | null => {
		const match = iframeString.match(/src=["']([^"']+)["']/);
		return match ? match[1] : null;
	};

	return (
		<Dialog
			sx={{ zIndex: '999999999999 !important' }}
			fullWidth
			open={open}
			maxWidth="md"
		>
			<DialogTitle
				sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
			>
				Diapositivas
				<IconButton>
					<CloseRoundedIcon
						fontSize="small"
						onClick={onClose}
					/>
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					spacing={3}
				>
					{sessionItems.map((si) => (
						<Grid
							item
							lg={4}
							md={6}
							xs={12}
							marginTop="-15em"
						>
							<Box
								sx={{
									cursor: actualSessionItem.id === si.id ? 'default' : 'pointer',
									position: 'relative',
									height: '15em',
									backgroundColor: 'transparent',
									top: '15em',
									zIndex: 9
								}}
								onClick={() => {
									if (si.id !== actualSessionItem.id) {
										setActualSessionItem(si);
									}
								}}
							/>
							<Box
								component={Paper}
								elevation={actualSessionItem.id === si.id ? 2 : 5}
								sx={{
									cursor: actualSessionItem.id === si.id ? 'default' : 'pointer',
									backgroundColor: (theme) => theme.palette.primary.main,
									opacity: actualSessionItem.id === si.id ? 1 : 0.2,
									height: '15em !important',
									transform: 'translateZ(0px)',
									overflow: 'hidden'
								}}
								onClick={() => {
									if (si.id !== actualSessionItem.id) {
										setActualSessionItem(si);
									}
								}}
							>
								{/* TODO: ASK ABOUT IFRAME IS NOT A GOOD FIT FOR PREVIEWS BECAUSE OF SIZE... */}
								{si.type.toLowerCase() === 'html' && (
									<iframe
										style={{
											display: 'block',
											height: '100%',
											width: '100%'
										}}
										src={si.content}
										title={si.name}
										frameBorder="0"
										scrolling="no"
									/>
								)}
								{si.type.toLowerCase() === 'image' && (
									<img
										alt={si.name}
										src={si.content}
										style={{
											display: 'block',
											width: '100%',
											height: '100%',
											objectFit: 'cover'
										}}
									/>
								)}
								{si.type.toLowerCase() === 'video' && (
									<iframe
										width="100%"
										height="100%"
										src={si.content}
										title={si.name}
										style={{ border: 'none' }}
										allowFullScreen
									/>
								)}
								{si.type.toLowerCase() === 'presentation' && (
									<iframe
										width="100%"
										height="100%"
										src={extractIframeSrc(si.content)}
										title={si.name}
										style={{ border: 'none' }}
										allowFullScreen
									/>
								)}
							</Box>
						</Grid>
					))}
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default SlideshowSlidesDialog;
