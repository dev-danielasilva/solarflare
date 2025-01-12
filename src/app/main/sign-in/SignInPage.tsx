import { ReduceLabel } from '@fuse/utils/ui-tools';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { InferType } from 'yup';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { UserType } from 'app/store/user';
import { Avatar, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BoxProps } from '@mui/system';
import { Theme } from '@mui/system/createTheme';
import Alert from '@mui/material/Alert';
import ForgottenPasswordDialog from 'app/shared-components/dedicated/LHDialogs/ForgottenPasswordDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AxiosError } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import LoadingButton from '@mui/lab/LoadingButton';
import ImagePasswordPad from './ImagePasswordPad';
import jwtService from '../../auth/services/jwtService';
import SignInPageBackground from './SignInPageBackground';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	username: yup.string().min(1, 'Ingresa tu nombre de usuario.'),
	password: yup.string().required('Ingresa tu contraseña.').min(4, 'Tu contraseña debe ser de mínimo 5 caracteres.'),
	remember: yup.boolean()
});

const defaultValues = {
	username: '',
	password: '',
	remember: true
};

interface ExtendedBoxProps extends BoxProps {
	alt?: string;
	src?: string;
}

const ExtendedBox = styled(Box)<ExtendedBoxProps>(({ theme }) => ({
	// width: '20rem',
	width: '15rem',
	marginBottom: '2em',
	[theme.breakpoints.up('xl')]: {
		marginBottom: '3em'
	}
}));

const PlatformLogo = styled(Box)<ExtendedBoxProps>(({ theme }) => ({
	width: '100px',
	margin: 'auto'
}));

const PlatformLogoWrapper = styled(Box)<ExtendedBoxProps>(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	margin: '0 auto',
	backgroundColor: '#FFF',
	zIndex: 1,
	top: 0,
	padding: '10px 0 15px 0',
	width: '100vw'
}));

type LoginTextFieldProps = {
	theme?: Theme;
};

type LoginCustomErrorType = {
	show?: boolean;
	message?: string;
};

const StyledLoginTextField = styled(TextField)<LoginTextFieldProps>(({ theme }) => ({
	'& .Mui-focused .MuiOutlinedInput-notchedOutline': {
		borderColor: `${theme.palette.primary.main} !important`
	},
	'& .MuiFormLabel-root.Mui-focused:not(.Mui-error)': {
		color: `${theme.palette.primary.main} !important`
	}
}));

/**
 * The sign in page.
 * In Learning Hub, we are using this as the Login page.
 */
