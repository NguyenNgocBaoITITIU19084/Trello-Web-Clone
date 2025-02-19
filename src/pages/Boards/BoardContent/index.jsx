import Box from '@mui/material/Box'

import ListColumns from './ListCloumns/ListColumns'
import {mapOrder} from '~/utils/sort'
function BoardContent({ board }) {
  const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
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
      <ListColumns columns={orderedColumn}/>
    </Box>
  )
}

export default BoardContent