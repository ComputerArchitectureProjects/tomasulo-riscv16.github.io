// IntegerTextField.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const IntegerTextField = ({ label, onInputChange } : any) => {
  const [value, setValue] = useState('');

  const handleInputChange = (e : any) => {
    const inputValue = e.target.value;

    // Check if the input is a valid integer
    if (/^\d*$/.test(inputValue)) {
      setValue(inputValue);
      // Pass the value to the parent component
      onInputChange(inputValue);
    }
    // If not a valid integer, do nothing (or provide feedback to the user)
  };

  return (
    <TextField
      className='texteditor'
      type="integer"
      label={label}
      value={value}
      onChange={handleInputChange}
      variant="outlined"
    />
  );
};

export default IntegerTextField;
