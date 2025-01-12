import Box from '@mui/material/Box';

export const ReduceLabel = (label) => {
  return (
    <Box fontSize={'1.2em'} sx={{display: 'inline-block'}}>
      {label}
    </Box>
  )
}