import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Alert from 'src/components/alert/signup';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [office, setOffice] = useState('');
  const [division, setDivision] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/users', {
        name,
        email,
        password,
        confPassword,
        role: 'user',
        office,
        division,
        status: 'pending',
      });

      // Check if the user was successfully created
      if (response.status === 201) {
        console.log('User created successfully');
        setShowAlert(true);
        setTimeout(() => {
          navigate('/'); // Navigate to home page after 2 seconds
        }, 1500);
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

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          required
          name="name"
          type="text"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          required
          name="location"
          type="text"
          label="Office"
          value={office}
          onChange={(e) => setOffice(e.target.value)}
        />

        <TextField
          required
          name="division"
          type="text"
          label="Division"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        />

        <TextField
          required
          name="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          required
          name="confPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
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
      </Stack>

      <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
        {showAlert && <Alert />}
      </Typography>

      <LoadingButton
        type="submit"
        onClick={handleSubmit}
        fullWidth
        size="large"
        variant="contained"
        color="inherit"
      >
        Sign Up
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign up to ElectraCare</Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 4 }}>
            Have an account?
            <Link href="/" variant="subtitle2" sx={{ ml: 0.5 }}>
              Log In
            </Link>
          </Typography>
          {errorMessage && ( // Menampilkan pesan kesalahan dari server
            <Typography variant="body2" sx={{ mb: 2, color: 'red' }}>
              {errorMessage}
            </Typography>
          )}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
