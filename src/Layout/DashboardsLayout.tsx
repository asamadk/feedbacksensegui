import React from 'react'
import { Box, Tab, Tabs } from '@mui/material';
import { colorPalette } from '../Utils/Constants';
import ClientCompass from '../Components/Dashboards/ClientCompass';
import UsageCompass from '../Components/Dashboards/UsageCompass';
import DashboardCompass from '../Components/Dashboards/DashboardCompass';

function DashboardsLayout() {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', background: colorPalette.textSecondary }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="1" label="Client Compass" />
          {/* <Tab value="2" label="Usage Console" /> */}
          <Tab value="3" label="Revenue Compass" />
        </Tabs>
      </Box>
      {value === '1' && <ClientCompass />}
      {value === '2' && <UsageCompass />}
      {value === '3' && <DashboardCompass />}
    </>
  )
}

export default DashboardsLayout