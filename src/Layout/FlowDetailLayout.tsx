import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'
import CreateAutomation from '../Components/AutomationWorkflow/CreateAutomation';

function FlowDetailLayout() {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {/* <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="1" label="Create" />
      </Tabs> */}
      <Box sx={{ backgroundColor: colorPalette.background}} >
        {
          value === '1' && <CreateAutomation />
        }
      </Box>
    </>
  )
}

export default FlowDetailLayout