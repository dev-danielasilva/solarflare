import { DialogActions, DialogActionsProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type SimpleDialogActionProps = {
  align?: string
};

type ExtendedDialogActionProps =  DialogActionsProps & {
  align?: string
};

const StyledSimpleDialogActions = styled(DialogActions)<SimpleDialogActionProps>(({ align }) => ({
  justifyContent: align ? align : 'center'
}));

export default function SimpleDialogActions(props:ExtendedDialogActionProps) {
  return <StyledSimpleDialogActions
        {...props}>
      </StyledSimpleDialogActions>
}
