import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { SessionItem } from 'app/shared-components/general/SessionSlideshow/SessionSlideshow';
import BaseUserType from 'app/store/user/BaseUserType';
import { selectUser } from 'app/store/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useParams } from 'react-router';
import axios, { AxiosResponse } from 'axios';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { showMessage } from 'app/store/fuse/messageSlice';
import { ReplaceContentDialog } from './ReplaceContentDialog';
import { SliderStartButton } from './TopicPage';

const IMAGE_TYPES = ['image'];
const IFRAME_TYPES = ['html', 'video', 'presentation'];

const SliderCoverImageStyle = styled(Box)(() => ({
	borderRadius: '1rem',
	width: '100%',
	marginTop: '30px',
	maxHeight: '40em',
	overflow: 'hidden',
	objectFit: 'cover'
}));

interface SliderCoverImageProps {
	image?: string;
	slide: SessionItem | null;
	sessionid: number;
	topicsName: string;
	onReload: () => void;
	startClass: () => void;
}

function SliderCoverImage({ image, slide, sessionid, onReload, topicsName, startClass }: SliderCoverImageProps) {
	const dispatch = useDispatch();
	const user: BaseUserType = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const { courseid } = useParams();
	const isTeacher = user.role === 'teacher';
	const isGoogleSlides = slide?.type === 'presentation';
	const [editPresentation, setEditPresentation] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isHover, setIsHover] = useState<boolean>(false);

	const extractIframeSrc = (iframeString: string): string | null => {
		const match = iframeString.match(/src=["']([^"']+)["']/);
		return match ? match[1] : null;
	};

	const postReplaceContent = (payload) =>
		new Promise((resolve, reject) => {
			axios
				.post(`v1/courses/${courseid}/sessions/${sessionid}/session_items/`, payload)
				.then((response: AxiosResponse<any>) => {
					if (response.data) {
						onClose();
						resolve(response.data);
					} else {
						reject(response.data);
					}
					onReload();
					setIsLoading(false);
				})
				.catch(() => {
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
					setIsLoading(false);
				});
		});

	const putReplaceContent = (payload) =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseid}/session_items/${slide.id}/update/`, payload)
				.then((response: AxiosResponse<any>) => {
					if (response.data) {
						onClose();
						resolve(response.data);
					} else {
						reject(response.data);
					}
					onReload();
					setIsLoading(false);
				})
				.catch(() => {
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
					setIsLoading(false);
				});
		});

	const onClose = () => {
		setEditPresentation(false);
	};

	const onSave = (content: string) => {
		setIsLoading(true);
		if (slide?.type.toLowerCase() === 'presentation') {
			const payload = { ...slide, content };
			putReplaceContent(payload);
		} else {
			const payload = {
				content,
				name: `Google Slides - ${topicsName}`,
				type: 'presentation',
				weight: 0,
				position: 0,
				active: true
			};
			postReplaceContent(payload);
		}
	};

	const onRemove = () => {
		setIsLoading(true);
		const payload = { ...slide, active: false };
		putReplaceContent(payload);
	};

	console.log(slide);

	return (
		<div>
			{slide && (
				<SliderCoverImageStyle sx={{ position: 'relative', mb: isGoogleSlides ? 5 : 0 }}>
					{!isGoogleSlides && (
						<Box
							onMouseEnter={() => setIsHover(true)}
							onMouseLeave={() => setIsHover(false)}
							onClick={startClass}
							sx={{
								position: 'relative',
								width: '100%',
								aspectRatio: '16 / 9',
								backgroundColor: 'transparent',
								top: '1px',
								zIndex: 9,
								cursor: 'pointer',
								'&:hover': {
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									alignContent: 'center',
									backgroundColor: 'black',
									opacity: '0.5'
								}
							}}
						>
							{isHover && (
								<>
									<SlideshowIcon
										fontSize="large"
										sx={{ transform: 'scale(3)' }}
									/>
									<Typography
										mt={4}
										variant="h4"
									>
										Empezar Clase
									</Typography>
								</>
							)}
						</Box>
					)}
					{isTeacher && isPremium && (
						<Tooltip
							title={
								isPremium
									? 'Edita la presentación'
									: 'Para usar esta función, necesitas la versión premium. ¡Actualiza ahora y disfruta de todos los beneficios!'
							}
						>
							<div>
								<IconButton
									disabled={!isPremium}
									onClick={() => setEditPresentation(true)}
									sx={{
										backgroundColor: 'white',
										position: 'absolute',
										zIndex: 999999,
										top: 15,
										right: 15,
										boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.25)'
									}}
								>
									<EditIcon />
								</IconButton>
							</div>
						</Tooltip>
					)}
					{((!image && IFRAME_TYPES.includes(slide.type.toLowerCase())) ||
						slide.type.toLowerCase() === 'presentation') && (
						<iframe
							style={{
								width: '100%',
								aspectRatio: '16 / 9',
								overflow: 'hidden',
								transform: 'translateZ(0px)',
								position: isGoogleSlides ? 'static' : 'absolute',
								top: isGoogleSlides ? '1px' : 0
							}}
							src={isGoogleSlides ? extractIframeSrc(slide.content) : slide.content}
							title={slide.name}
							webkitallowfullscreen="true"
							allowfullscreen="true"
							mozallowfullscreen="true"
							frameBorder="0"
							scrolling="no"
						/>
					)}
					{(!!image || IMAGE_TYPES.includes(slide.type)) && slide.type.toLowerCase() !== 'presentation' && (
						<img
							style={{
								borderRadius: '1rem',
								width: '100%',
								objectFit: 'cover',
								aspectRatio: '16 / 9',
								overflow: 'hidden',
								transform: 'translateZ(0px)',
								position: 'absolute',
								top: 0
							}}
							src={image || slide.content}
							alt="Portada de Sesión"
						/>
					)}
				</SliderCoverImageStyle>
			)}
			{!slide && isTeacher && isPremium && (
				<SliderStartButton
					variant="contained"
					onClick={() => setEditPresentation(true)}
				>
					Agrega Google Slides a esta lección
				</SliderStartButton>
			)}
			<ReplaceContentDialog
				addNewContent={!slide}
				open={editPresentation}
				onClose={onClose}
				onSave={onSave}
				onRemove={onRemove}
				isLoading={isLoading}
				showRemoveButton={slide?.type === 'presentation'}
				iframeString={slide?.type === 'presentation' ? slide.content : ''}
			/>
		</div>
	);
}

export default SliderCoverImage;
