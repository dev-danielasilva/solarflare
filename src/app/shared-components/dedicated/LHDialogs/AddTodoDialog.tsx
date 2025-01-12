import { Alert, Button, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography, TextField, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { ReduceLabel } from '@fuse/utils/ui-tools';
import { Controller, useForm } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import jwtService from 'src/app/auth/services/jwtService';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import { useAppDispatch } from 'app/store';
import { showMessage } from 'app/store/fuse/messageSlice';
import definitionService from 'src/app/services/definitionService';

const schema = yup.object().shape({
    name: yup.string().min(1, 'Ingresa un nombre para el tema.'),
    description: yup.string().min(1, 'Ingresa una descripción para el tema.'),
    type: yup.string().required('Seleccione un tipo')
});

const defaultValues = {
    name: '',
    description: '',
    type: ''
};

const StyledSimpleDialog = styled(Dialog)(({ theme, bgColor }) => ({
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

function AddTodoDialog({ open, handleClose, courseid, sessionid, addTodo }) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [customError, setCustomError] = useState({});
    const { control, formState, handleSubmit, reset } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema)
    });
    const { isValid, dirtyFields, errors } = formState;
    const bgColor = definitionService.getBackgroundColor();

    useEffect(() => {
        reset();
    }, [reset]);

    function onSubmit(data) {
        setIsLoading(true);
        jwtService.createTodo(courseid, sessionid, data)
            .then((todo) => {
                setIsLoading(false);
                addTodo(todo);
                handleClose();
            })
            .catch((e) => {
                setIsLoading(false);
                dispatch(
                    showMessage({
                        message: 'Ocurrió un error. Por favor intenta de nuevo.',
                        autoHideDuration: 6000,
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        variant: 'error'
                    })
                );
                console.error('Error creating topic: ', e);
            });
    }

    return (
        <StyledSimpleDialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            bgColor={bgColor}
            className="add-activity-modal"
        >
            <DialogTitle>
                <Typography sx={{ fontSize: '2rem' }}>
                    <b>Crear una nueva actividad o examen</b>
                </Typography>
                <Typography sx={{ fontSize: '1.5rem', marginTop: '1rem' }}>
                    Podrás crear y editar este elemento al seleccionarlo después de haberlo creado.
                </Typography>
            </DialogTitle>
            <DialogContent>
                {customError && customError.message && (
                    <Box>
                        <Alert sx={{ marginBottom: '1.5rem', width: 'unset !important' }} severity="error">
                            {customError.message}
                        </Alert>
                    </Box>
                )}
                <Box>
                    <form
                        name="addTodoForm"
                        noValidate
                        className="flex w-full flex-col justify-center"
                        onSubmit={handleSubmit(onSubmit)}
                        style={{ position: 'relative', marginTop: '1.5rem' }}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-24"
                                    label={ReduceLabel('Nombre')}
                                    FormHelperTextProps={{ sx: { marginLeft: '0', marginTop: '0.5rem' } }}
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
                                <TextField
                                    {...field}
                                    label={ReduceLabel('Descripción')}
                                    FormHelperTextProps={{ sx: { marginLeft: '0', marginTop: '0.5rem', marginBottom: '1rem' } }}
                                    type="text"
                                    error={!!errors.description}
                                    helperText={errors?.description?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <FormControl fullWidth
								sx={{marginTop: '2.5rem'}}
								>
                                    <InputLabel id="demo-simple-select-label">{ReduceLabel('Tipo')}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={value}
                                        onChange={onChange}
                                        label={ReduceLabel('Tipo')}
                                    >
                                        <MenuItem value="activity">Actividad</MenuItem>
                                        <MenuItem value="quiz">Examen</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <Box sx={{ textAlign: 'center', margin: 'auto' }}>
                            <LoadingButton
                                loading={isLoading}
                                variant="contained"
                                color="secondary"
                                className=" mt-16 w-1/2"
                                aria-label="Crear"
                                disabled={_.isEmpty(dirtyFields) || !isValid}
                                type="submit"
                                size="large"
                                sx={{ color: theme.palette.common.white }}
                            >
                                Crear
                            </LoadingButton>
                        </Box>
                    </form>
                </Box>
            </DialogContent>
        </StyledSimpleDialog>
    );
}

export default AddTodoDialog;
