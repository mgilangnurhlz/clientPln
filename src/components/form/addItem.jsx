import axios from 'axios';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [datein, setDatein] = useState('');
  const [dateout, setDateout] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('code', code);
    formData.append('location', location);
    formData.append('datein', datein);
    formData.append('dateout', dateout);
    try {
      const response = await axios.post('http://localhost:5002/barangs', formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      // Check if the user was successfully created
      if (response.status === 201) {
        console.log('User created successfully');
        handleClose();
        window.location.reload();
      } else {
        // Handle other response statuses if needed
        console.error('Failed to create user');
      }
    } catch (error) {
      // Handle errors from the Axios request
      console.error('Error adding user:', error.message);
      if (error.response && error.response.data && error.response.data.msg) {
        // Jika pesan kesalahan tersedia dalam respons, atur pesan kesalahan
        setErrorMessage(error.response.data.msg);
      } else {
        // Jika tidak ada pesan kesalahan yang tersedia, atur pesan kesalahan umum
        setErrorMessage('Failed to add user. Please try again later.');
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setCode('');
    setLocation('');
    setDatein('');
    setDateout('');
    setFile(null);
    setErrorMessage('');
  };

  return (
    <>
      <Button
        startIcon={<Iconify icon="eva:plus-fill" />}
        variant="contained"
        color="inherit"
        onClick={handleClickOpen}
      >
        Add Item
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <DialogContentText style={{ color: 'red' }}>{errorMessage}</DialogContentText>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Item Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="code"
              name="code"
              label="Item Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="location"
              name="location"
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              fullWidth
              variant="standard"
            />

            <TextField
              sx={{ marginTop: '10px' }}
              autoFocus
              required
              margin="dense"
              id="datein"
              name="datein"
              label="Installation Date"
              value={datein}
              onChange={(e) => setDatein(e.target.value)}
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: {
                  placeholder: ' ',
                },
              }}
            />
            <TextField
              autoFocus
              sx={{ marginTop: '10px' }}
              required
              margin="dense"
              id="dateout"
              name="dateout"
              label="Maintenance Date"
              value={dateout}
              onChange={(e) => setDateout(e.target.value)}
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputProps: {
                  placeholder: ' ',
                },
              }}
            />
            <TextField
              autoFocus
              required
              sx={{ marginTop: '10px' }}
              label="Image"
              margin="dense"
              id="file"
              name="file"
              type="file"
              // onChange event modified to handle file input
              onChange={(e) => setFile(e.target.files[0])}
              fullWidth
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <CloudUploadIcon style={{ marginRight: '8px' }} />,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
      <style>
        {`
          input[type=file]::-webkit-file-upload-button {
            display: none;
          }
        `}
      </style>
    </>
  );
}
