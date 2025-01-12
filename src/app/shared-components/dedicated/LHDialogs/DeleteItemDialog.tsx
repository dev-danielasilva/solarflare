import { Button, DialogContent, DialogTitle, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import { Theme } from '@mui/system/createTheme'
import Box from '@mui/material/Box'
import { BoxProps } from '@mui/system'
import _ from 'lodash'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import definitionService from 'src/app/services/definitionService'

type SimpleDialogProps = {
  theme?: Theme
  opacity?: string
  bgColor?: string;
}

const StyledSimpleDialog = styled(Dialog)<SimpleDialogProps>(
  ({ theme, opacity, bgColor }) => ({
    zIndex: 99999,
    [theme.breakpoints.down('sm')]: {
      '& .MuiPaper-root ': {
        maxWidth: '95%',
      },
    },
    '& .MuiBackdrop-root': {
      // backgroundColor: `${theme.palette.secondary.main}70`,
      backgroundColor: `${bgColor}70`,
      backdropFilter: 'blur(10px)',
    },
    '& .MuiDialog-container .MuiDialog-paper': {
      overflow: 'visible',
      backgroundColor: `${
        theme?.palette?.ada?.base ? theme?.palette?.ada?.base : '#FFF'
      }`,
    },
    '& .MuiDialog-container .MuiDialog-paper .MuiDialogContent-root .MuiDialogContentText-root':
      {
        textAlign: 'center',
      },
  })
)


function DeleteItemDialog({ open, handleClose, message, handleAccept }) {
  const _message = message || '¿Estás seguro de que quieres eliminar este elemento?';
  const [isLoading, setIsLoading] = useState(false)
  const bgColor = definitionService.getBackgroundColor()
  
  const handleDelete = () => {
    setIsLoading(true)
    handleAccept();
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
          <Typography sx={{ fontSize: '20px' }}>
            <b>{_message}</b>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{
            marginBottom: '2rem'
          }}>
            Esta acción no se puede revertir.
          </Typography>
          <Box sx={{
            display: 'inline-block',
            float: 'right'
          }}>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            aria-label="Guardar cambios"
            onClick={handleDelete}
            size="large"
            sx={{
              backgroundColor: '#DC2C2C',
              color: 'white',
              maxWidth: '180px',
              marginRight: '1rem',
              '&:hover':{
                backgroundColor: '#B42D2D',
              }
            }}
          >
            Sí, eliminar
          </LoadingButton>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cancelar
          </Button>
          </Box>
        </DialogContent>
    </StyledSimpleDialog>
  )
}

export default DeleteItemDialog
