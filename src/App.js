import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)));
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem('editorContent', JSON.stringify(convertToRaw(contentState)));
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const handleSave = () => {
  };

  const handleBeforeInput = (char) => {
    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();

    if (char === '#' && selection.getStartOffset() === 0 && blockText === '') {
      setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
      return 'handled';
    }
    if (char === '*' && selection.getStartOffset() === 0 && blockText.startsWith('')) {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
      setEditorState(newEditorState);
      return 'handled';
    }
    if (char === '+' && selection.getStartOffset() === 0 && blockText.startsWith('')) {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, 'COLOR-RED');
      setEditorState(newEditorState);
      return 'handled';
    }
    if (char === '/' && selection.getStartOffset() === 0 && blockText.startsWith('')) {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE');
      setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  };

  return (
    <div style={{backgroundColor: 'white'}}>
      <h1>Demo Editor by: Junaid Nazir</h1>
      <button onClick={handleSave}>Save</button>
      <div style={{ border: '3px solid teal', minHeight: '200px', padding: '10px', margin: "30px" }}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          
        />
      </div>
    </div>
  );
};

export default MyEditor;
