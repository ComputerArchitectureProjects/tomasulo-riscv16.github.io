// ParentComponent.tsx
"use client"
import React, {useRef} from 'react';
import Editor from '@monaco-editor/react';
import RegisterFile from './registers';
import Memory from './memory';
import InstructionHandler  from './handleInstructions';


const Home = () => {
  const editorRef = useRef<any>(null);
  const InstructionHandlerRef = useRef<InstructionHandler | null>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function showValue() {
    if (editorRef.current) {
      const inputString: string = editorRef.current.getValue();
      const resultArray: string[] = inputString.split('\n');
    } else {
      alert('Refresh the page and try again!');
    }
  }

  function test() {
    if (editorRef.current) {
      InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue());
    } 
  }

  return (
    <> 
      <div className='Home'>
        <button onClick={test}>Show value</button>
        <div className='Editor'>
          <h6 className='h6'>Type Your Instructions</h6>
          <Editor
            className='EditorComponent'
            defaultLanguage="cpp"
            defaultValue="// some comment"
            theme="vs-dark"
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
