import { Alert, Button, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { ReduceLabel } from '@fuse/utils/ui-tools';
import { Controller, useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { Theme } from '@mui/system/createTheme';
import Box from '@mui/material/Box';
import _ from 'lodash';
// import { getName } from 'src/app/utils';
import jwtService from 'src/app/auth/services/jwtService';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import { InferType } from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getValueSafe } from 'src/app/utils';
import FileDownload from 'app/shared-components/general/FileDownload/FileDownload';
import definitionService from 'src/app/services/definitionService';

type SimpleDialogProps = {
	theme?: Theme;
	opacity?: string;
	bgColor?: string;
};

const MB = 1048576;

const StyledSimpleDialog = styled(Dialog)<SimpleDialogProps>(({ theme, opacity, bgColor }) => ({
	zIndex: 99999,
	'& .MuiPaper-root ': {
		width: '500px'
	},
	[theme.breakpoints.down('sm')]: {
		'& .MuiPaper-root ': {
			maxWidth: '95%'
		}
	},
	'& .MuiBackdrop-root': {
		// backgroundColor: `${theme.palette.secondary.main}70`,
		backgroundColor: `${bgColor}70`,
		backdropFilter: 'blur(10px)'
	},
	'& .MuiDialog-container .MuiDialog-paper': {
		overflow: 'visible',
		backgroundColor: `${theme?.palette?.ada?.base ? theme?.palette?.ada?.base : '#FFF'}`
	},
	'& .MuiDialog-container .MuiDialog-paper .MuiDialogContent-root .MuiDialogContentText-root': {
		textAlign: 'center'
	}
}));

const StyledLoginTextField = styled(TextField)<any>(({ theme }) => ({
	'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: `${theme.palette.primary.main} !important`
	},
	'& .MuiFormLabel-root.Mui-focused:not(.Mui-error)': {
		color: `${theme.palette.primary.main} !important`,
		fontSize: '1.2rem'
	},
	'& .MuiFormLabel-root': {
		fontSize: '1.2rem'
	}
}));

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1
});

const LoadingButtonWrapper = styled(Box)<any>(({ theme }) => ({
	display: 'block',
	textAlign: 'center',
	margin: 'auto'
}));

const StyledUploadButton = styled(Button)<any>(({ theme }) => ({
	maxWidth: '150px',
	backgroundColor: 'white',
	border: '1px solid #939393'
}));

const CurrentFileContainer = styled(Box)<any>(({ theme }) => ({
	backgroundColor: '#F9F9F9',
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
	padding: '1rem',
	borderRadius: '1rem',
	'& svg': {
		padding: '2px',
		cursor: 'pointer'
	}
}));

const schema = yup.object().shape({
	name: yup.string().min(1, 'Ingresa un nombre para el tema.'),
	description: yup.string().min(1, 'Ingresa una descripción para el tema.'),
	image: yup.mixed().required()
});

const defaultValues = {
	name: '',
	description: '',
	image: undefined
};

function AddTopicDialog({ open, handleClose, courseid, subjectid, addTopic }) {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [fileExists, setFileExists] = useState<boolean>(false);
	const [fileAttached, setFileAttached] = useState<any>(null);
	const [customError, setCustomError] = useState<any>({});
	const { control, formState, handleSubmit, setError, watch, setValue, getValues, register } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const bgColor = definitionService.getBackgroundColor()

	function onSubmit({ name, description, image }: InferType<typeof schema>) {
		const formData = new FormData();
		formData.append('image', image);
		formData.append('name', name);
		formData.append('description', description);
		formData.append('session_name', `${name} - Clase 1`);

		createTopic(formData);
	}

	function createTopic(topicDefinition) {
		setIsLoading(true);
		jwtService
			.createTopic(courseid, subjectid, topicDefinition)
			.then((topic: any) => {
				setIsLoading(false);
				addTopic(topic);
			})
			.catch((e) => {
				setIsLoading(false);
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
				console.error('Error creating topic: ', e);
			});
	}

	const onImageChange = (e, field) => {
		if (isFileValid(e.target.files[0])) {
			if (getValueSafe(() => e.target.files[0], undefined)) {
				setFileAttached({
					url: e.target.files[0].name,
					name: e.target.files[0].name
				});
			}
			field.onChange({
				target: { value: e.target.files[0], name: field.name }
			});
		} else {
			removeImage();
		}
	};

	const isFileValid = (file) => {
		if (file.format > 10 * MB) {
			triggerError('El archivo excede el tamaño límite. Comprímelo e intenta de nuevo.');
			return false;
		}
		return true;
	};

	const removeImage = () => {
		setFileAttached(null);
		setValue('image', undefined, { shouldDirty: true, shouldValidate: true });
		setFileExists(!!getValues('image'));
	};

	const triggerError = (message) => {
		setCustomError({
			message
		});
		setTimeout(() => {
			setCustomError({});
		}, 3000);
	};

	return (
		<StyledSimpleDialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="sm"
			className="subject-modal"
			bgColor={bgColor}
		>
			<DialogTitle>
				<Typography
					sx={{
						fontSize: '2rem'
					}}
				>
					<b>Crear un nuevo tema</b>
				</Typography>
			</DialogTitle>
			<DialogContent>
				{customError && customError.message && (
					<Box>
						<Alert
							sx={{ marginBottom: '1.5rem', width: 'unset !important' }}
							severity="error"
						>
							{customError.message}
						</Alert>
					</Box>
				)}

				<Box>
					<form
						name="addTopicForm"
						noValidate
						className="flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
						style={{
							position: 'relative',
							marginTop: '1.5rem'
						}}
					>
						<Controller
							name="name"
							control={control}
							{...register('name')}
							render={({ field }) => (
								<StyledLoginTextField
									{...field}
									className="mb-24"
									label={ReduceLabel('Nombre')}
									FormHelperTextProps={{
										sx: { marginLeft: '0', marginTop: '0.5rem' }
									}}
									autoFocus
									type="text"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<StyledLoginTextField
									{...field}
									className="mb-24"
									label={ReduceLabel('Descripción')}
									FormHelperTextProps={{
										sx: { marginLeft: '0', marginTop: '0.5rem' }
									}}
									type="text"
									error={!!errors.name}
									helperText={errors?.description?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						{!fileAttached ? (
							<Controller
								name="image"
								control={control}
								render={({ field }) => (
									<StyledUploadButton
										component="label"
										role={undefined}
										variant="contained"
										tabIndex={-1}
										startIcon={<FuseSvgIcon>heroicons-outline:arrow-sm-up</FuseSvgIcon>}
										onChange={(e) => onImageChange(e, field)}
									>
										Subir imagen
										<VisuallyHiddenInput
											{...field}
											type="file"
											accept=".jpge, .png, .jpg"
										/>
									</StyledUploadButton>
								)}
							/>
						) : (
							<FileDownload
								attachment={fileAttached}
								remove
								onRemove={removeImage}
								label="Subir imagen"
							/>
						)}

						<LoadingButtonWrapper>
							<LoadingButton
								loading={isLoading}
								variant="contained"
								color="secondary"
								className=" mt-16 w-1/2"
								aria-label="Sign in"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								type="submit"
								size="large"
								sx={{
									color: theme.palette.common.white
								}}
							>
								Crear
							</LoadingButton>
						</LoadingButtonWrapper>
					</form>
				</Box>
			</DialogContent>
		</StyledSimpleDialog>
	);
}

export default AddTopicDialog;
