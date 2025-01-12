import * as React from 'react'
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import SimpleDialog from 'app/shared-components/general/dialogs/SimpleDialog/SimpleDialog'
import SimpleDialogActions from 'app/shared-components/general/dialogs/SimpleDialog/SimpleDialogActions'
import definitionService from 'src/app/services/definitionService'

/**
 * ForgottenPasswordDialog is a React component used to render the forgot password dialog window
 */
function ForgottenPasswordDialog() {
  const [open, setOpen] = React.useState(false)
  const bgColor = definitionService.getBackgroundColor()
  
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Typography
        variant="body1"
        onClick={handleClickOpen}
        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
      >
        ¿Ya no recuerdas tu contraseña?
      </Typography>
      <SimpleDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        bgColor={bgColor}
      >
        <DialogTitle id="alert-dialog-title">
          {/* <img
						src="assets/images/characters/cat-forgot-password.svg"
						alt="Cat"
						style={{
							maxWidth: "120px",
							position: "absolute",
							left: "50%",
							width: "100%",
							top: "-60px",
							transform: "translateX(-50%)"
						}}
					/> */}
          {'¡No te preocupes!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tu profesor o profesora te puede ayudar, solo pídele que te de una
            nueva contraseña.
          </DialogContentText>
        </DialogContent>
        <SimpleDialogActions>
          <Button onClick={handleClose} autoFocus>
            Entendido
          </Button>
        </SimpleDialogActions>
      </SimpleDialog>
    </>
  )
}

export default ForgottenPasswordDialog
