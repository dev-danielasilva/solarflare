import { Box, Typography } from '@mui/material'

function NoItemsFound({message = ''}) {
  return (
    <Box
      sx={{
        marginTop: '3.5rem',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: '1rem',
        borderRadius: '10px',
      }}
    >
      <Typography sx={{ textAlign: 'center', opacity: 0.5 }}>
        {message ? message : 'No hay resultados que mostrar'}
      </Typography>
    </Box>
  )
}

export default NoItemsFound
