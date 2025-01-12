import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import _ from "@lodash";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const CardHeader = styled(Box)<any>(({ theme }) => ({
	display: 'flex',
	marginBottom: '2rem',
	[theme.breakpoints.down('sm')]: {
		display: 'block'
	}
}));

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
	fontSize: '2.5rem',
	fontWeight: 600,
	margin: role === 'student' ? 'auto 1.5rem auto 0' : 0,
	[theme.breakpoints.down('sm')]: {
		margin: role === 'student' ? '1rem 0' : 0
	}
}));

const LHDocViewer = styled(DocViewer)`
  border-radius: 10px;
`;

const PreviewImage = styled(Box)<any>(() => ({
	width: '100%'
}));

function TodoPreviewCard({docUri, userName}) {

  const segments = docUri?.split('.')
  const extension = segments[segments.length - 1];

  const imageExtensions = ['png', 'jpeg', 'jpg']

  return (
    <Card
    id="preview-card"
    className="mt-0 p-24"
    sx={{ position: "relative", marginBottom: "4rem" }}
  >
    <CardContent
      sx={{
        p: "0 !important",
      }}
    >
      <CardHeader>
        <CardTitle>Previsualización{
            userName ? `: ${userName}` : ''
          }</CardTitle>
      </CardHeader>
      <Box>
        {docUri && !imageExtensions.includes(extension) ?
          <LHDocViewer 
            documents={[
              {
                uri: docUri
              }
            ]} 
            language="es"
            pluginRenderers={DocViewerRenderers} 
            className="ada-doc-viewer"
            config={{
              pdfVerticalScrollByDefault: false,
            }}
            // theme={{
            //   primary: "#5296d8",
            //   secondary: "#ffffff",
            //   tertiary: "#5296d899",
            //   textPrimary: "#ffffff",
            //   textSecondary: "#5296d8",
            //   textTertiary: "#00000099",
            //   disableThemeScrollbar: false,
            // }}
          /> : docUri && imageExtensions.includes(extension) &&
          <PreviewImage
            component="img"
            src={docUri}
            alt={"Previsualización de la actividad"}
          />
          } 
      </Box>
    </CardContent>
  </Card>
  );
}

export default TodoPreviewCard;