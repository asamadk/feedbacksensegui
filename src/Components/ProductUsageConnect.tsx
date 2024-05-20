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
import { globalSettingSubContainers } from '../Styles/LayoutStyles';

function ProductUsageConnect(props: { back: any }) {

  const navigate = useNavigate();
  const currentUserState = useSelector((state: any) => state.currentUser);

  const handleBackButtonClick = () => {
    props.back();
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Box display={'flex'}>
          <IconButton onClick={handleBackButtonClick}  >
            <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
          </IconButton>
          <Typography variant='h6' marginTop={'4px'} >Integration Snippet</Typography>
        </Box>
      </Box>
      <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 130px)', textAlign: 'start', overflowY: 'scroll' }} >
        <Box >
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
        <Box marginTop={'20px'} >
          <CopyBlock
            text={getProductUsageScript(currentUserState.organization_id)}
            language={'html'}
            theme={'light'}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProductUsageConnect