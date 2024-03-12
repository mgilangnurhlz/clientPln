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
import FormDialog from 'src/components/form/editItem';
import AlertDialog from 'src/components/dialog/deleteItem';

import { fDate } from '../../utils/format-time';

const fSt = (statusCode) => {
  const statusMap = {
    1: 'Overdue',
    2: 'Upcoming',
    3: 'Distan',
  };

  return statusMap[statusCode] || 'unknown';
};

export default function ItemsTableRow({
  id,
  selected,
  name,
  avatarUrl,
  code,
  location,
  datein,
  dateout,
  user,
  handleClick,
  status,
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
            <Avatar sx={{ width: 60, height: 60 }} variant="rounded" alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{code}</TableCell>

        <TableCell>{location}</TableCell>

        <TableCell>{fDate(datein)}</TableCell>

        <TableCell>{fDate(dateout)}</TableCell>

        <TableCell>{user}</TableCell>

        <TableCell>
          <Label
            color={
              (fSt(status) === 'Upcoming' && 'primary') ||
              (fSt(status) === 'Distan' && 'success') ||
              'error'
            }
          >
            {fSt(status)}
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

ItemsTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  avatarUrl: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  code: PropTypes.any,
  location: PropTypes.any,
  datein: PropTypes.any,
  dateout: PropTypes.any,
  user: PropTypes.any,
  status: PropTypes.any,
};
