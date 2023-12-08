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
    // if (editorRef.current) {
    //  InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue());
    // } 
    const heap = new BinaryHeap<{ key: number; value: string }>((pair) => pair.key);
    // Push elements to the heap
    heap.push({ key: 5, value: "F" });
    heap.push({ key: 3, value: "Thrwwwee" });
    heap.push({ key: 10, value: "Ten" });
    heap.push({ key: 1, value: "One" });
    alert(heap.peek().key);
    alert(heap.peek().value);
    alert(heap.pop().key);
    alert(heap.peek().key);
    alert(heap.peek().value);
    alert(heap.pop().key);



    /* bin.push([8,'e']);
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
    alert(bin.pop());
    alert(bin.peak());
        */

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
