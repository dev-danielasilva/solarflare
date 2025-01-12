import FusePageSimple from '@fuse/core/FusePageSimple'
import { styled } from '@mui/material/styles'
import { Box, Container, Stack, useMediaQuery, useTheme } from '@mui/material'
import GlobalGradesSummary from 'app/shared-components/dedicated/GradesSummaryStudent/GlobalGradesSummary'
import { Banner } from 'app/shared-components/general/Banner'
import BaseUserType from 'app/store/user/BaseUserType'
import { useSelector } from 'react-redux'
import { selectUser } from 'app/store/user/userSlice'
import definitionService from 'src/app/services/definitionService'
import GradesSummaryTeacher from 'app/shared-components/dedicated/GradesSummaryTeacher/GradesSummaryTeacher'

const Root = styled(FusePageSimple)(() => ({
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}))

function Grades() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isExtraSmall = useMediaQuery('(max-width:475px)')
  const user: BaseUserType = useSelector(selectUser)
  const bannerImage = definitionService.getGradesBannerImage()

  const isStudent = user.role === 'student'

  return (
    <Root
      header={
        <Container maxWidth="lg">
          <Banner title="Calificaciones">
            {!isExtraSmall && isStudent && bannerImage && (
              <Box>
                <img
                  src={bannerImage.image}
                  alt={
                    bannerImage.alt
                      ? bannerImage.alt
                      : 'Personaje de bienvenida'
                  }
                  style={{
                    width: isMobile ? '15vh' : '20vh',
                    zIndex: -99,
                    position: 'relative',
                    left: '35%',
                    transform: 'translate(-50%, 0)',
                    top: isMobile ? '2vh' : '4vh',
                  }}
                />
              </Box>
            )}
          </Banner>
        </Container>
      }
      content={
        <Container maxWidth="lg">
          <Stack spacing={2}>
            {isStudent && <GlobalGradesSummary showDetails />}
            {!isStudent && <GradesSummaryTeacher />}
          </Stack>
        </Container>
      }
    />
  )
}

export default Grades
