import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';
import FormDialog from 'src/components/form/addItem';

import TableNoData from '../table-no-data';
import ItemsTableRow from '../items-table-row';
import ItemsTableHead from '../items-table-head';
import TableEmptyRows from '../table-empty-rows';
import ItemsTableToolbar from '../items-table-toolbar'; // Pastikan Anda mengimpor komponen ini

import { emptyRows, applyFilter, getComparator } from '../utils';

const getStatus = (dateout) => {
  const today = new Date();
  const oneMonthAfter = new Date();
  oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

  const dateOutDate = new Date(dateout);

  if (dateOutDate <= today) {
    return '1';
  }
  if (dateOutDate > today && dateOutDate < oneMonthAfter) {
    return '2';
  }

  return '3';
};

const ItemsPage = () => {
  const [barang, setBarang] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getbarang();
  }, []);

  const getbarang = async () => {
    const response = await axios.get('http://localhost:5002/barangs');
    setBarang(response.data);
  };

  const items = barang.map((item, index) => ({
    id: item.id,
    avatarUrl: item.url,
    name: item.name,
    code: item.code,
    location: item.location,
    datein: item.datein,
    dateout: item.dateout,
    user: item.user.name,
    status: getStatus(item.dateout),
  }));

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleDelete = async () => {
    try {
      await selected.map(async (userId) => {
        try {
          await axios.delete(`http://localhost:5002/barangs/${userId}`);
        } catch (error) {
          console.error(`Failed to delete user with id ${userId}:`, error);
        }
      });

      // Setelah berhasil dihapus dari server, perbarui state lokal pengguna
      const updatedBarang = barang.filter((user) => !selected.includes(user.id));
      setBarang(updatedBarang);
      setSelected([]);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: items,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Items</Typography>
        <FormDialog />
      </Stack>

      <Card>
        <ItemsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDelete={handleDelete}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ItemsTableHead
                order={order}
                orderBy={orderBy}
                rowCount={items.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Items Name' },
                  { id: 'code', label: 'Code' },
                  { id: 'location', label: 'Location' },
                  { id: 'datein', label: 'Installation Date' },
                  { id: 'dateout', label: 'Maintenance Date' },
                  { id: 'user', label: 'Person Responsible' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ItemsTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      code={row.code}
                      location={row.location}
                      datein={row.datein}
                      dateout={row.dateout}
                      user={row.user}
                      status={row.status}
                      avatarUrl={row.avatarUrl}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, items.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default ItemsPage;
