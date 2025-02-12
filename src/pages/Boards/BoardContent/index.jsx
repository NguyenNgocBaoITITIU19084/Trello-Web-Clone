import Box from '@mui/material/Box'

import ListColumns from './ListCloumns/ListColumns'

function BoardContent() {

  return (
    // Content page
    <Box
      sx={{
        height: (theme) => theme.trello.boardContentHeight,
        width: 'full',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        display: 'flex',
        p: '10px 0'
      }}
    >
      <ListColumns />
    </Box>
  )
}

export default BoardContent