import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material'

const StatsCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendValue,
  subtitle,
  className = '',
}) => {
  const theme = useTheme()

  const getTrendIcon = () => {
    if (!trend) return null
    return trend === 'up' ? (
      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
    ) : (
      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
    )
  }

  const getTrendColor = () => {
    if (!trend) return 'text.secondary'
    return trend === 'up' ? 'success.main' : 'error.main'
  }

  return (
    <Card
      className={`fade-in ${className}`}
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 48,
              height: 48,
              mr: 2,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 0.5 }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}

        {(trend || trendValue) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {getTrendIcon()}
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                color: getTrendColor(),
                fontWeight: 500,
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StatsCard
