import React from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material'

const Loading = ({ type = 'spinner', message = 'Loading...', count = 3 }) => {
  if (type === 'spinner') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          gap: 2,
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>
    )
  }

  if (type === 'cards') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="80%" height={16} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Skeleton variant="text" width={80} height={32} />
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  if (type === 'stats') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="80%" height={32} />
                </Box>
              </Box>
              <Skeleton variant="text" width="40%" height={16} />
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
    </Box>
  )
}

export default Loading
