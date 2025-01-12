import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import { Avatar, Box, Button, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import SimpleDialog from 'app/shared-components/general/dialogs/SimpleDialog/SimpleDialog';
import { selectUser, setUser } from 'app/store/user/userSlice';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getName, debug } from 'src/app/utils';
import UserType from 'app/store/user/UserType';
import { useAppDispatch } from 'app/store';
import BaseUserType from 'app/store/user/BaseUserType';
import AvatarType from 'src/app/main/types/AvatarType';
import { showMessage } from 'app/store/fuse/messageSlice';
import definitionService from 'src/app/services/definitionService';

interface ProgressStartsAndMedals {
	current: number;
	total: number;
}
interface ProgressType {
	stars: ProgressStartsAndMedals;
	medals: ProgressStartsAndMedals;
	average: number;
	max_grade: number;
}

interface ProfileModalProps {
	open: boolean;
	onClose: () => void;
}

const AvatarContainer = styled(Box)<any>(({ selectedAvatarId, currentAvatarId }) => ({
	display: 'table',
	cursor: 'pointer',
	opacity: selectedAvatarId === currentAvatarId ? 1 : 0.5,
	'&:hover': {
		opacity: 1
	}
}));

const CurrentAvatar = styled(Avatar)<any>(({}) => ({
	width: 120,
	height: 120,
	background: '#43B2AE',
	fontSize: '30px'
}));

export function ProfileModal({ open, onClose }: ProfileModalProps) {
	const user: BaseUserType = useSelector(selectUser);
	const dispatch = useAppDispatch();

	const [avatars, setAvatars] = useState<AvatarType[]>([] as AvatarType[]);
	const [progress, setProgress] = useState<ProgressType | null>(null);
	const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
	const [selectedAvatarId, setSelectedAvatarId] = useState<number>(user?.avatar?.id);
	const [isLoadingAvatars, setIsLoadingAvatars] = useState<boolean>(true);
	const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
	const bgColor = definitionService.getBackgroundColor()

	const getAvatars = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/avatars`)
				.then((response: AxiosResponse<AvatarType[]>) => {
					// debug('GET v1/avatars ', response);
					if (response?.data?.length) {
						setAvatars(response?.data);
						resolve(response?.data);
					} else {
						setAvatars(null);
					}
					setIsLoadingAvatars(false);
				})
				.catch((e) => {
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
					setIsLoadingAvatars(false);
					setAvatars([] as AvatarType[]);
				});
		});
	const getProgress = () =>
		new Promise((resolve, reject) => {
			axios
				.get(`v1/student/progress`)
				.then((response: AxiosResponse<ProgressType>) => {
					debug('GET v1/student/progress ', response);
					if (response.data) {
						setProgress(response.data);
						resolve(response.data);
					} else {
						setProgress(null);
						reject(response.data);
					}
					setIsLoadingProgress(false);
				})
				.catch((e) => {
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
					setIsLoadingProgress(false);
					setProgress(null);
				});
		});

	const putUpdateProfile = () =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/user/${user.id}/update/`, { avatar: selectedAvatarId })
				.then((response: AxiosResponse<UserType>) => {
					if (response.data) {
						const newAvatar = avatars.find((av) => av.id === selectedAvatarId);
						const newUser: BaseUserType = { ...user, avatar: newAvatar };
						dispatch(setUser(newUser));
						onClose();
						resolve(response.data);
					} else {
						reject(response.data);
					}
					setIsLoadingUpdate(false);
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
					setIsLoadingUpdate(false);
				});
		});

	useEffect(() => {
		if (isLoadingAvatars && !avatars.length) {
			getAvatars().then((r) => {
				// console.log('getAvatars response ', r)
			});
		}
		if (!progress && !isLoadingProgress) {
			getProgress();
		}
	}, [isLoadingAvatars, avatars, progress, isLoadingProgress]);

	useEffect(() => {
		if (isLoadingUpdate) {
			putUpdateProfile();
		}
	}, [isLoadingUpdate]);

	return (
		<SimpleDialog
			open={open}
			onClose={() => {
				onClose();
				setSelectedAvatarId(user?.avatar?.id);
			}}
			style={{ zIndex: 999999 }}
			bgColor={bgColor}
		>
			<Stack
				p={2}
				spacing={2}
			>
				<Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
					<Box>
						<CurrentAvatar
							src={
								selectedAvatarId === user?.avatar?.id
									? `${user?.avatar?.image}`
									: avatars?.find((av) => av.id === selectedAvatarId)?.image
							}
							alt={getName(user)}
						/>
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
						<Box>
							<Typography
								variant="h5"
								fontWeight="bold"
							>
								{getName(user)}
							</Typography>
							<Typography>Escuela: {user?.tenant?.name}</Typography>
						</Box>
						<Box>
							<IconButton
								onClick={() => {
									onClose();
									setSelectedAvatarId(user?.avatar?.id);
								}}
							>
								<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
							</IconButton>
						</Box>
					</Box>
				</Box>
				<Divider sx={{ opacity: 0.5 }} />
				<Typography
					variant="caption"
					sx={{ color: (theme) => theme.palette.grey[500] }}
				>
					¡Selecciona un nuevo avatar!
				</Typography>
				<Box>
					<Grid
						container
						spacing={2}
					>
						{!isLoadingAvatars && !!avatars?.length && (
							<>
								{avatars?.map((av, ix) => (
									<Grid
										key={ix}
										item
										xs={2}
										sx={{
											m: 1
										}}
									>
										<AvatarContainer
											id="avatar-container"
											selectedAvatarId={selectedAvatarId}
											currentAvatarId={av?.id}
										>
											<Avatar
												onClick={() => setSelectedAvatarId(av?.id)}
												alt={getName(user)} // TODO: Name of the child
												src={av?.image}
												sx={{
													width: 80,
													height: 80
												}}
											/>
										</AvatarContainer>
									</Grid>
								))}
							</>
						)}
					</Grid>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						variant="contained"
						color="primary"
						disabled={selectedAvatarId === user?.avatar?.id}
						onClick={() => setIsLoadingUpdate(true)}
					>
						Guardar Cambios
					</Button>
				</Box>
			</Stack>
		</SimpleDialog>
	);
}
