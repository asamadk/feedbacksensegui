import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useRef, useState } from 'react'
import { styled } from '@mui/system';
import { BASE_URL, getShareSurveyLink } from '../Utils/Endpoints';
import { useParams } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from "react-qr-code";
import { useSelector } from 'react-redux';
import { CopyBlock, dracula } from 'react-code-blocks';
import { nord } from 'react-code-blocks';
import CustomTabSet from '../Components/CustomTabSet';
import { ConfigurePageTabList } from '../Utils/FeedbackUtils';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#006dff',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006dff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006dff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006dff',
    },
  },
  color: 'white'
});

function ShareSurvey() {

  const { surveyId } = useParams();
  const qrCodeRef = useRef<any>(null);

  let integrationCode = `<!-- Start of feedbacksense (www.feedbacksense.com) code --> 
  <script type='text/javascript'> 
    (function(w) {var s = document.createElement('script');
      s.src = '${BASE_URL}/live/web-surveys/${surveyId}';
      s.async = true;
      var e = document.getElementsByTagName('script')[0];
      e.parentNode.insertBefore(s, e);
    })(window);
  </script>
  <!-- End of feedbacksense code -->`;

  const [open, setOpen] = React.useState(false);
  const defaultColor = useSelector((state: any) => state.colorReducer);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCopyButton = () => {
    setOpen(true);
    navigator.clipboard.writeText(getShareSurveyLink(window.location.host, surveyId));
  }

  const handleDownloadQRCode = () => {
    const qrCodeImage: any = qrCodeRef.current;
    if (qrCodeImage == null) {
      return;
    }

    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(qrCodeImage))}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        return;
      }
      ctx.drawImage(img, 0, 0);
      const qrCodeDataURL = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.href = qrCodeDataURL;
      anchor.download = 'FEEDBACKSENSE_SURVEY_QR_CODE.png';
      anchor.click();
    };
  };

  const handleEmbedCodeCopy = () => {
    setOpen(true);
    navigator.clipboard.writeText(integrationCode);
  }

  return (
    <Box sx={{ overflowY: 'scroll', padding: '50px 30px' }} >
      <Box sx={{ border: '1px #454545 solid', borderRadius: '5px', backgroundColor: defaultColor?.primaryColor }} >
        <Box sx={{ textAlign: 'start', padding: '15px', borderBottom: '1px #454545 solid' }} >
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px' }} >Survey Link</Typography>
        </Box>
        <Box sx={{ padding: '20px', textAlign: 'start' }} >
          <Typography sx={{ color: '#808080', fontSize: '16', marginBottom: '10px' }} >Share this link with anyone you want and start getting responses to your survey.</Typography>
          <Box sx={{ display: 'flex' }} >
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyButton}
              style={{ width: 'fit-content', marginTop: '0px', marginRight: '10px' }}
              sx={ButtonStyles.containedButton}
              variant="contained"
            >
              Copy survey link
            </Button>
            <CssTextField
              size='small'
              sx={{ input: { color: 'white' } }}
              id="outlined-basic"
              value={getShareSurveyLink(window.location.host, surveyId)}
              variant="outlined"
              style={{ width: '60%' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ border: '1px #454545 solid', borderRadius: '5px', backgroundColor: defaultColor?.primaryColor, marginTop: '20px' }} >
        <Box sx={{ textAlign: 'start', padding: '15px', borderBottom: '1px #454545 solid' }} >
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px' }} >Embed</Typography>
        </Box>
        <Box sx={{ padding: '20px', textAlign: 'center' }} >
          <Typography sx={{ color: '#808080', fontSize: '16', marginBottom: '10px', textAlign: 'start' }} >
            Copy & Paste the code before the body tag.
          </Typography>
        </Box>
        <Box>
          <Box>
            <CopyBlock
              text={integrationCode}
              language={'html'}
              theme={nord}
              codeBlock
              wrapLines
            />
          </Box>
        </Box>
      </Box>

      {/* qr code */}
      <Box sx={{ border: '1px #454545 solid', borderRadius: '5px', backgroundColor: defaultColor?.primaryColor, marginTop: '20px' }} >
        <Box sx={{ textAlign: 'start', padding: '15px', borderBottom: '1px #454545 solid' }} >
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px' }} >QR Code</Typography>
        </Box>
        <Box sx={{ padding: '20px', textAlign: 'center' }} >
          <Typography sx={{ color: '#808080', fontSize: '16', marginBottom: '10px' }} >
            Scan this QR code and start filling the survey.
          </Typography>
          <Box width={'20%'} margin={'auto'} sx={{ backgroundColor: 'white' }} padding={'10px'} >
            <QRCode
              ref={qrCodeRef}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={'http://' + getShareSurveyLink(window.location.host, surveyId)}
            />
          </Box>
          <Box marginTop={'10px'} textAlign={'center'} >
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownloadQRCode}
              style={{ width: 'fit-content', marginTop: '0px', marginRight: '10px' }}
              sx={ButtonStyles.containedButton}
              variant="contained"
            >
              Download QR Code
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Link Copied!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ShareSurvey