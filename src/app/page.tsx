"use client"
import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import InstructionHandler from './handleInstructions';
import BinaryHeap from './minheap';
import GenericTable from './table';
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TextField from './integertextfield'

const Home = () => {
  const [intgerVal, setValue] = useState('');
  const [isRan, setRun] = useState(false);
  const [combinedArray, setCombinedArray] = useState<[string, string | number, string | number, string | number, string | number][]>([]);
  const editorRef = useRef<any>(null);
  const InstructionHandlerRef = useRef<InstructionHandler | null>(null);
  const [numberLoad, setNumberLoad] = useState(-1);
  const [numberStore, setNumberStore] = useState(-1);
  const [numberAddAddi, setNumberAddAddi] = useState(-1);
  const [numberCallRet, setNumberCallRet] = useState(-1);
  const [numberNand, setNumberNand] = useState(-1);
  const [numberDiv, setNumberDiv] = useState(-1);
  const [numberBne, setNumberBne] = useState(-1);
  const [startingAddress, setStartingAddress] = useState(0);
  const [IPC, setIPC] = useState(0);
  const [branchMisprediction, setBranchMisprediction] = useState(0);
  const [totalExecutionTime, setTotalExecutionTime] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);

  const handleLoadChange = (value : any) => {
    setNumberLoad(value);
  };

  const handleStoreChange = (value : any) => {
    setNumberStore(value);
  };

  const handleAddAddiChange = (value : any) => {
    setNumberAddAddi(value);
  };

  const handleCallRetChange = (value : any) => {
    setNumberCallRet(value);
  };

  const handleNandChange = (value : any) => {
    setNumberNand(value);
  };

  const handleDivChange = (value : any) => {
    setNumberDiv(value);
  };

  const handleBneChange = (value : any) => {
    setNumberBne(value);
  };

  const handleStartingAddressChange = (value : any) => {
    setStartingAddress(value);
  };

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  function showValue() {
    if (editorRef.current) {
      const inputString: string = editorRef.current.getValue();
    } else {
      alert('Refresh the page and try again!');
    }
  }

  function test() {
    if (editorRef.current) {
      InstructionHandlerRef.current = new InstructionHandler(editorRef.current.getValue(), startingAddress,
        [numberLoad, numberStore, numberBne, numberCallRet, numberAddAddi , numberDiv, numberNand]);
      let test0 = InstructionHandlerRef.current.instructions;
      let test1 = InstructionHandlerRef.current.issueTime;
      let test2 = InstructionHandlerRef.current.startExecutionTime;
      let test3 = InstructionHandlerRef.current.endExecutionTime;
      let test4 = InstructionHandlerRef.current.writeTime;
      let IPC   = InstructionHandlerRef.current.IPC;
      let branchMisprediction = InstructionHandlerRef.current.branchMispredictionRate;
      let totalCycles = InstructionHandlerRef.current.totalExecutionTime - 1;
      setIPC(IPC);
      setBranchMisprediction(branchMisprediction);
      setTotalExecutionTime(totalExecutionTime);
      setTotalCycles(totalCycles);
      setCombinedArray(test0.map((item, index) => [item, test1[index], test2[index], test3[index], test4[index]]));
      setRun(true);
      /*for (let i = 0; i < test1.length; i++) {
        alert(" Issue time for " + i + " is " + test1[i]);
        alert(" Start Execution time for " + i + " is " + test2[i]);
        alert(" End Execution time for " + i + " is " + test3[i]);
        alert(" Write time for " + i + " is " + test4[i]);
      }*/
    }
    else {
      alert('Refresh the page and try again!');
    }
  }

  return (
    <>
      <div className='Home'>
        <div className='mainlayout'>
          <div className='leftside'>
            <div className='texteditors-container'>
              <div className='texteditors-row'>
                <TextField label={"Number of Load Stations"} onInputChange={handleLoadChange}/>
                <TextField label={"Number of Store Stations"} onInputChange={handleStoreChange}/>
              </div>
              <div className='texteditors-row'>
                <TextField label={"Number of Add/Addi Stations"} onInputChange={handleAddAddiChange}/>
                <TextField label={"Number of Call/Ret Stations"} onInputChange={handleCallRetChange}/>
              </div>
              <div className='texteditors-row'>
                <TextField label={"Number of Nand Stations"} onInputChange={handleNandChange}/>
                <TextField label={"Number of Div Stattions"} onInputChange={handleDivChange}/>
              </div>
              <div className='texteditors-row'>
                <TextField label={"Number of BNE Stations"} onInputChange={handleBneChange}/>
                <TextField label={"Starting Address"} onInputChange={handleStartingAddressChange}/>
              </div>
            </div>
            <div className='instructioninput'>
              <div className='Editor'>
                <div className='topEditor'>
                  <h4 className='h6'>Type Your Instructions</h4>
                  <IconButton onClick={test} aria-label="Start">
                    <PlayArrowIcon fontSize='large' style={{ color: 'goldenrod' }} />
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
            <div className='texteditors-container'>
                <h2>IPC : {IPC}</h2>
                <h2>Branch Misprediction % : {branchMisprediction} %</h2>
                <h2>Total Cycles Spanned: {totalCycles}</h2>
            </div>
            <div className='table'>
              {isRan && (
                <GenericTable
                  header={['Instruction', 'Issue Time', 'Start Execution Time', 'End Execution Time', 'Write Time']}
                  body={combinedArray}
                />
              )}
              {!isRan && (
              <GenericTable
                header={['Instruction', 'Issue Time', 'Start Execution Time', 'End Execution Time', 'Write Time']}
                body = {[["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"],
                ["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
                ,["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
                ,["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
                ,["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
                ,["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
                ,["undefined","undefined","undefined","undefined","undefined"],["undefined","undefined","undefined","undefined","undefined"]
              ]}
              />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
