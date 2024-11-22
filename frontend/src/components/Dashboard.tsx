import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import { Link, useNavigate } from 'react-router-dom';
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
import { styled } from '@mui/material/styles';
import UserMenu from './UserMenu';

interface Document {
  _id: string;
  title: string;
}

const DocumentListContainer = styled(Box)({
  marginTop: 16,
});

const TitleLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit'
});

const Dashboard: React.FC = () => {
  const { accessToken } = useContext(AuthContext)!;
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
              <TitleLink to="/">Text Editor</TitleLink>
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Container>
        <DocumentListContainer>
          <Button variant="contained" color="primary" onClick={handleNewDocument}>
            New Document
          </Button>
          <DocumentList
            title="Your Documents"
            documents={ownedDocuments}
            onDocumentClick={handleDocumentClick}
          />
          <DocumentList
            title="Collaborating Documents"
            documents={collaboratingDocuments}
            onDocumentClick={handleDocumentClick}
          />
        </DocumentListContainer>
      </Container>
    </>
  );
};

interface DocumentListProps {
  title: string;
  documents: Document[];
  onDocumentClick: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ title, documents, onDocumentClick }) => (
  <Box sx={{ marginTop: 2 }}>
    <Typography variant="h5">{title}</Typography>
    <List>
      {documents.map((doc) => (
        <ListItemButton key={doc._id} onClick={() => onDocumentClick(doc._id)}>
          <ListItemText primary={doc.title} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

export default Dashboard;
