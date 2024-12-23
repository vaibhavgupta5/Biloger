'use client'
import {  useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const Editor = () => {

  useEffect(() => {
    // Initialize Quill editor
    const editor = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
    });


  }, []);

  
  return (
    <div>
      <div id="editor-container" style={{ height: '70vh', marginBottom: '20px' }}></div>
    </div>
  );
};

export default Editor;
