import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import _ from "@lodash";
import definitionService from "src/app/services/definitionService";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { formatDate, getValueSafe } from "src/app/utils";
import EditExamDialog from "./EditExamDialog";
import { useState } from "react";
import FileDownload from "app/shared-components/general/FileDownload/FileDownload";
import { Link } from "react-router-dom";
import ExamResultsTable from "./ExamResultsTable";

const CardHeader = styled(Box)<any>(({ theme }) => ({
  display: "block",
  marginBottom: "1.5rem",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  marginBottom: "1rem",
}));

const GradeBlock = styled(Box)<any>(({ role, theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 600,
  margin: role === "student" ? "auto 1.5rem" : 0,
  textAlign: "right",
  "& .current-grade-title": {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },
  "& .current-grade": {
    fontSize: "1.5rem",
    fontWeight: 700,
    backgroundColor: "#D0E4F5",
    padding: "0.5rem 1rem",
    borderRadius: "100px",
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    margin: role === "student" ? "1rem 0" : 0,
  },
}));

function ExamResultsCard({ todo, updateStudentTodo }) {
  //   const user = useSelector(selectUser);
  const user = { role: "student" };
  const theme = useTheme();
  const headerImage = definitionService.getSkinFromDefinition(
    "card_characters.item_graded",
    {}
  );

  const clickOnPreviewFor = (studentTodo) => {
    updateStudentTodo(studentTodo)
  }

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
            <CardTitle role={user?.role}>Resultados</CardTitle>
            <Typography
              sx={{
                fontSize: "1.6rem",
                marginBottom: "2rem",
              }}
            >
              Selecciona un registro para mostrar detalles del examen.
            </Typography>
          </CardHeader>
          <Box>
            <ExamResultsTable clickOnPreviewFor={clickOnPreviewFor}/>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default ExamResultsCard;
