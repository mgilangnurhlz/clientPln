import axios from 'axios';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppConversionRates from '../app-conversion-rates';

export default function AppView() {
  const { user } = useSelector((state) => state.auth);
  const [barangData, setBarangData] = useState([]);
  const isUser = user && user.role === 'user';

  useEffect(() => {
    const fetchBarangData = async () => {
      try {
        const response = await axios.get('http://localhost:5002/barangs');
        setBarangData(response.data);
      } catch (error) {
        console.error('Error fetching barang data:', error.message);
      }
    };

    fetchBarangData();
  }, []);

  const getUpcomingDates = () =>
    barangData
      .filter((barang) => new Date(barang.dateout) >= new Date())
      .sort((a, b) => new Date(a.dateout) - new Date(b.dateout))
      .slice(0, 5);
  const upcomingBarang = getUpcomingDates();

  const getNearestDates = () => {
    const today = new Date();
    return barangData
      .map((barang) => ({ ...barang, datein: new Date(barang.datein) }))
      .sort((a, b) => Math.abs(today - a.datein) - Math.abs(today - b.datein))
      .slice(0, 5);
  };

  const nearestDates = getNearestDates();

  const getTopBarang = () => {
    const barangCount = {};
    barangData.forEach((barang) => {
      const { name } = barang;
      if (barangCount[name]) {
        barangCount[name] += 1;
      } else {
        barangCount[name] = 1;
      }
    });
    const sortedBarang = Object.entries(barangCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    return sortedBarang;
  };

  const topBarang = getTopBarang();

  const chartData = topBarang.map(([name, count]) => ({
    label: name,
    value: count,
  }));

  const getTopUsers = () => {
    const userCount = {};
    barangData.forEach((barang) => {
      const {
        user: { name },
      } = barang;
      if (userCount[name]) {
        userCount[name] += 1;
      } else {
        userCount[name] = 1;
      }
    });
    const sortedUsers = Object.entries(userCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    return sortedUsers;
  };

  const topUsers = getTopUsers();

  const chartDataUser = topUsers.map(([name, count]) => ({
    label: name,
    value: count,
  }));

  const getMonthlyItems = () => {
    const monthlyCounts = {};

    barangData.forEach((barang) => {
      const dateOut = new Date(barang.dateout);
      const monthYear = `${dateOut.toLocaleString('default', {
        month: 'short',
      })} ${dateOut.getFullYear().toString().slice(-2)}`;

      if (monthlyCounts[monthYear]) {
        monthlyCounts[monthYear] += 1;
      } else {
        monthlyCounts[monthYear] = 1;
      }
    });

    const today = new Date();
    const labels = [];
    for (let i = 0; i < 12; i += 1) {
      const monthYear = new Date(today.getFullYear(), today.getMonth() + i, 1);
      labels.push(
        `${monthYear.toLocaleString('default', { month: 'short' })} ${monthYear
          .getFullYear()
          .toString()
          .slice(-2)}`
      );
    }

    const data = labels.map((label) => (monthlyCounts[label] ? monthlyCounts[label] : 0));

    return { labels, data };
  };

  const { labels, data } = getMonthlyItems();

  const getTotalBarang = () => {
    let total = 0;
    barangData.forEach(() => {
      total += 1;
    });
    return total;
  };
  const totalBarang = getTotalBarang();

  const getOneMonthAheadItems = () => {
    const today = new Date();
    const oneMonthAhead = new Date(today);
    oneMonthAhead.setMonth(today.getMonth() + 1);

    let total = 0;
    barangData.forEach((barang) => {
      const dateOut = new Date(barang.dateout);
      if (dateOut >= today && dateOut <= oneMonthAhead) {
        total += 1;
      }
    });
    return total;
  };

  const oneMonthAheadItems = getOneMonthAheadItems();

  const getPassedDateoutItems = () => {
    const today = new Date();
    let total = 0;
    barangData.forEach((barang) => {
      const dateOut = new Date(barang.dateout);
      if (dateOut < today) {
        total += 1;
      }
    });
    return total;
  };

  const passedDateoutItems = getPassedDateoutItems();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi {user && user.name}, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Items"
            total={totalBarang}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Caution items"
            total={oneMonthAheadItems}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Overdue items"
            total={passedDateoutItems}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Items need maintenance"
            list={upcomingBarang.map((barang, index) => ({
              id: barang.id,
              title: barang.name,
              type: `order${index + 1}`,
              time: barang.dateout,
              location: barang.location,
            }))}
          />
        </Grid>

        {!isUser && (
          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Items due each month"
              subheader=""
              chart={{
                labels,
                series: [
                  {
                    name: 'Items',
                    type: 'column',
                    fill: 'solid',
                    data,
                  },
                ],
              }}
            />
          </Grid>
        )}
        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="Newly added items"
            list={nearestDates.map((barang) => ({
              id: barang.id,
              title: barang.name,
              description: barang.user.name,
              image: barang.url,
              postedAt: barang.datein,
              location: barang.location,
            }))}
          />
        </Grid>

        {!isUser && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="The most items"
              chart={{
                series: chartData,
              }}
            />
          </Grid>
        )}
        {!isUser && (
          <Grid xs={12}>
            <AppConversionRates
              title="User with the most items"
              chart={{
                series: chartDataUser,
              }}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
