// Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAxios } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Document {
  _id: string;
  title: string;
}

const Dashboard: React.FC = () => {
  const { accessToken, user } = useContext(AuthContext)!;
  const { logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDocumentClick = (documentId: string) => {
    navigate(`/documents/${documentId}`);
  };

  return (
    <div>
      <header>
        <h1>Welcome, {user?.username}</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <button onClick={handleNewDocument}>New Document</button>
      <h2>Your Documents</h2>
      <ul>
        {ownedDocuments.map((doc) => (
          <li key={doc._id} onClick={() => handleDocumentClick(doc._id)}>
            {doc.title}
          </li>
        ))}
      </ul>
      <h2>Collaborating Documents</h2>
      <ul>
        {collaboratingDocuments.map((doc) => (
          <li key={doc._id} onClick={() => handleDocumentClick(doc._id)}>
            {doc.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
