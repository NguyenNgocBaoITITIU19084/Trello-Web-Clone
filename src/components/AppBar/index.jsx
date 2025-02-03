import Box from '@mui/material/Box'

import SelectMode from '../../components/ModeSelect'

function AppBar() {
  return (
    <Box sx={{
      height: (theme) => theme.trello.appBarHeight,
      width: 'full',
      backgroundColor: 'primary.light',
      display: 'flex',
      alignItems: 'center'
    }}>
      <SelectMode />
    </Box>
  )
}

export default AppBar