import { Alert, Box, Button, Checkbox, MenuItem, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useRef, useState } from 'react'
import { styled } from '@mui/system';
import { BASE_URL, getShareSurveyLink } from '../Utils/Endpoints';
import { useParams } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from "react-qr-code";
import { useSelector } from 'react-redux';
import { CopyBlock } from 'react-code-blocks';
import { textFieldStyle } from '../Styles/InputStyles';
import { colorPalette } from '../Utils/Constants';
import { tableBodyText, tableCellStyle, tableContainerStyle } from '../Styles/TableStyle';
import { getPersonName } from '../Utils/FeedbackUtils';

const CssTextField = styled(TextField)(textFieldStyle);

function ShareSurvey() {

  const { surveyId } = useParams();
  const qrCodeRef = useRef<any>(null);

  let integrationCode = `<!-- Start of RetainSense (www.retainsense.com) code --> 
  <script type='text/javascript'> 
    (function(w) {var s = document.createElement('script');
      s.src = '${BASE_URL}/live/web-surveys/${surveyId}';
      s.async = true;
      var e = document.getElementsByTagName('script')[0];
      e.parentNode.insertBefore(s, e);
    })(window);
  </script>
  <!-- End of RetainSense code -->`;


  const [open, setOpen] = React.useState(false);

  const companiesState: any[] = useSelector((state: any) => state.companies);
  const peopleOptions: any[] = useSelector((state: any) => state.people);

  const [company, setCompany] = useState<string>('');
  const [person, setPerson] = useState<string>('');

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCopyButton = () => {
    if (person == null) { return; }
    setOpen(true);
    navigator.clipboard.writeText(getShareSurveyLink(window.location.host, surveyId, person));
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
      anchor.download = 'RETAIN_SENSE_SURVEY_QR_CODE.png';
      anchor.click();
    };
  };


  return (
    <Box sx={{padding: '50px 30px', background: colorPalette.textSecondary }} >
      <Box 
        sx={{ 
          borderRadius: '5px', 
          backgroundColor: colorPalette.background, 
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
          height : 'calc(100vh - 150px)'
        }} 
      >
        <Box sx={{ textAlign: 'center', padding: '15px' }} >
          <Typography sx={{ fontSize: '20px' }} >Survey Link</Typography>
        </Box>
        <Box sx={{ padding: '15px', textAlign: 'center' }} >
          <Typography
            sx={{ color: colorPalette.fsGray, fontSize: '16', marginBottom: '10px' }} >
            Share this link with anyone you want and start getting responses to your survey.
          </Typography>
          <Box>
            <Box>
              <Select
                sx={{ width: '300px' }}
                value={company}
                onChange={(e) => {setCompany(e.target.value);setPerson('')}}
                displayEmpty
                size='small'
              >
                <MenuItem value='' disabled >Select Company</MenuItem>
                {companiesState.map(c => <MenuItem value={c.id} >{c.name}</MenuItem>)}
              </Select>
            </Box>
            <Box>
              <Select 
                sx={{ width: '300px', marginTop: '10px' }} 
                value={person} 
                displayEmpty 
                size='small'
                onChange={(e) => setPerson(e.target.value)}
              >
                <MenuItem value='' disabled >Select Person</MenuItem>
                {peopleOptions.map(p => p?.company?.id === company && <MenuItem value={p?.id} >{getPersonName(p)}</MenuItem>)}
              </Select>
            </Box>
            <Box>
              <Button
                disabled={person == null || person?.length < 1}
                startIcon={<ContentCopyIcon />}
                size='small'
                sx={{ ...ButtonStyles.containedButton, width: '300px' }}
                onClick={handleCopyButton}
              >
                Copy Survey Link
              </Button>
            </Box>
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