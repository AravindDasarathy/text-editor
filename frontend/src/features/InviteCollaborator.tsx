import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxios } from '../hooks/useAxios';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

interface InviteCollaboratorProps {
  open: boolean;
  onClose: () => void;
}

const InviteCollaborator: React.FC<InviteCollaboratorProps> = ({ open, onClose }) => {
  const { id } = useParams<{ id: string }>();
  const documentId = id;
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const axiosInstance = useAxios();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleInvite = async () => {
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');
    setSnackbarMessage('');
    setSnackbarOpen(false);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        `/documents/${documentId}/invite`,
        { email: inviteEmail },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccessMessage('Invitation sent successfully!');
      setSnackbarMessage('Invitation sent successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setInviteEmail('');
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setSnackbarMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to send invitation. Please try again later.');
        setSnackbarMessage('Failed to send invitation. Please try again later.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setInviteEmail('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Collaborator</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collaborator's Email"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            disabled={loading}
            error={!!errorMessage}
            helperText={errorMessage}
          />
          {loading && <CircularProgress size={24} />}
          {successMessage && <Typography color="success">{successMessage}</Typography>}
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleInvite} color="primary" disabled={loading}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InviteCollaborator;
