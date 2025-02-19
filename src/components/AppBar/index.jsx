import { useState } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box px={2} sx={{
      height: (theme) => theme.trello.appBarHeight,
      width: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          <SvgIcon component={TrelloIcon} inheritViewBox fontSize='small' />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Trello</Typography>
        </Box>
        <Box sx={{display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Starred />
          <Templates />
          <Recent />

          <Button sx={{
            color: 'white',
            border: 'none',
            '&:hover': { border: 'none' }
          }}
          variant="outlined"
          >Created</Button>

        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="outlined-basic"
          label="Search"
          type='text'
          variant="outlined"
          size={'small'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }}/>
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                onClick={() => setSearchValue('')}
                sx={{
                  color: searchValue ? 'white' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 'small'
                }}
              />
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '.MuiFormLabel-root': { color: 'white' },
            '.MuiInputBase-input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }} />

        <SelectMode />

        <Tooltip title="Notifications" sx={{ cursor: 'pointer' }}>
          <Badge badgeContent={4} color="warning">
            <NotificationsNoneIcon color="action" sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>

        <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
          <HelpOutlineIcon sx={{ color: 'white' }}/>
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar