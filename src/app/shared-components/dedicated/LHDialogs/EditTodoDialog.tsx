import { Alert, Box, Button, DialogContent, DialogTitle, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { ReduceLabel } from '@fuse/utils/ui-tools';
import { Controller, useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { Theme } from '@mui/system/createTheme';
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
import { getTimeToEOD, getValueSafe } from 'src/app/utils';
import FileDownload from 'app/shared-components/general/FileDownload/FileDownload';
import { useParams } from 'react-router';
import definitionService from 'src/app/services/definitionService';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { selectUser } from 'app/store/user/userSlice';
import { useSelector } from 'react-redux';

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
	'& .Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
		borderColor: `${theme.palette.primary.main} !important`
	},
	'& .MuiFormLabel-root.Mui-focused:not(.Mui-error)': {
		color: `${theme.palette.primary.main} !important`,
		fontSize: '1.2rem'
	},
	'& .MuiFormLabel-root': {
		fontSize: '1.2rem'
	},
	'& .MuiInputBase-root': {
		lineHeight: '2rem'
	}
}));

const StyledWeightField = styled(TextField)<any>(({ theme }) => ({
	// maxWidth: "50%",
	'& .Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
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
	maxWidth: '170px',
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
	image: yup.mixed().notRequired(),
	weight: yup.number().typeError('El peso debe ser un número.').required('Este campo es requerido.'),
	due_date: yup.date(),
	start_date: yup.date()
});

function EditTodoDialog({ open, handleClose, todo, sendUpdatedTodo }) {
	const { courseid } = useParams();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const bgColor = definitionService.getBackgroundColor()
	const user = useSelector(selectUser);
	const isPremium = user?.tenant?.license.type.toLowerCase() === 'premium';
	const [datesActive, setDatesActive] = useState<boolean>(() => {
		return (_.isNumber(todo.start_date) || _.isNumber(todo.due_date)) && isPremium
	})
	const label = { inputProps: { 'aria-label': 'Establecer fechas' } };
	// const [fileAttached, setFileAttached] = useState<any>(
	//   getValueSafe(() => todo.files[0], undefined)
	// );
	const [fileAttached, setFileAttached] = useState<any>(
		todo.file.url ? getValueSafe(() => todo.file, undefined) : undefined
	);
	const [removeFileFlag, setRemoveFileFlag] = useState<boolean>(false);
	const [dueDate, setDueDate] = useState<boolean>(false);
	const [customError, setCustomError] = useState<any>({});
	const defaultValues = {
		name: todo.name ? todo.name : '',
		description: todo.description ? todo.description : '',
		// date: null,
		weight: _.isNumber(todo.weight) ? todo.weight : 5,
		image: undefined,
		due_date: todo.due_date ? dayjs(todo.due_date * 1000) : dayjs(),
		start_date: todo.start_date ? dayjs(todo.start_date * 1000) : dayjs()
	};
	const { control, formState, handleSubmit, setError, watch, setValue, getValues, register } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});
	const { isValid, dirtyFields, errors, touchedFields } = formState;

	function onSubmit({
		name,
		description,
		image,
		due_date,
		start_date,
		weight
	}: InferType<typeof schema>) {
		const formData = new FormData();
		if(image){
			formData.append('file', image);
		}
		formData.append('name', name);
		formData.append('description', description);
		formData.append('weight', weight);


		if(isPremium){
			if(!datesActive){
				formData.append('start_date', null);
				formData.append('end_date', null);
			}else{

				if(!areDatesValid(start_date, due_date)){
					return;
				}

				if(start_date){
					const startDate = getTimeToEOD(start_date);
					formData.append('start_date', startDate);
				}
				if(start_date){
					const dueDate = getTimeToEOD(due_date);
					formData.append('due_date', dueDate);
				}
			}
		}


		if (removeFileFlag) {
			formData.append('remove_file', 'yes');
		}

		updateTodo(formData);
	}

	function updateTodo(todoUpdated) {
		setIsLoading(true);
		jwtService
			.updateTodo(courseid, todo.id, todoUpdated)
			.then((todo: any) => {
				setIsLoading(false);
				sendUpdatedTodo(todo);
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

	const areDatesValid = (start_date, due_date) => {
		if (start_date > due_date) {
			triggerError('La fecha límite de entrega no debe ser menor a la fecha de inicio');
			return false;
		}
		return true;
	};

	const isFileValid = (file) => {
		if (file.size > 10 * MB) {
			triggerError('El archivo excede el tamaño límite. Comprímelo e intenta de nuevo.');
			return false;
		}
		return true;
	};

	const triggerError = (message) => {
		setCustomError({
			message
		});
	};

	const onImageChange = (e, field) => {
		if (isFileValid(e.target.files[0])) {
			if (getValueSafe(() => e.target.files[0], undefined)) {
				setFileAttached({
					url: e.target.files[0].name,
					name: e.target.files[0].name
				});
			}
			field.onChange({ target: { value: e.target.files[0], name: field.name } });
		} else {
			removeFile();
		}
	};

	const removeFile = () => {
		setFileAttached(undefined);
		setValue('image', undefined, { shouldDirty: true, shouldValidate: true });
		setRemoveFileFlag(true);
	};

	const handleDatesSwitch = () => {
		setDatesActive((prevDatesActive) => !prevDatesActive)
	}

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
					<b>Editar actividad</b>
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
						{/* Name */}
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

						{/* Description */}
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
									autoFocus
									type="text"
									error={!!errors.description}
									helperText={errors?.description?.message}
									variant="outlined"
									required
									fullWidth
									multiline
								/>
							)}
						/>

						{/* Weight */}
						<Controller
							name="weight"
							control={control}
							render={({ field }) => (
								<StyledWeightField
									{...field}
									className="mb-24"
									label={ReduceLabel('Peso')}
									FormHelperTextProps={{
										sx: { marginLeft: '0', marginTop: '0.5rem' }
									}}
									type="number"
									error={!!errors.weight}
									helperText={errors?.weight?.message}
									variant="outlined"
									required
									fullWidth
									multiline
								/>
							)}
						/>

						{/* File */}
						{fileAttached ? (
							<Box sx={{marginTop: '-0.5rem'}}>
								<FileDownload
									attachment={fileAttached}
									remove
									onRemove={removeFile}
									label="Archivo adjunto"
								/>
							</Box>
						) : (
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
										Añadir archivo
										<VisuallyHiddenInput
											{...field}
											type="file"
											accept=".jpge, .png, .jpg, .docx, .doc, .xlsx, .pdf, .ppt, .pptx"
										/>
									</StyledUploadButton>
								)}
							/>
						)}

						<FormGroup sx={{marginTop: '1rem'}}>
							<FormControlLabel control={<Switch defaultChecked={datesActive} onChange={handleDatesSwitch} disabled={!isPremium}/>} label="Establecer fechas" />
						</FormGroup>


						{datesActive &&
							<Box
								sx={{
									marginTop: '1.8rem',
									display: "block",
									marginBottom: "2rem",
									gap: "20px",
									[theme.breakpoints.up('sm')]: {
										display: 'flex',
										justifyContent: "space-between",
									}
								}}
							>

								<Box
									sx={{
										width: "100%",
										marginRight: "0rem",
										"& .MuiFormControl-root": { width: "100%" },
										[theme.breakpoints.down('sm')]: {
											marginBottom: '2rem'
										}
									}}
									>
									<Controller
										control={control}
										name="start_date"
										rules={{ required: true }}
										render={({ field }) => {
										return (
											<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												value={field.value}
												inputRef={field.ref}
												onChange={(date) => {
												field.onChange(date);
												}}
												label={"Fecha de inicio"}
											/>
											</LocalizationProvider>
										);
										}}
									/>
								</Box>

								<Box
									sx={{
										width: "100%",
										marginRight: "0rem",
										"& .MuiFormControl-root": { width: "100%" },
									}}
									>
									<Controller
										control={control}
										name="due_date"
										rules={{ required: true }}
										render={({ field }) => {
										return (
											<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												value={field.value}
												inputRef={field.ref}
												onChange={(date) => {
												field.onChange(date);
												}}
												label={"Fecha límite"}
											/>
											</LocalizationProvider>
										);
										}}
									/>
								</Box>
							</Box>
						}


						<LoadingButtonWrapper>
							<LoadingButton
								loading={isLoading}
								variant="contained"
								color="secondary"
								className=" mt-16 w-1/2"
								aria-label="Sign in"
								disabled={(_.isEmpty(dirtyFields) && _.isEmpty(touchedFields)) || !isValid}
								type="submit"
								size="large"
								sx={{
									color: theme.palette.common.white,
									padding: '0.8rem 5rem'
								}}
							>
								Actualizar
							</LoadingButton>
						</LoadingButtonWrapper>
					</form>
				</Box>
			</DialogContent>
		</StyledSimpleDialog>
	);
}

export default EditTodoDialog;
