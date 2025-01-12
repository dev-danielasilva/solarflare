import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import FuseMessage from '@fuse/core/FuseMessage';

interface SlideshowNotesProps {
	open: boolean;
	onClose: () => void;
	note: string;
	downloadContent?: string;
	onSubmitNote: (note: string) => void;
	isLoading: boolean;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

function SlideshowNotes({
	open,
	onClose,
	note,
	downloadContent,
	onSubmitNote,
	isLoading,
	setIsLoading
}: SlideshowNotesProps) {
	const user = useSelector(selectUser);
	const isPremium = user.tenant.license.type.toLowerCase() === 'premium';
	const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
	const [editedNote, setEditedNote] = useState<string>(note);

	const handleEditSubmit = () => {
		if (editedNote === note || !isEditingNote) {
			setIsEditingNote((prev) => !prev);
		} else {
			setIsLoading(true);
			onSubmitNote(editedNote);
		}
	};

	const handleClose = () => {
		setIsLoading(false);
		setIsEditingNote(false);
		onClose();
	};

	const onDownload = () => {
		fetch(downloadContent, {
			method: 'GET'
		})
			.then((response) => response.blob())
			.then((blob) => {
				// Create blob link to download
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement('a');
				link.href = url;

				// Append to html link element page
				document.body.appendChild(link);

				// Start download
				link.click();

				// Clean up and remove the link
				link.parentNode.removeChild(link);
			});
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xs"
			sx={{
				zIndex: '99999999 !important'
			}}
			PaperProps={{
				sx: {
					position: 'absolute !important',
					right: '0 !important',
					top: '10vh !important'
				}
			}}
		>
			<DialogTitle
				sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
			>
				Notas
				<Stack
					direction="row"
					spacing={1}
				>
					{isLoading ? (
						<CircularProgress size={25} />
					) : (
						isPremium && (
							<IconButton
								size="small"
								onClick={handleEditSubmit}
							>
								{isEditingNote ? (
									<CheckRoundedIcon fontSize="small" />
								) : (
									<ModeEditOutlineOutlinedIcon fontSize="small" />
								)}
							</IconButton>
						)
					)}
					<IconButton
						sx={{ boxShadow: 3 }}
						size="small"
						onClick={handleClose}
					>
						<CloseRoundedIcon fontSize="small" />
					</IconButton>
				</Stack>
			</DialogTitle>
			<Divider
				sx={{ opacity: 0.6 }}
				variant="middle"
				flexItem
			/>
			<DialogContent
				sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
			>
				{!isEditingNote ? (
					<Typography
						fontStyle={note ? 'normal' : 'italic'}
						variant="body2"
						sx={{ color: (theme) => (note ? theme.palette.text.primary : theme.palette.grey[600]) }}
					>
						{note || 'No hay ninguna nota qué mostrar.'}
					</Typography>
				) : (
					<TextField
						fullWidth
						multiline
						rows={25}
						disabled={isLoading}
						value={editedNote}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setEditedNote(event.target.value);
						}}
					/>
				)}
				<Typography
					sx={{ width: '100%' }}
					variant="caption"
					textAlign="center"
				>
					Estas notas sólo las pueden ver profesores.
				</Typography>
			</DialogContent>
			{downloadContent && (
				<DialogActions sx={{ m: 2, mt: 0 }}>
					<Button
						variant="contained"
						color="primary"
						onClick={onDownload}
					>
						Descargar Contenido
					</Button>
				</DialogActions>
			)}
			<FuseMessage />
		</Dialog>
	);
}

export default SlideshowNotes;
