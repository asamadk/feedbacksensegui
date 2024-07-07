import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types';
import FlowDashboard from '../Components/FlowLayoutComponents/FlowDashboard';
import FlowTemplateDashboard from '../Components/FlowLayoutComponents/FlowTemplateDashboard';
import { colorPalette } from '../Utils/Constants';

const sideBarData: sideBarListType[] = [
  { label: 'Flows', value: 'flows' },
  { label: 'Templates', value: 'templates' },
]

function FlowLayout() {

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
          <Tab value="1" label="Flows" />
          {/* <Tab value="2" label="Templates" /> */}
        </Tabs>
      </Box>
      <Box sx={{ width: '100%' }} >
        <FlowDashboard
          type={value === '1' ? 'flows' : 'templates'}
        />
      </Box>
    </>
  )
}

export default FlowLayout