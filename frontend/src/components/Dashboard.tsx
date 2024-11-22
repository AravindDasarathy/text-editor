import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Container,
  Box,
} from '@mui/material';
import LogoutButton from './LogoutButton';

interface Document {
  _id: string;
  title: string;
}

const Dashboard: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext)!;
  const axiosInstance = useAxios();
  const [ownedDocuments, setOwnedDocuments] = useState<Document[]>([]);
  const [collaboratingDocuments, setCollaboratingDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get('/documents');
        setOwnedDocuments(response.data.ownedDocuments);
        setCollaboratingDocuments(response.data.collaboratingDocuments);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
  }, [axiosInstance, accessToken, navigate]);

  const handleNewDocument = async () => {
    const title = prompt('Enter document title');
    if (!title) return;

    try {
      const response = await axiosInstance.post('/documents', { title });
      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const handleDocumentClick = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user?.username}
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleNewDocument}>
            New Document
          </Button>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Your Documents
          </Typography>
          <List>
            {ownedDocuments.map((doc) => (
              <ListItemButton key={doc._id} onClick={() => handleDocumentClick(doc._id)}>
                <ListItemText primary={doc.title} />
              </ListItemButton>
            ))}
          </List>
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            Collaborating Documents
          </Typography>
          <List>
            {collaboratingDocuments.map((doc) => (
              <ListItemButton key={doc._id} onClick={() => handleDocumentClick(doc._id)}>
                <ListItemText primary={doc.title} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
