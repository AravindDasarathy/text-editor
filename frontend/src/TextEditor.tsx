import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { configs, formats } from './configs/quill';

// TODO: Re-rendering for every text change. For performance, don't persist text as react state

const TextEditor = () => {
  const [editorContent, setEditorContent] = useState('');

  // TODO: sanitise html?
  const handleChange = (html: string) => {
    setEditorContent(html);
  }

  return (
    <ReactQuill
      theme='snow'
      onChange={handleChange}
      value={editorContent}
      modules={configs}
      formats={formats}
    />
  );
};

export { TextEditor };