function SignInPage() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const { control, formState, handleSubmit, setError, watch, setValue, getValues } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});
	const [imagePasswordOn, setImagePasswordOn] = useState<boolean>(false);
	const [userType, setUserType] = useState<'elementary' | 'middle' | 'teacher' | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [customError, setCustomError] = useState<LoginCustomErrorType>({
		show: false
	});
	const currentPassword = getValues('password');
	const { isValid, dirtyFields, errors } = formState;

	// useEffect(() => {
	// 	if(isLocal){
	// 		setValue('username', 'C00013', {
	// 			shouldDirty: true,
	// 			shouldValidate: true
	// 		});
	// 		setValue('password', '2495', {
	// 			shouldDirty: true,
	// 			shouldValidate: true
	// 		});
	// 	}
	// }, [setValue]);

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			setCustomError({
				show: false
			});
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	async function onSubmit({ username, password }: InferType<typeof schema>) {
		const trimmedPass = password.trim();
		setIsLoading(true);

		const userProfile: any = await jwtService.clientLogin(username, trimmedPass);
		let userData = {
			username,
			password: trimmedPass
		};

		if (userProfile?.data?.success) {
			userData = {
				...userData,
				...userProfile.data
			};
		}
		login(userData);
	}

	const login = (userData) => {
		jwtService
			.logInWithUserProfile(userData)
			.then((user: UserType) => {
				// eslint-disable-next-line no-console
				console.info(user);
				setIsLoading(false);

				// No need to do anything, user data will be set at app/auth/AuthContext
			})
			.catch((error: AxiosError) => {
				const message: string = error?.message
					? error?.message
					: '¡Vaya! Parece que ese usuario y contraseña no coinciden. Prueba de nuevo.';

				setCustomError({
					show: true,
					message
				});
				setIsLoading(false);
				// Prior way to show errors, keeping for now in case we have to revert to it.
				// _errors.forEach((error) => {
				// 	setError(error.type, {
				// 		type: 'manual',
				// 		message: error.message
				// 	});
				// });
			});
	};

	/**
	 * Will toggle the input password mode to show/hide the images.
	 *
	 * @return void
	 */
	const onTogglePassMode = (): void => {
		setImagePasswordOn((prevImagePasswordOn) => !prevImagePasswordOn);
		setValue('password', '', { shouldDirty: false, shouldValidate: false });
	};

	/**
	 * Will clear the password field.
	 *
	 * @return void
	 */
	const onClearPassword = (): void => {
		setValue('password', '', { shouldDirty: false, shouldValidate: true });
	};

	/**
	 * Will take the value given and append it to the current password.
	 *
	 * @param string | the key of the image
	 * @return void
	 */
	const onImageClick = (imageid: string): void => {
		const newPass = getValues('password') + imageid;
		setValue('password', newPass, { shouldDirty: true, shouldValidate: true });
	};

	return (
		<div
			id="login-wrapper"
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100vw',
				height: '100vh',
				marginTop: '30px'
			}}
			// className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-32"
		>
			<PlatformLogoWrapper>
				<PlatformLogo
					component="img"
					src="assets/images/logo/logo-ada.svg"
					alt="Ada Logo"
				/>
			</PlatformLogoWrapper>
			{(userType === 'teacher' || !userType) && <SignInPageBackground />}
			{userType ? (
				// <Paper className="relative flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm: md:shadow-2xl md:max-w-4xl">
				<Paper
					className={
						['elementary', 'middle'].includes(userType)
							? 'relative flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm: md:shadow-2xl md:w-full md:max-w-4xl'
							: 'relative flex min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm: md:shadow-2xl md:max-w-4xl'
					}
				>
					<Box
						// className="sm:p-48 md:p-24"
						className=" rtl:border-l-1 sm:w-auto sm:p-48 md:p-24"
						sx={{ width: { xs: '100%', lg: '45%' } }}
					>
						<div
							className="mx-auto w-full min-w-560 sm:mx-0 sm:w-320 "
							style={{
								padding: isMobile ? '35px' : '0px',
								paddingTop: isMobile ? '120px' : '0px'
							}}
						>
							<Button
								color="primary"
								sx={{ mb: 2 }}
								onClick={() => {
									setUserType(null);
								}}
								startIcon={<ArrowBackIcon />}
							>
								Regresar
							</Button>
							<ExtendedBox
								component="img"
								alt="Client Logo"
								src="assets/images/logo/logo-client.svg"
							/>

							<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
								Iniciar sesión
							</Typography>

							{customError && customError.show && (
								<Alert
									sx={{ marginTop: '2rem' }}
									severity="error"
								>
									{customError.message}
								</Alert>
							)}

							<form
								name="loginForm"
								noValidate
								className="mt-32 flex w-full flex-col justify-center"
								onSubmit={handleSubmit(onSubmit)}
								style={{
									position: 'relative'
								}}
							>
								<Controller
									name="username"
									control={control}
									render={({ field }) => (
										<StyledLoginTextField
											{...field}
											className="mb-24"
											label={ReduceLabel('Nombre de usuario')}
											FormHelperTextProps={{
												sx: { marginLeft: '0', marginTop: '0.5rem' }
											}}
											autoFocus
											type="text"
											error={!!errors.username}
											helperText={errors?.username?.message}
											variant="standard"
											required
											fullWidth
										/>
									)}
								/>

								{imagePasswordOn ? (
									<ImagePasswordPad
										currentPassword={currentPassword}
										onClearPassword={onClearPassword}
										onImageClick={onImageClick}
										onTogglePassMode={onTogglePassMode}
									/>
								) : (
									<>
										<Controller
											name="password"
											control={control}
											render={({ field }) => (
												<StyledLoginTextField
													{...field}
													className="mb-24"
													type="password"
													label={ReduceLabel('Contraseña')}
													error={!!errors.password}
													helperText={errors?.password?.message}
													variant="standard"
													required
													fullWidth
												/>
											)}
										/>
										{userType === 'elementary' && (
											<Typography
												variant="caption"
												sx={{
													color: theme.palette.secondary.main,
													textDecoration: 'underline',
													cursor: 'pointer',
													position: 'absolute',
													top: '35%',
													right: 0,
													zIndex: 9999
												}}
												onClick={onTogglePassMode}
											>
												Usar imágenes
											</Typography>
										)}
									</>
								)}

								<Box sx={{ margin: '1rem 0 0.5rem 0' }}>
									<ForgottenPasswordDialog />
								</Box>

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
									Entrar
								</LoadingButton>
							</form>
						</div>
					</Box>

					{['elementary', 'middle'].includes(userType) && (
						<>
							<Box
								className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
								sx={
									userType === 'elementary'
										? {
												backgroundColor: '#07CC97'
										  }
										: {
												backgroundSize: 'cover',
												backgroundOrigin: 'border-box',
												backgroundPosition: 'center',
												backgroundImage: 'url(assets/images/characters/ai.jpg)'
										  }
								}
							/>
							{userType === 'elementary' && (
								<img
									className="absolute hidden md:flex"
									style={{ width: '150%', top: '-50px', left: '180px' }}
									src="assets/images/characters/balam.svg"
									alt="Balam Learner"
								/>
							)}
						</>
					)}
				</Paper>
			) : (
				<Paper
					sx={{ width: '700px !important' }}
					className="relative flex flex-col min-h-full w-full overflow-hidden rounded-0 sm:min-h-auto sm:w-auto sm:rounded-2xl sm: md:shadow-2xl md:max-w-4xl"
				>
					{/* Title */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 2,
							mt: { xs: 20, sm: 5 },
							mb: { md: 5, lg: 10 }
						}}
					>
						<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
							¡Bienvenid@!
						</Typography>
						<Typography className="text-3xl font-extrabold leading-tight tracking-tight">
							¿De qué nivel eres?
						</Typography>
					</Box>
					{/* Buttons */}
					<Grid
						container
						mb={5}
					>
						<Grid
							item
							xs={12}
							md={6}
							sx={{ display: 'flex', justifyContent: 'center' }}
						>
							<Paper
								elevation={0}
								sx={{
									cursor: 'pointer',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									p: 2,
									'&:hover': { backgroundColor: (theme) => theme.palette.grey[300] }
								}}
								onClick={() => {
									setUserType('elementary');
									setImagePasswordOn(false);
									setValue('password', '', { shouldDirty: false, shouldValidate: false });
								}}
							>
								<Avatar
									sx={{ width: 100, height: 100 }}
									src="https://ada.assets.vermicstudios.com/media/jiraffe_4l6qOjh.png"
								/>
								<Typography className="text-xl font-extrabold leading-tight tracking-tight">
									Primaria
								</Typography>
							</Paper>
						</Grid>
						<Grid
							item
							xs={12}
							md={6}
							sx={{ display: 'flex', justifyContent: 'center' }}
						>
							<Paper
								elevation={0}
								sx={{
									cursor: 'pointer',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									p: 2,
									'&:hover': { backgroundColor: (theme) => theme.palette.grey[300] }
								}}
								onClick={() => {
									setUserType('middle');
									setImagePasswordOn(false);
									setValue('password', '', { shouldDirty: false, shouldValidate: false });
								}}
							>
								<Avatar
									sx={{ width: 100, height: 100 }}
									src="https://ada.assets.vermicstudios.com/media/robots-04.png"
								/>
								<Typography className="text-xl font-extrabold leading-tight tracking-tight">
									Secundaria
								</Typography>
							</Paper>
						</Grid>

						<Grid
							item
							xs={12}
							lg={12}
							sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 5 }}
						>
							<Button
								className="text-xl font-extrabold leading-tight tracking-tight"
								onClick={() => {
									setUserType('teacher');
									setImagePasswordOn(false);
									setValue('password', '', { shouldDirty: false, shouldValidate: false });
								}}
							>
								Soy Docente
							</Button>
						</Grid>
					</Grid>
				</Paper>
			)}
		</div>
	);
}

export default SignInPage;
