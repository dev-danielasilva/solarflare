import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import GradeAverageChart from './GradeAverageChart'
import { GroupsGradesAverage } from './TeacherGradesSummary'
import _ from 'lodash'

export default function TeacherGradesSummaryCard({
  group,
}: {
  group: GroupsGradesAverage
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight="bold">
            {group.name}
            <Typography variant="body2">
              Estos son los promedios de las materias de este grupo. Haz clic en cualquiera para ver los detalles.
            </Typography>
          </Typography>
          <Box>
            {/* {_.isNumber(group.student_count) && (
              <Typography variant="body2">
                Número de alumnos: {group.student_count}
              </Typography>
            )} */}
            {/* <Typography variant="body2">
              Periodo: {group.start_date} al {group.end_date}
            </Typography> */}
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
            }}
          >
            {group.courses.map((course) => (
              <GradeAverageChart
                grade={course.score}
                subject={course.subject}
                bgcolor={course.background_color}
                color={course.color}
                courseId={course.id}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
