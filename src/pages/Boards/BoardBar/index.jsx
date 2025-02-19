import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { capitalizeFirstLetter } from '~/utils/formatter'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx={{
      height: (theme) => theme.trello.boardBarHeight,
      width: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid #00bfa5',
      gap: 2,
      overflowX: 'auto',
      p: 2,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display:'flex', alignContent: 'center', gap: 2 }}>
        <Chip sx={MENU_STYLE} icon={<SpaceDashboardIcon />} label={board?.title} clickable/>
        <Chip sx={MENU_STYLE} icon={<VpnLockIcon/>} label={capitalizeFirstLetter(board?.type)} clickable/>
        <Chip sx={MENU_STYLE} icon={<AddToDriveIcon />} label="Add to Google Drive" clickable/>
        <Chip sx={MENU_STYLE} icon={<BoltIcon />} label="Automation" clickable/>
        <Chip sx={MENU_STYLE} icon={<FilterListIcon />} label="Filter" clickable/>
      </Box>
      <Box sx={{ display:'flex', alignContent: 'center', gap: 2 }}>
        <Button startIcon={<PersonAddAlt1Icon />}
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invited</Button>
        <AvatarGroup max={4} sx ={{ 
          '& .MuiAvatar-root': {
            height: '34px',
            width:'34px',
            fontSize: '16px'
          }
        }}>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="nguyenngocbao">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar