import { Button, DialogActions, DialogContent, IconButton, TextField, Typography, Box } from '@mui/material';
import SimpleDialog from 'app/shared-components/general/dialogs/SimpleDialog/SimpleDialog';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import definitionService from 'src/app/services/definitionService';

interface ReplaceContentDialogProps {
	addNewContent: boolean;
	open: boolean;
	onClose: () => void;
	onSave: (content: string) => void;
	onRemove: () => void;
	isLoading: boolean;
	showRemoveButton: boolean;
	iframeString: string;
}
export function ReplaceContentDialog({
	addNewContent,
	open,
	onClose,
	onSave,
	onRemove,
	isLoading,
	showRemoveButton,
	iframeString
}: ReplaceContentDialogProps) {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isRemoving, setIsRemoving] = useState<boolean>(false);
	const [texfieldIframe, setTexfieldIframe] = useState<string>(iframeString);
	const [error, setError] = useState<string>('');
	const bgColor = definitionService.getBackgroundColor()

	const handleSave = () => {
		if (
			texfieldIframe.includes('<iframe src="https://docs.google.com/presentation/') &&
			texfieldIframe.includes(
				'allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>'
			)
		) {
			setIsSaving(true);
			onSave(texfieldIframe);
		} else {
			setError('El formato es incorrecto. Por favor, revisa las instrucciones.');
		}
	};

	const handleRemove = () => {
		onRemove();
		setIsRemoving(true);
		setTexfieldIframe('');
	};

	useEffect(() => {
		if (!isLoading) {
			setIsSaving(false);
			setIsRemoving(false);
		}
	}, [isLoading]);

	return (
		<SimpleDialog
			fullWidth
			maxWidth="md"
			style={{ zIndex: 999999 }}
			open={open}
			onClose={onClose}
			bgColor={bgColor}
		>
			{/* <DialogTitle> */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					m: 3
				}}
			>
				<Typography variant="h5">
					{addNewContent ? 'Agrega' : 'Reemplaza el contenido por'} una presentación de Google Slides
				</Typography>
				<IconButton onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Box>
			{/* </DialogTitle> */}
			<DialogContent>
				<Typography sx={{ mb: 4 }}>
					{addNewContent ? 'Agrega' : 'Reemplaza el contenido por'} una presentación de Google Slides. ¡Es
					sumamente fácil!
					<br />
					<a
						href="https://ada.vermic.com/guia-google-slides.html"
						target="_blank"
						rel="noreferrer noopener"
					>
						Click aquí para ver el tutorial.
					</a>
				</Typography>
				<TextField
					fullWidth
					multiline
					variant="filled"
					rows={8}
					disabled={isLoading}
					label="Google Slides IFrame"
					value={texfieldIframe}
					error={!!error}
					helperText={error}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setError('');
						setTexfieldIframe(event.target.value);
					}}
					placeholder='<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRqvK6d8JWke2KTrZY3s7G7bMNMrf0OD7PltGqThrGSNRLSAVWgWxUxAu4yoJW552C9m1LMqMyflUt8/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>'
				/>
				<DialogActions sx={{ mt: 3 }}>
					{showRemoveButton && (
						<LoadingButton
							loading={isRemoving}
							variant="contained"
							color="error"
							onClick={handleRemove}
						>
							Quitar presentación
						</LoadingButton>
					)}
					<LoadingButton
						loading={isSaving}
						variant="contained"
						color="primary"
						onClick={handleSave}
					>
						Guardar
					</LoadingButton>
				</DialogActions>
				<Button />
			</DialogContent>
		</SimpleDialog>
	);
}
