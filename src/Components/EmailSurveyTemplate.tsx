import Checkbox from '@mui/material/Checkbox';
import { Box, Button, FormControlLabel, Typography } from '@mui/material'
import React from 'react'
import { SketchPicker } from 'react-color'

import * as ButtonStyles from '../Styles/ButtonStyle'


function EmailSurveyTemplate() {
  return (
    <Box >
        <Box sx={{display : 'flex', justifyContent : 'space-between', borderBottom : '1px #454545 solid',padding : '20px'}} >
            <Typography sx={{color : '#f1f1f1',position : 'relative', top : '5px'}} >Company Logo</Typography>
            <Button style={{ width: 'fit-content',marginTop : '0px' }} sx={ButtonStyles.containedButton} variant="contained">Add logo</Button>
        </Box>

        <Box sx={{display : 'flex', justifyContent : 'space-between', borderBottom : '1px #454545 solid',padding : '20px'}} >
            <Typography sx={{color : '#f1f1f1',position : 'relative', top : '5px'}} >Main Color</Typography>
            <input style={{}} type={'color'} ></input>
        </Box>

        <Box sx={{display : 'flex', justifyContent : 'space-between', borderBottom : '1px #454545 solid',padding : '20px'}} >
            <Typography sx={{color : '#f1f1f1',position : 'relative', top : '5px'}} >Round buttons</Typography>
            <Checkbox  sx={{color : '#f3d503'}} defaultChecked />
        </Box>
    </Box>
  )
}

export default EmailSurveyTemplate