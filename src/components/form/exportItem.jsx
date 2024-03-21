import React from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

const getStatus = (dateout) => {
  const today = new Date();
  const oneMonthAfter = new Date();
  oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

  const dateOutDate = new Date(dateout);

  if (dateOutDate <= today) {
    return 'overdue';
  }
  if (dateOutDate > today && dateOutDate < oneMonthAfter) {
    return 'upcoming';
  }

  return 'distan';
};

const ExportItem = ({ items }) => {
  const exportToExcel = async () => {
    try {
      const { data } = await axios.get('http://localhost:5002/barangs');

      const formattedData = data.map((item) => ({
        Name: item.name,
        Code: item.code,
        Location: item.location,
        'Installation Date': formatDate(item.datein),
        'Maintenance Date': formatDate(item.dateout),
        'Person Responsible': item.user.name,
        Status: getStatus(item.dateout),
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

      XLSX.writeFile(workbook, 'items.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again later.');
    }
  };

  return (
    <Button variant="contained" color="success" onClick={exportToExcel}>
      Export to Excel
    </Button>
  );
};

ExportItem.propTypes = {
  items: PropTypes.array.isRequired,
};

export default ExportItem;
