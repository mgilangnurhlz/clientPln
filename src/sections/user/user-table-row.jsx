import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import FormDialog from 'src/components/form/editUser';
import AlertDialog from 'src/components/dialog/deleteUser';

export default function UserTableRow({
  id, // Add id prop to get user id
  selected,
  name,
  email,
  role,
  office,
  avatarUrl,
  division,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{office}</TableCell>
        <TableCell>{division}</TableCell>
        <TableCell>{role}</TableCell>
        <TableCell>
          <Label
            color={
              (status === 'pending' && 'primary') || (status === 'active' && 'success') || 'error'
            }
          >
            {status}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <FormDialog id={id} />

        <AlertDialog id={id} />
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  division: PropTypes.any,
  office: PropTypes.any,
  role: PropTypes.any,
  status: PropTypes.any,
  avatarUrl: PropTypes.any,
  selected: PropTypes.any,
};
