import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import { NoteAdd } from '@mui/icons-material'

function ListColumns({ columns }) {

  return (
    <Box sx={{
      overflowY: 'hidden',
      overflowX: 'auto',
      display: 'flex',
      width: '100%',
      height: '100%',
      bgcolor: 'inherit',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      {/* Box cloumn 01 */}
      {columns.map(column => <Column column={column} key={column._id} />)}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}
      >
        <Button
          sx={{
            color: 'white',
            width: '100%',
            justifyContent: 'flex-start',
            pl: 2.5,
            py: 1
          }}
          startIcon={<NoteAdd/>}
        >Add New Column</Button>
      </Box>
    </Box>
  )
}

export default ListColumns