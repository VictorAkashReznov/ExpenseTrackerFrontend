import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material'

const drawerWidth = 240

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: <ReceiptIcon />,
  },
  {
    id: 'add-expense',
    label: 'Add Expense',
    icon: <AddIcon />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <AnalyticsIcon />,
  },
]

const Sidebar = ({ open, onClose, currentPage, onPageChange }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleItemClick = (pageId) => {
    onPageChange(pageId)
    if (isMobile) {
      onClose()
    }
  }

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: { xs: 0, sm: 8 } }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handleItemClick(item.id)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.id ? 'white' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: currentPage === item.id ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mx: 2, my: 2 }} />
      
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Box sx={{ fontSize: '0.875rem', opacity: 0.7 }}>
          Expense Tracker v1.0
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default Sidebar
