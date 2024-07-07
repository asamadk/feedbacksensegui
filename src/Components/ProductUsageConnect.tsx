import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { colorPalette } from '../Utils/Constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CopyBlock } from 'react-code-blocks';
import { BASE_URL, getUsageStatusURL } from '../Utils/Endpoints';
import LoopIcon from '@mui/icons-material/Loop';
import { getProductUsageScript } from '../Utils/EventConstants';
import { useSelector } from 'react-redux';
import { globalSettingSubContainers } from '../Styles/LayoutStyles';
import axios from 'axios';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';

function ProductUsageConnect(props: { back: any }) {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const currentUserState = useSelector((state: any) => state.currentUser);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  async function fetchConnectionStatus() {
    try {
      setLoading(true);
      const { data } = await axios.get(getUsageStatusURL(), { withCredentials: true });
      setLoading(false);
      if (data.data && data.data > 0) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong','error')
      setLoading(false);
      console.log("🚀 ~ fetchConnectionStatus ~ error:", error);
      handleUnAuth(error);
    }
  }

  const handleBackButtonClick = () => {
    props.back();
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Box display={'flex'}>
          <IconButton sx={{ position: 'relative', bottom: '5px' }} onClick={handleBackButtonClick}  >
            <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
          </IconButton>
          <Typography variant='h6' >Integration Snippet</Typography>

        </Box>
        <Box margin={'3px'} >
          {
            isConnected ? <Box sx={{ color: '#008000', background: '#CBF0CB', padding: '5px 15px', fontSize: 12, borderRadius: 2, width: 'fit-content' }} >
              Connected
            </Box> :
              <Box sx={{ border: `0.5px ${colorPalette.fsGray} solid`, color: colorPalette.fsGray, padding: '5px 15px', fontSize: 12, borderRadius: 2, width: 'fit-content' }} >
                Not Connected
              </Box>
          }
        </Box>
      </Box>

      <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 130px)', textAlign: 'start', overflowY: 'scroll' }} >
        <Typography color={colorPalette.fsGray} >
          Plug in this code to every page in your application
          (just before the closing of head tag. This will send basic
          user engagement details to RetainSense's account)
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
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default ProductUsageConnect