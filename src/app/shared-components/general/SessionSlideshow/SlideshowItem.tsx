import axios, { AxiosResponse } from 'axios';
import { Box } from '@mui/material';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SessionItem } from './SessionSlideshow';

interface SlideshowItemProps {
	actualSessionItem: SessionItem;
	sessionId: number | string;
	courseId: number | string;
}

// const TYPES = html, activity, quiz, video, image, url, presentation, text

function SlideshowItem({ actualSessionItem, sessionId, courseId }: SlideshowItemProps) {
	const { type, content, name } = actualSessionItem;
	const ref = useRef<HTMLImageElement>(null);
	const [isVertical, setIsVertical] = useState<boolean>(false);
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);

	const extractIframeSrc = (iframeString: string): string | null => {
		const match = iframeString.match(/src=["']([^"']+)["']/);
		return match ? match[1] : null;
	};

	const updateLastSeenSlide = () =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseId}/session/${sessionId}/user/`, { last_slide_visited: actualSessionItem.id })
				.then((response: AxiosResponse<any>) => {
					if (response.status === 200 || response.status === 201) {
						resolve(response.data);
					} else {
						reject(response.data);
					}
				})
				.catch((e) => {
					console.error('Error updating last seen slide:', e);
				});
		});

	useLayoutEffect(() => {
		if (type === 'image' && ref.current && imageLoaded) {
			const width = ref.current.naturalWidth;
			const height = ref.current.naturalHeight;

			if (width < height) {
				setIsVertical(true);
			} else {
				setIsVertical(false);
			}
		}
	}, [ref, imageLoaded, type]);

	const iframeSrc = type === 'presentation' ? extractIframeSrc(content) : null;

	useEffect(() => {
		updateLastSeenSlide();
	}, [actualSessionItem]);

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				position: 'absolute',
				display: 'flex',
				justifyContent: 'center',
				alignItems: { xs: 'center', sm: 'baseline' }
			}}
		>
			{type === 'html' && (
				<iframe
					style={{ width: '100%', height: '100%', position: 'absolute' }}
					src={content}
					title={name}
					allowFullScreen
				/>
			)}
			{type === 'video' && (
				<iframe
					width="100%"
					height="100%"
					src={content}
					style={{ border: 'none', position: 'absolute' }}
					title={name}
					allowFullScreen
				/>
			)}
			{type === 'image' && (
				<img
					ref={ref}
					id="slide-image"
					src={content}
					style={{
						objectFit: 'cover',
						height: isVertical ? 'auto' : '100%',
						width: '100%',
						position: 'absolute',
						overflowY: 'scroll'
					}}
					alt={name}
					onLoad={() => setImageLoaded(true)}
				/>
			)}
			{type === 'presentation' && iframeSrc && (
				<iframe
					src={iframeSrc}
					style={{ width: '100%', height: '100%', position: 'absolute' }}
					title={name}
				/>
			)}
		</Box>
	);
}

export default SlideshowItem;
