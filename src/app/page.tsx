// ParentComponent.tsx
"use client"
import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import InstructionHandler from './handleInstructions';
import BinaryHeap from './minheap';
import GenericTable from './table';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Play } from 'next/font/google';
import TextField from './integertextfield'

const Home = () => {
  const [intgerVal, setValue] = useState('');
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
    /*let BinaryHeapRef = new BinaryHeap(Number);
    BinaryHeapRef.push(5);
    BinaryHeapRef.push(-24);
    BinaryHeapRef.push(1);
    BinaryHeapRef.push(-1);
    BinaryHeapRef.push(1);
    BinaryHeapRef.push(1);
    BinaryHeapRef.push(1);
    BinaryHeapRef.push(1);
    BinaryHeapRef.push(1);
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());
    alert(BinaryHeapRef.pop());*/
    if (editorRef.current) {
      InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue(), 0, [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
      let test1 = InstructionHandlerRef.current.issueTime;
      let test2 = InstructionHandlerRef.current.startExecutionTime;
      let test3 = InstructionHandlerRef.current.endExecutionTime;
      let test4 = InstructionHandlerRef.current.writeTime;
      for (let i = 0; i < test1.length; i++) {
        alert(" Issue time for " + i + " is " + test1[i]);
        alert(" Start Execution time for " + i + " is " + test2[i]);
        alert(" End Execution time for " + i + " is " + test3[i]);
        alert(" Write time for " + i + " is " + test4[i]);
      }
    }
    else {
      alert('Refresh the page and try again!');
    }
    /*
    <GenericTable 
          header = {['Instruction', 'Issue Time', 'Execute Time', 'Write Time', 'Commit Time']}
          body   = {[['LOAD X1, 43(X2)', '1', '2', '3', '4'], ['STORE X1, 43(X2)', '1', '2', '3', '4'], ['ADD X1, X2, X3', '1', '2', '3', '4'], ['NAND X1, X2, X3', '1', '2', '3', '4'], ['DIV X1, X2, X3', '1', '2', '3', '4'], ['ADDI X1, X2, 44', '1', '2', '3', '4']]}
        >
    </GenericTable>    
    */
  }

  return (
    <>
      <div className='Home'>
        <div className='mainlayout'>
          <div className='leftside'>
            <div className='texteditors-container'>
              <div className='texteditors-row'>
                <TextField/>
                <TextField/>
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
            </div>
            <div className='instructioninput'>
                  <div className='Editor'>
                    <div className='topEditor'>
                      <h4 className='h6'>Type Your Instructions</h4>
                      <IconButton onClick={test} aria-label="Start"> 
                        <PlayArrowIcon fontSize='large' style={{ color: 'goldenrod' }}/>
                      </IconButton>
                    </div>
                  <Editor
                    className='EditorComponent'
                    defaultLanguage="cpp"
                    defaultValue="// some comment"
                    theme="vs-dark"
                    onMount={handleEditorDidMount}
                  />
                </div>
              </div>
            </div>
          <div className='rightside'>
            <div>
            <div className='texteditors-container'>
              <div className='texteditors-row'>
                <TextField/>
                <TextField/>
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
              <div className='texteditors-row'>
                <TextField />
                <TextField />
              </div>
            </div>
            </div>
            <div className='table'>
            <GenericTable 
              header = {['Instruction', 'Issue Time', 'Execute Time', 'Write Time', 'Commit Time']}
              body   = {[['LOAD X1, 43(X2)', '1', '2', '3', '4'], ['STORE X1, 43(X2)', '1', '2', '3', '4'], ['ADD X1, X2, X3', '1', '2', '3', '4'], ['NAND X1, X2, X3', '1', '2', '3', '4'], ['DIV X1, X2, X3', '1', '2', '3', '4'], ['ADDI X1, X2, 44', '1', '2', '3', '4']]}
            >
            </GenericTable> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
