// ParentComponent.tsx
"use client"
import React, {useRef} from 'react';
import Editor from '@monaco-editor/react';
import RegisterFile from './registers';
import Memory from './memory';
import InstructionHandler  from './handleInstructions';
import { BinaryHeap } from './minheap';


const Home = () => {
  const editorRef = useRef<any>(null);
  const InstructionHandlerRef = useRef<InstructionHandler | null>(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function showValue() {
    if (editorRef.current) {
      const inputString: string = editorRef.current.getValue();
    //  InstructionHandlerRef.current = new InstructionHandler(inputString);
    } else {
      alert('Refresh the page and try again!');
    }
    /*
    LOAD X1, 43(X2)
STORE X1, 43(X2)
ADD X1, X2, X3
NAND X1, X2, X3
DIV X1, X2, X3
ADDI X1, X2, 44
*/
  }

  function test() {
    if (editorRef.current) {
      InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue(),0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
      let tes = InstructionHandlerRef.current.issueTime;
      for(let i = 0; i < tes.length; i++){
        alert(tes[i]+ " " + i);
      }
    } 
    else {
      alert('Refresh the page and try again!');
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
