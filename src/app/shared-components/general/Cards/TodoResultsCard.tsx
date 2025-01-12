import { Box, Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import _ from "@lodash";
import TodoResultsTable from "../Tables/TodoResultsTable";

const CardHeader = styled(Box)<any>(({ theme }) => ({
  display: "block",
  marginBottom: "1.5rem",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const CardTitle = styled(Typography)<any>(() => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  marginBottom: "1rem",
}));

function TodoResultsCard({ onPreview }) {
  return (
    <>
      <Card
        className="mt-0 p-24"
        sx={{ position: "relative", marginBottom: "4rem" }}
      >
        <CardContent
          sx={{
            p: "0 !important",
          }}
        >
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <Typography
              sx={{
                fontSize: "1.6rem",
                marginBottom: "2rem",
              }}
            >
              Aquí puedes ver el archivo que enviaron los alumnos y asignarles una calificación. Si el ícono está desabilitado, significa que el alumno aún no ha enviado ningún archivo.
            </Typography>
          </CardHeader>
          <Box>
            <TodoResultsTable onPreview={onPreview}/>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default TodoResultsCard;