import { Alert, Box, Button, Checkbox, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useRef, useState } from 'react'
import { styled } from '@mui/system';
import { BASE_URL, getShareSurveyLink } from '../Utils/Endpoints';
import { useParams } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from "react-qr-code";
import { useSelector } from 'react-redux';
import { CopyBlock} from 'react-code-blocks';
import { textFieldStyle } from '../Styles/InputStyles';
import { colorPalette } from '../Utils/Constants';
import { tableBodyText, tableCellStyle,tableContainerStyle } from '../Styles/TableStyle';

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

  const col = ['Person\'s Name','Company Name','Action'];
  const [open, setOpen] = React.useState(false);
  
  const peopleOptions = useSelector((state: any) => state.people);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCopyButton = (personId : string) => {
    setOpen(true);
    navigator.clipboard.writeText(getShareSurveyLink(window.location.host, surveyId,personId));
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
    <Box sx={{ overflowY: 'scroll', padding: '50px 30px',background : colorPalette.textSecondary }} >
      <Box sx={{ padding: '20px' }} >
                <TableContainer
                    className='person-table-container'
                    sx={{ ...tableContainerStyle, height: 'calc(100vh - 195px)' }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                {col?.map((column: string) => (
                                    <TableCell sx={{ ...tableCellStyle,fontWeight: '600' }} key={column}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {
                                peopleOptions?.map((person : any) => (
                                    <TableRow key={person.id} >
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={tableBodyText} >{`${person.firstName} ${person.lastName}`}</Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={{...tableBodyText,color : colorPalette.primary,fontWeight : 600}} >
                                              {person.company.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Button
                                              size='small'
                                              onClick={() => handleCopyButton(person.id)}
                                              sx={{...ButtonStyles.outlinedButton,width : 'fit-content'}}
                                            >Copy Link</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
      {/* <Box sx={{ borderRadius: '5px', backgroundColor: colorPalette.background,boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }} >
        <Box sx={{ textAlign: 'start', padding: '15px' }} >
          <Typography sx={{ color: colorPalette.darkBackground, fontSize: '20px' }} >Survey Link</Typography>
        </Box>
        <Box sx={{ padding: '20px', textAlign: 'start' }} >
          <Typography sx={{ color: colorPalette.fsGray, fontSize: '16', marginBottom: '10px' }} >Share this link with anyone you want and start getting responses to your survey.</Typography>
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
              sx={{ input: { color: colorPalette.darkBackground } }}
              id="outlined-basic"
              value={getShareSurveyLink(window.location.host, surveyId)}
              variant="outlined"
              style={{ width: '60%' }}
            />
          </Box>
        </Box>
      </Box> */}

      {/* <Box sx={{ borderRadius: '5px', backgroundColor: colorPalette.background, marginTop: '20px',boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }} >
        <Box sx={{ textAlign: 'start', padding: '15px'}} >
          <Typography sx={{ color: colorPalette.darkBackground, fontSize: '20px' }} >Embed</Typography>
        </Box>
        <Box sx={{ padding: '20px', textAlign: 'center' }} >
          <Typography sx={{ color: colorPalette.fsGray, fontSize: '16', marginBottom: '10px', textAlign: 'start' }} >
            Copy & Paste the code before the body tag.
          </Typography>
        </Box>
        <Box>
          <Box>
            <CopyBlock
              text={integrationCode}
              language={'html'}
              theme={'light'}
              codeBlock
              wrapLines
            />
          </Box>
        </Box>
      </Box> */}

      {/* qr code */}
      {/* <Box sx={{ borderRadius: '5px', backgroundColor: colorPalette.background, marginTop: '20px',boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }} >
        <Box sx={{ textAlign: 'start', padding: '15px'}} >
          <Typography sx={{ color: colorPalette.darkBackground, fontSize: '20px' }} >QR Code</Typography>
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
      </Box> */}

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Link Copied!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ShareSurvey