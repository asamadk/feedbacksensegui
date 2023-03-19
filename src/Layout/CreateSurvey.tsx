import { Box, Button } from '@mui/material'
import React from 'react'
import FeedbackCanvas from '../FlowComponents/FeedbackCanvas'
import 'reactflow/dist/style.css';
import FeedbackComponentList from '../FlowComponents/FeedbackComponentList'
import * as ButtonStyles from '../Styles/ButtonStyle'


const localNavbar = {
  borderBottom: '1px #454545 solid',
  paddingBottom: '10px',
  textAlign: 'end',
  paddingRight: '10px'
}

function CreateSurvey() {
  return (
    <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)' }} >
      <Box sx={localNavbar} >
        <Button style={{ width: '110px', marginRight: '15px' }} sx={ButtonStyles.containedButton} variant="contained">Save</Button>
        <Button style={{ width: '110px' }} sx={ButtonStyles.outlinedButton} variant="contained">Preview</Button>
      </Box>
      <Box display={'flex'} >
        <Box  width={'77%'} >
          <FeedbackCanvas />
        </Box>
        <Box sx={{borderLeft : '1px #454545 solid', overflowY : 'scroll'}} width={'23%'} >
          <FeedbackComponentList />
        </Box>
      </Box>
    </Box>
  )
}

export default CreateSurvey