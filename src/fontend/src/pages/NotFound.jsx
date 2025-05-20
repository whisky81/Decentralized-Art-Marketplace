import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', pt: 10 }}>
      <Typography variant="h1" fontWeight="bold" color="primary">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sorry, the page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Container>
  );
}
