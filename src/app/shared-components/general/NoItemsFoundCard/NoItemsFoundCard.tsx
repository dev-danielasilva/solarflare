import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import NoItemsFound from '../NoItemsFound/NoItemsFound'

function NoItemsFoundCard({ message, title }) {
  return (
    <Card>
      <CardContent sx={{ padding: '2rem !important' }}>
        <Stack spacing={2}>
          {title && (
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          )}
          {/* <Typography variant="h6" fontWeight="bold">
              {group.name}
              <Typography variant="body2">
                Estos son los promedios de las materias de este grupo. Haz clic en cualquiera para ver los detalles.
              </Typography>
            </Typography> */}
          <NoItemsFound message={message} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NoItemsFoundCard
