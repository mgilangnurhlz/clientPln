import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppView } from 'src/sections/overview/view';

import { getMe } from '../features/authSlice';
// ----------------------------------------------------------------------

export default function AppPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);
  return (
    <>
      <Helmet>
        <title> Dashboard | ElectraCare </title>
      </Helmet>

      <AppView />
    </>
  );
}
