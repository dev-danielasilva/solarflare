import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { typography } from "@mui/system";

type FileDownloadProps = {
    attachment: any;
  remove?: boolean;
  download?: boolean;
  onRemove?: any;
  label?: string;
  isRaw?: boolean;
  isLoading?: boolean;
};

const FileName = styled(Typography)<any>(({ theme }) => ({
  marginRight: "1rem",
}));

const File = styled(Box)<any>(() => ({
  backgroundColor: "#F8F8F8",
  borderRadius: "30px",
  padding: "1rem 2rem",
  display: "flex",
  justifyContent: "space-between",
  margin: "1rem 0 1rem 0",
  "& a": {
    color: "#000 !important",
  },
  "& svg": {
    transform: "scale(0.8)",
  },
}));

const FieldLabel = styled(Typography)<any>(() => ({
  fontSize: "11px",
  color: "rgb(161, 161, 161)",
  marginLeft: "1.5rem",
  marginBottom: "-5px"
}));

function FileDownload({ attachment, download, remove, onRemove, label, isRaw, isLoading }: FileDownloadProps) {
  return (
    <Box className='filedownload'>
      {label && <FieldLabel>{label}</FieldLabel>}
      <File>
        <FileName>
          {isRaw ?  attachment.name : attachment?.url?.split("/")[attachment?.url?.split("/")?.length - 1]}</FileName> 
        <Box sx={{
          display: 'flex'
        }}>
          {download && (
            <a href={attachment?.url} download target="_blank" style={{backgroundColor: 'transparent', border: 'none'}}>
              <FuseSvgIcon>heroicons-outline:arrow-down-tray</FuseSvgIcon>
            </a>
          )}
          {remove && !isLoading && (
            <FuseSvgIcon sx={{cursor: 'pointer', marginLeft: '0.5rem'}} onClick={() => onRemove()}>
              heroicons-outline:x-mark
            </FuseSvgIcon>
          )}
          {remove && isLoading && (
            <Box
            sx={{
              paddingLeft: '10px',
              paddingTop: '5px'
            }}>
              <CircularProgress 
                sx={{
                  width: '20px !important',
                  height: '20px !important',
                  color: 'rgba(0,0,0,0.25) !important'
                }}/>
            </Box>
          )}
        </Box>
      </File>
    </Box>
  );
}

export default FileDownload;
