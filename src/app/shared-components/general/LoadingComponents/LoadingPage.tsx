import FusePageSimple from '@fuse/core/FusePageSimple'
import { styled } from '@mui/material/styles'
import { Box, Container, Skeleton } from '@mui/material'
const Root = styled(FusePageSimple)(() => ({
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}))

function LoadingPage() {
  return (
    <Root
      sx={{
        padding: 0,
      }}
      header={
        <Container
          maxWidth="lg"
          sx={{
            padding: 0,
            marginTop: '90px',
          }}
        >
          <Skeleton variant="rounded" height={120}></Skeleton>
        </Container>
      }
      content={
        <Container maxWidth="lg">
          <Skeleton
            variant="rounded"
            height={300}
            sx={{ marginTop: '60px' }}
          ></Skeleton>
        </Container>
      }
    />
  )
}

export default LoadingPage
