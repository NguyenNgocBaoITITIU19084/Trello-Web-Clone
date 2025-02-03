import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      width: 'full',
      backgroundColor: 'primary.dark',
      display: 'flex',
      alignItems: 'center'
    }}>
        Page Content
    </Box>
  )
}

export default BoardContent