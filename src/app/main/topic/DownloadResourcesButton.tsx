import {
	Button,
	ButtonGroup,
	ClickAwayListener,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	styled,
	Typography,
	IconButton
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useRef, useState, MouseEvent, ChangeEvent, useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getValueSafe } from 'src/app/utils';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FileDownload from 'app/shared-components/general/FileDownload/FileDownload';
import BaseUserType from 'app/store/user/BaseUserType';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/user/userSlice';
import axios, { AxiosResponse } from 'axios';
import { LoadingButton } from '@mui/lab';
import { showMessage } from 'app/store/fuse/messageSlice';

const StyledUploadButton = styled(Button)(() => ({
	backgroundColor: 'white',
	border: '1px solid #939393'
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

interface DownloadResourcesButtonProps {
	resources: string;
	courseTopicSession: { courseId: number; topicId: number; sessionId: number };
	isChanged: boolean;
}

interface FileAttachment {
	url: string;
	name: string;
	value: Blob;
}

function DownloadResourcesButton({ resources, courseTopicSession, isChanged }: DownloadResourcesButtonProps) {
	const { courseId, topicId, sessionId } = courseTopicSession;
	const dispatch = useDispatch();
	const user: BaseUserType = useSelector(selectUser);
	const isTeacher = user.role === 'teacher';
	const isPremium = user?.tenant?.license.type.toLowerCase() === 'premium';
	const [openPopper, setOpenPopper] = useState(false);
	const [openEditResources, setOpenEditResources] = useState(false);
	const [fileAttached, setFileAttached] = useState<FileAttachment | null>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [currentResources, setCurrentResources] = useState<string>(resources);
	const [saveChangesLoading, setSaveChangesLoading] = useState<boolean>(false);
	const [isResourceChanged, setIsResourceChanged] = useState<boolean>(isChanged);

	const handleMenuItemClick = (event: MouseEvent<HTMLLIElement>, onClick: () => void) => {
		// setSelectedIndex(index);
		onClick();
		setOpenPopper(false);
	};

	const handleToggle = () => {
		setOpenPopper((prevOpen) => !prevOpen);
	};

	const handleClose = (event: MouseEvent | TouchEvent) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}

		setOpenPopper(false);
	};

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (getValueSafe(() => e.target.files[0], undefined)) {
			setFileAttached({
				url: e.target.files[0].name,
				name: e.target.files[0].name,
				value: e.target.files[0]
			});
		}
	};

	const handleDownload = () => {
		fetch(currentResources)
			.then((response) => response.blob())
			.then((blob) => {
				const match = currentResources.match(/[^/]+$/);
				const filename = match ? match[0] : null;
				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = filename;
				link.click();
			})
			.catch(console.error);
	};

	const putReplaceContent = (payload, removeContent) =>
		new Promise((resolve, reject) => {
			axios
				.put(`v1/courses/${courseId}/topics/${topicId}/sessions/${sessionId}/`, payload)
				.then((response: AxiosResponse<any>) => {
					if (response.data) {
						setCurrentResources(response.data.resource);
						setSelectedIndex(0);

						if (!removeContent) {
							setOpenEditResources(false);
							setIsResourceChanged(true);
						} else {
							setIsResourceChanged(false);
						}
						dispatch(
							showMessage({
								message: 'Recursos cambiados con éxito.', // text or html
								autoHideDuration: 6000, // ms
								anchorOrigin: {
									vertical: 'top', // top bottom
									horizontal: 'center' // left center right
								},
								variant: 'success' // success error info warning null
							})
						);
					} else {
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
						reject(response.data);
					}
					setFileAttached(null);
					setSaveChangesLoading(false);
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
					setSaveChangesLoading(false);
				});
		});

	const options = [
		{ label: 'Descargar recursos', icon: <FileDownloadOutlinedIcon />, onClick: handleDownload },
		{ label: 'Reemplazar recursos', icon: <EditOutlinedIcon />, onClick: () => setOpenEditResources(true) }
	];

	useEffect(() => {
		if (saveChangesLoading && fileAttached) {
			const formData = new FormData();

			formData.append('resource', fileAttached.value);

			putReplaceContent(formData, false);
		}
		if (saveChangesLoading && !fileAttached) {
			const emptyFormData = new FormData();
			emptyFormData.append('resource', '');
			putReplaceContent(emptyFormData, true);
		}
	}, [saveChangesLoading, fileAttached]);

	return (
		<>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
				{!isTeacher || (isTeacher && !isPremium) ? (
					<Button
						sx={{
							padding: '16px !important',
							color: 'white',
							backgroundColor: '#6F99F5',
							'&:hover': {
								backgroundColor: '#5174C2'
							}
						}}
						onClick={handleDownload}
						endIcon={<FileDownloadOutlinedIcon />}
					>
						Descargar recursos
					</Button>
				) : (
					<ButtonGroup
						variant="contained"
						ref={anchorRef}
					>
						<Button
							sx={{
								color: 'black !important',
								backgroundColor: 'white !important',
								borderColor: 'white !important',
								'&:hover': {
									backgroundColor: (theme) => `${theme.palette.grey[200]} !important`
								}
							}}
							onClick={options[selectedIndex].onClick}
						>
							{options[selectedIndex].label}
						</Button>
						<Button
							size="small"
							aria-controls={openPopper ? 'split-button-menu' : undefined}
							aria-expanded={openPopper ? 'true' : undefined}
							aria-label="select merge strategy"
							aria-haspopup="menu"
							onClick={handleToggle}
							sx={{
								color: 'black !important',
								backgroundColor: 'white !important',
								'&:hover': {
									backgroundColor: (theme) => `${theme.palette.grey[200]} !important`
								}
							}}
						>
							<ArrowDropDownIcon />
						</Button>
					</ButtonGroup>
				)}
				<Popper
					sx={{ zIndex: 99999999999999 }}
					open={openPopper}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										id="split-button-menu"
										autoFocusItem
									>
										{options.map((option, index) => (
											<MenuItem
												key={option.label}
												selected={index === selectedIndex}
												onClick={(event) => handleMenuItemClick(event, option.onClick)}
											>
												{option.icon}&nbsp;{option.label}
											</MenuItem>
										))}
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</Box>
			<Dialog
				sx={{ zIndex: 99999 }}
				open={openEditResources}
				onClose={() => setOpenEditResources(false)}
			>
				<DialogTitle sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<Typography
						variant="h5"
						fontWeight="bold"
					>
						{isResourceChanged ? 'Los recursos han sido reemplazados.' : 'Reemplazar recursos'}
					</Typography>
					<Box>
						<IconButton onClick={() => setOpenEditResources(false)}>
							<CloseRoundedIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Typography>
						{isResourceChanged
							? 'Ya has cambiado los recursos anteriormente. Borra el recurso y podrás volver a subir otro recurso.'
							: 'Aquí puedes subir un archivo con recursos para reemplazar los actuales. Si en algún momento quieres regresar a mostrar los recursos incluidos en la lección, solo basta con eliminar los que subiste.'}
					</Typography>
					{!isResourceChanged && (
						<Box>
							{fileAttached ? (
								<FileDownload
									attachment={fileAttached}
									remove
									onRemove={() => setFileAttached(null)}
									label="Archivo adjunto"
								/>
							) : (
								<StyledUploadButton
									component="label"
									role={undefined}
									variant="contained"
									tabIndex={-1}
									startIcon={<FuseSvgIcon>heroicons-outline:arrow-sm-up</FuseSvgIcon>}
								>
									Subir archivo
									<VisuallyHiddenInput
										type="file"
										accept=".zip,.rar,.7zip,.doc,.docx,.xls,.xlsx,.pptx,.ppt,text/plain,.pdf,image/*,.html"
										onChange={(e) => onFileChange(e)}
									/>
								</StyledUploadButton>
							)}
						</Box>
					)}
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<LoadingButton
							loading={saveChangesLoading}
							color={isResourceChanged ? 'error' : 'primary'}
							variant="contained"
							onClick={() => setSaveChangesLoading(true)}
						>
							{isResourceChanged ? 'Borrar recursos' : 'Guardar cambios'}
						</LoadingButton>
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default DownloadResourcesButton;
