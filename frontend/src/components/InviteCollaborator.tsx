// src/components/InviteCollaborator.tsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxios } from '../hooks/useAxios';

const InviteCollaborator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const documentId = id;
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const axiosInstance = useAxios();

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Update API endpoint to use 'document' instead of 'documents'
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
      setInviteEmail('');
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to send invitation. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Invite Collaborator</h3>
      <form onSubmit={handleInvite} style={styles.form}>
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Enter collaborator's email"
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#1890ff',
    color: '#fff',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default InviteCollaborator;
