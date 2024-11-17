import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { DeltaStatic, Sources } from 'quill';
import { io, Socket } from 'socket.io-client';
import 'react-quill/dist/quill.snow.css';

import {
  toolbarModules,
  toolbarFormats,
  serverConfigs,
  AppEvents
} from '../configs';

// TODO: For performance, not persisting text as react state.

const TextEditor = () => {
  const socketRef = useRef<Socket | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  const syncEditorWithCollaborators = (delta: DeltaStatic) => {
    quillRef.current?.getEditor().updateContents(delta);
  };

  const broadcastChangesToCollaborators = (delta: DeltaStatic) => {
    socketRef.current?.emit(AppEvents.SEND_CHANGES, delta);
  };

  const disconnectFromServer = () => {
    socketRef.current?.disconnect();
  };

  useEffect(() => {
    socketRef.current = io(serverConfigs.url);
    socketRef.current.on(AppEvents.RECEIVE_CHANGES, syncEditorWithCollaborators);

    return disconnectFromServer;
  }, []);

  const handleChange = (value: string, delta: DeltaStatic, source: Sources, editor: ReactQuill.UnprivilegedEditor) => {
    // This check is a must to prevent infinite loop of delta broadcasting.
    // https://github.com/zenoamaro/react-quill/blob/master/README.md#using-deltas
    if (source !== 'user') {
      return;
    }

    broadcastChangesToCollaborators(delta);
  };

  return (
    <ReactQuill
      ref={(element) => {
        quillRef.current = element;
      }}
      theme='snow'
      onChange={handleChange}
      modules={toolbarModules}
      formats={toolbarFormats}
    />
  );
};

export { TextEditor };