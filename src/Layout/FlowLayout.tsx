import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import FlowDashboard from '../Components/FlowLayoutComponents/FlowDashboard';
import { colorPalette } from '../Utils/Constants';


function FlowLayout(props : {mode : 'publish' | 'draft'}) {

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
        </Tabs>
      </Box>
      <Box sx={{ width: '100%' }} >
        <FlowDashboard
          mode={props.mode}
          type={value === '1' ? 'flows' : 'templates'}
        />
      </Box>
    </>
  )
}

export default FlowLayout