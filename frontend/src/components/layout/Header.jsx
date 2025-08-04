import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material'

const Header = ({ onMenuClick, currentPage }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getPageTitle = (page) => {
    switch (page) {
      case 'dashboard':
        return 'Dashboard'
      case 'expenses':
        return 'Expenses'
      case 'add-expense':
        return 'Add Expense'
      case 'analytics':
        return 'Analytics'
      default:
        return 'Expense Tracker'
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <AccountBalanceIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            {isMobile ? getPageTitle(currentPage) : 'Expense Tracker'}
          </Typography>
        </Box>

        {!isMobile && (
          <Typography
            variant="subtitle1"
            sx={{
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            {getPageTitle(currentPage)}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
