import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  DirectionsCar as CarIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingIcon,
  LocalHospital as HealthIcon,
  School as EducationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material'

const categoryIcons = {
  food: <RestaurantIcon />,
  transport: <CarIcon />,
  housing: <HomeIcon />,
  shopping: <ShoppingIcon />,
  health: <HealthIcon />,
  education: <EducationIcon />,
  other: <CategoryIcon />,
}

const categoryColors = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  housing: '#45B7D1',
  shopping: '#96CEB4',
  health: '#FFEAA7',
  education: '#DDA0DD',
  other: '#98D8C8',
}

const ExpenseCard = ({
  expense,
  onEdit,
  onDelete,
  className = '',
}) => {
  const theme = useTheme()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getCategoryIcon = (category) => {
    return categoryIcons[category?.toLowerCase()] || categoryIcons.other
  }

  const getCategoryColor = (category) => {
    return categoryColors[category?.toLowerCase()] || categoryColors.other
  }

  return (
    <Card
      className={`fade-in ${className}`}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                bgcolor: getCategoryColor(expense.category),
                width: 48,
                height: 48,
                mr: 2,
              }}
            >
              {getCategoryIcon(expense.category)}
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                {expense.title || expense.description}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={expense.category || 'Other'}
                  size="small"
                  sx={{
                    bgcolor: getCategoryColor(expense.category),
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'capitalize',
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {formatDate(expense.createdAt || expense.date)}
                </Typography>
              </Box>
              
              {expense.description && expense.title && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {expense.description}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'error.main',
                mb: 1,
              }}
            >
              {formatCurrency(expense.value || expense.amount)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onEdit && onEdit(expense)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete && onDelete(expense)}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'white',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ExpenseCard
