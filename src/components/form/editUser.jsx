import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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

export default function FormDialog({ id }) {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [role, setRole] = useState('');
  const [office, setOffice] = useState('');
  const [division, setDivision] = useState('');
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confPassword: '',
    role: '',
    office: '',
    division: '',
    status: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/users/${id}`);
        const fetchedUserData = response.data; // Gunakan nama variabel lain untuk menyimpan data pengguna
        setUserData(fetchedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    setName(userData.name);
    setEmail(userData.email);
    setRole(userData.role);
    setOffice(userData.office);
    setDivision(userData.division);
    setStatus(userData.status);
  }, [userData]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:5002/users/${id}`, {
        name,
        email,
        password,
        confPassword,
        role,
        office,
        division,
        status,
      });

      // Check if the user was successfully created
      if (response.status === 200) {
        console.log('User created successfully');

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
      <MenuItem onClick={handleClickOpen}>
        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
        Edit
      </MenuItem>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
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
              label="New Password"
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
            <FormControl sx={{ mt: 2 }} variant="standard" fullWidth autoFocus required>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem disabled value="pending">
                  Pending
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="banned">Banned</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
FormDialog.propTypes = {
  id: PropTypes.string.isRequired,
};
