import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import { io, Socket } from 'socket.io-client';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toolbarModules, toolbarFormats, serverConfigs, AppEvents } from '../configs';
import InviteCollaborator from '../features/InviteCollaborator';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutButton from './LogoutButton';

/**
 * This TextEditor component uses a simple strategy to handle concurrent writes.
 * Ideally, it is better to handle via OT or CRDTs.
 * For now, going with a simple approach.
 */

const TextEditor: React.FC = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const { accessToken, setAccessToken, refreshAccessToken } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  useEffect(() => {
    if (!documentId || !accessToken) return;

    // Initialize Socket.IO connection and store it in socketRef.current
    socketRef.current = io(serverConfigs.url, {
      auth: { token: accessToken },
    });

    const socket = socketRef.current;

    const handleConnectError = async (err: any) => {
      if (err && err.message === 'Unauthorized') {
        try {
          await refreshAccessToken();

          // Update socket auth token
          if (typeof socket.auth === 'object' && socket.auth !== null) {
            (socket.auth as { token: string }).token = accessToken;
          }

          // Retry connection
          socket.connect();
        } catch (refreshError) {
          setAccessToken(null);
          navigate('/login');
        }
      } else {
        console.error('Socket connection error:', err);
      }
    };

    socket.on('connect_error', handleConnectError);

    socket.emit('join-document', { documentId });

    socket.on('load-document', (documentContent: any) => {
      quillRef.current?.getEditor().setContents(documentContent);
      setDocumentLoaded(true);
    });

    socket.on(AppEvents.RECEIVE_CHANGES, (delta: DeltaStatic) => {
      quillRef.current?.getEditor().updateContents(delta);
    });

    // Cleanup function
    return () => {
      socket.off('connect_error', handleConnectError);
      socket.disconnect();

      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      socketRef.current = null;
    };
  }, [documentId, accessToken, refreshAccessToken]);

  useEffect(() => {
    if (!documentLoaded) return;

    saveIntervalRef.current = setInterval(() => {
      if (quillRef.current) {
        const content = quillRef.current.getEditor().getContents();
        socketRef.current?.emit('save-document', content);
      }
    }, 2000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    };
  }, [documentLoaded]);

  const handleChange = useCallback(
    (
      value: string,
      delta: DeltaStatic,
      source: Sources,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      if (source !== 'user') return;
      socketRef.current?.emit(AppEvents.SEND_CHANGES, delta);
    },
    [socketRef]
  );

  const handleInviteClick = () => {
    setInviteDialogOpen(true);
  };

  const handleInviteClose = () => {
    setInviteDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Text Editor
          </Typography>
          <Button color="inherit" onClick={handleInviteClick}>
            Invite Collaborator
          </Button>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      {documentLoaded && (
        <InviteCollaborator open={inviteDialogOpen} onClose={handleInviteClose} />
      )}
      {!documentLoaded && <div>Loading document...</div>}
      <Box sx={{ padding: 2 }}>
        <ReactQuill
          ref={(element) => {
            quillRef.current = element;
          }}
          theme="snow"
          onChange={handleChange}
          modules={toolbarModules}
          formats={toolbarFormats}
          readOnly={!documentLoaded}
          style={{ display: documentLoaded ? 'block' : 'none', height: 'calc(100vh - 64px - 16px)' }}
        />
      </Box>
    </>
  );
};

export default TextEditor;
