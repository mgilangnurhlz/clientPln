import axios from 'axios';
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [role, setRole] = useState('');
  const [office, setOffice] = useState('');
  const [division, setDivision] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setEmail('');
    setPassword('');
    setConfPassword('');
    setRole('');
    setOffice('');
    setDivision('');
    setErrorMessage('');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/users', {
        name,
        email,
        password,
        confPassword,
        role,
        office,
        division,
        status: 'active',
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

  return (
    <>
      <Button
        startIcon={<Iconify icon="eva:plus-fill" />}
        variant="contained"
        color="inherit"
        onClick={handleClickOpen}
      >
        Add User
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
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
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="office"
              name="office"
              label="Office"
              type="text"
              fullWidth
              variant="standard"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="division"
              name="division"
              label="Division"
              type="text"
              fullWidth
              variant="standard"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            />
            <FormControl variant="standard" fullWidth autoFocus required>
              <InputLabel id="demo-simple-select-standard-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="role"
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="password"
              fullWidth
              variant="standard"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              autoFocus
              required
              margin="dense"
              id="confPassword"
              fullWidth
              variant="standard"
              name="confPassword"
              label="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
