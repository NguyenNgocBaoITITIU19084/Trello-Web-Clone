import Box from '@mui/material/Box'

import SelectMode from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello-icon.svg'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Recent from './Menus/Recent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'

function AppBar() {
  return (
    <Box px={2} sx={{
      height: (theme) => theme.trello.appBarHeight,
      width: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
          <SvgIcon component={TrelloIcon} inheritViewBox fontSize='small' />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
        </Box>
        <Box sx={{display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Starred />
          <Templates />
          <Recent />
          <Button variant="outlined">Created</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id="outlined-basic" label="Search" variant="outlined" size={'small'} sx={{ minWidth: '120px' }}/>
        <SelectMode />

        <Tooltip title="Notifications" sx={{ cursor: 'pointer' }}>
          <Badge badgeContent={4} color="secondary">
            <NotificationsNoneIcon color="action" sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>

        <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
          <HelpOutlineIcon sx={{ color: 'primary.main' }}/>
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar