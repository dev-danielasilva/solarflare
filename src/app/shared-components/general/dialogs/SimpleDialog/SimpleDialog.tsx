import Dialog, { DialogProps } from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import { Theme } from '@mui/system/createTheme'

type SimpleDialogProps = {
  theme?: Theme
  opacity?: string
  bgColor?: string;
}

const StyledSimpleDialog = styled(Dialog)<SimpleDialogProps>(
  ({ theme, opacity, bgColor }) => ({
    '& .MuiBackdrop-root': {
      // backgroundColor: `${theme.palette.secondary.main}70`,
      backgroundColor: `${bgColor}70`,
      backdropFilter: 'blur(10px)',
    },
    '& .MuiDialogTitle-root': {
      marginTop: '0px',
      textAlign: 'center',
    },
    '& .MuiDialog-container .MuiDialog-paper': {
      overflow: 'visible',
    },
    '& .MuiDialog-container .MuiDialog-paper .MuiDialogContent-root .MuiDialogContentText-root':
      {
        textAlign: 'center',
      },
  })
)

export default function SimpleDialog(props?: DialogProps) {
  return <StyledSimpleDialog {...props} />
}
