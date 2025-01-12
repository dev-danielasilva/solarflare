import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "@lodash";

type StatusTagProps = {
  children?: string;
  color?: string;
  bgColor?: string;
};

const StatusTagStyled = styled(Box)<any>(({color, bgColor}) => ({
  backgroundColor: bgColor,
  color: color,
  borderRadius: '50px',
  padding: '0.5rem 0.75rem',
  fontSize: '13px',
  textAlign: 'center',
  marginBottom: '1rem'
}));

function StatusTag({ children, color, bgColor }: StatusTagProps) {
  return (
      <StatusTagStyled
        color={color}
        bgColor={bgColor}
      >
        {children}
      </StatusTagStyled>
  );
}

export default StatusTag;
