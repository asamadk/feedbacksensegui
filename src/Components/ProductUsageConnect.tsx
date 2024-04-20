import { Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router';
import { colorPalette } from '../Utils/Constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CopyBlock } from 'react-code-blocks';
import { BASE_URL } from '../Utils/Endpoints';
import LoopIcon from '@mui/icons-material/Loop';
import { getProductUsageScript } from '../Utils/EventConstants';
import { useSelector } from 'react-redux';

function ProductUsageConnect() {

  const navigate = useNavigate();
  const currentUserState = useSelector((state: any) => state.currentUser);

  const handleBackButtonClick = () => {
    navigate(-1);
  }

  return (
    <Box sx={{ padding: '20px 40px' }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Box display={'flex'}>
          <IconButton sx={{ marginTop: '10px' }} onClick={handleBackButtonClick}  >
            <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
          </IconButton>
          <Typography variant='h5' marginTop={'15px'} >Integration Snippet</Typography>
        </Box>
      </Box>
      <Box textAlign={'start'} marginTop={'50px'}>
        <Box>
          <Typography variant='h6' marginTop={'15px'} >Current Integration Status :
            <span style={{ color: 'red' }} >  Not Connected</span>
            <IconButton>
              <LoopIcon />
            </IconButton>
          </Typography>
        </Box>
        <Typography color={colorPalette.fsGray} >
          Plug in this code to every page in your application
          (just before the closing of head tag. This will send basic
          user engagement details to feedbacksense's account)
        </Typography>
        <Typography color={colorPalette.fsGray} >
          Replace the highlighted line's values marked in <b style={{ color: 'green' }} >green</b> with your data
        </Typography>
      </Box>
      <Box marginTop={'20px'} >
        <CopyBlock
          text={getProductUsageScript(currentUserState.organization_id)}
          language={'html'}
          theme={'light'}
          highlight='3,5,6,7,10,11'
          // wrapLongLines
        />
      </Box>
    </Box>
  )
}

export default ProductUsageConnect