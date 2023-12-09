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
  }

  function test() {
    //if (editorRef.current) {
    //  InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue(),0,[0]);
    //} 
    //const heap = new BinaryHeap<{ key: number; value: string }>((pair) => pair.key);
    // Push elements to the heap
    let lol = "ADDI r2, r1, 854472";
    let instruction = lol.split(" ");
    let  dest = parseInt(instruction[1][1]);
    let  src1 = parseInt(instruction[2][1]);
    let  imm = parseInt(instruction[3]);
    alert(dest + " " + src1 + " " + imm);                   
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
