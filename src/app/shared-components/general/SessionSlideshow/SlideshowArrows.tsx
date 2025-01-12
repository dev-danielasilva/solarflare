import { Dispatch, SetStateAction, useEffect } from 'react';
import { Box, IconButton, Theme } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { SessionItem } from './SessionSlideshow';

interface SlideshowArrowsProps {
	sessionItems: SessionItem[];
	actualSessionItem: SessionItem;
	setActualSessionItem: Dispatch<SetStateAction<SessionItem>>;
}

function SlideshowArrows({ sessionItems, setActualSessionItem, actualSessionItem }: SlideshowArrowsProps) {
	const handleChangeSessionItem = (direction: 'next' | 'back') => {
		const lengthOfSessionItems = sessionItems.length;
		if (direction === 'next') {
			const newPosition: number = actualSessionItem.position + 1;
			if (newPosition < lengthOfSessionItems) {
				setActualSessionItem({ ...sessionItems[newPosition], position: newPosition });
			}
		}

		if (direction === 'back') {
			const newPosition: number = actualSessionItem.position - 1;
			if (newPosition >= 0) {
				setActualSessionItem({ ...sessionItems[newPosition], position: newPosition });
			}
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowRight') {
				handleChangeSessionItem('next');
			} else if (event.key === 'ArrowLeft') {
				handleChangeSessionItem('back');
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [actualSessionItem, sessionItems]);

	return (
		<>
			<Box
				sx={{
					position: 'fixed',
					top: '50%',
					left: '1vw',
					transform: 'translateY(-50%)',
					zIndex: 9999999
				}}
			>
				{actualSessionItem.position !== 0 && (
					<IconButton
						size="large"
						sx={{ backgroundColor: (theme: Theme) => theme.palette.background.paper, opacity: 0.5 }}
						onClick={() => handleChangeSessionItem('back')}
					>
						<ArrowBackIosRoundedIcon />
					</IconButton>
				)}
			</Box>
			<Box
				sx={{
					position: 'fixed',
					top: '50%',
					right: 15,
					transform: 'translateY(-50%)',
					zIndex: 9999999
				}}
			>
				{actualSessionItem.position < sessionItems.length - 1 && (
					<IconButton
						size="large"
						sx={{ backgroundColor: (theme: Theme) => theme.palette.background.paper, opacity: 0.5 }}
						onClick={() => handleChangeSessionItem('next')}
					>
						<ArrowForwardIosRoundedIcon />
					</IconButton>
				)}
			</Box>
		</>
	);
}

export default SlideshowArrows;
