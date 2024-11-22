// ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Container)({
  textAlign: 'center',
  marginTop: '64px',
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorInfo: '',
  };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state to display the fallback UI
    return { hasError: true, errorInfo: _.toString() };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorInfo: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error is caught
      return (
        <ErrorContainer maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            An unexpected error has occurred.
          </Typography>
          <Box sx={{ marginTop: 4 }}>
            <Button variant="contained" color="primary" onClick={this.handleReload}>
              Reload
            </Button>
          </Box>
        </ErrorContainer>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
