import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import _ from '@lodash'
import definitionService from 'src/app/services/definitionService'
import { getName, getValueSafe } from 'src/app/utils'
import { useSelector } from 'react-redux'
import { selectUser } from 'app/store/user/userSlice'

const CardHeader = styled(Box)<any>(({ theme }) => ({
  display: 'flex',
  marginBottom: '0',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}))

const CardHeaderImage = styled(Box)<any>(({ theme }) => ({
  borderRadius: '100px',
  maxWidth: '85px',
  marginRight: '1.5rem',
}))

const CardTitle = styled(Typography)<any>(({ role, theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 600,
  margin: role === 'student' ? 'auto 1.5rem auto 0' : 0,
  [theme.breakpoints.down('sm')]: {
    margin: role === 'student' ? '1rem 0' : 0,
  },
}))

const GradeBlock = styled(Box)<any>(({ role, theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 600,
  margin: role === 'student' ? 'auto 1.5rem' : 0,
  textAlign: 'right',
  '& .current-grade-title': {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  '& .current-grade': {
    fontSize: '1.5rem',
    fontWeight: 700,
    backgroundColor: '#D0E4F5',
    padding: '0.5rem 1rem',
    borderRadius: '100px',
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    margin: role === 'student' ? '1rem 0' : 0,
  },
}))

function TodoGradesCard({ todo }) {
  const user = useSelector(selectUser);
  const theme = useTheme()
  const headerImage = definitionService.getSkinFromDefinition(
    'card_characters.item_graded',
    null
  )

  return (
    <>
      <Card
        className="mt-0 p-24"
        sx={{ position: 'relative', marginBottom: '4rem' }}
      >
        <CardContent
          sx={{
            p: '0 !important',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <CardHeader>
            {headerImage?.image && (
              <CardHeaderImage
                component="img"
                src={headerImage?.image}
                alt={
                  headerImage?.alt ? headerImage.alt : 'Ya tienes calificación'
                }
              />
            )}
            <CardTitle role={user?.role}>{
              !todo.user ? '¡Ya tienes calificación!' : getName(todo.user,  'fml')
            }</CardTitle>
          </CardHeader>
          <GradeBlock>
            <Typography className={'current-grade-title'}>
              Calificación
            </Typography>
            <Typography className={'current-grade'}>
              {todo.score}/{getValueSafe(() => user.tenant.max_grade, 10)}
            </Typography>
          </GradeBlock>
        </CardContent>
      </Card>
    </>
  )
}

export default TodoGradesCard
