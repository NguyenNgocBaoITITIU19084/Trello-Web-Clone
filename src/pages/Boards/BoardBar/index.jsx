import Box from '@mui/material/Box'

function BoardBar() {
  return (
    <Box sx={{
      height: (theme) => theme.trello.boardBarHeight,
      width: 'full',
      backgroundColor: 'primary.dark',
      display: 'flex',
      alignItems: 'center'
    }}>
        Board Content
    </Box>
  )
}

export default BoardBar