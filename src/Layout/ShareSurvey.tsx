import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as Constants from '../Utils/Constants';
import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'
import { styled } from '@mui/system';
import { getShareSurveyLink } from '../Utils/Endpoints';
import { useParams } from 'react-router';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#f3d503',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#f3d503',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#f3d503',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#f3d503',
    },
  },
  color: 'white'
});

let integrationCode = `<!-- Start of feedbacksense (www.feedbacksense.com) code -->
<script type='text/javascript'>
  (function(w) {
    var s = document.createElement('script');
    s.src = 'https://survey.feedbacksense.com/workspaces/157f91aad7e5b61aa98998be8d742a79/web_surveys.js';
    s.async = true;
    var e = document.getElementsByTagName('script')[0];
    e.parentNode.insertBefore(s, e);
  })(window);
</script>
<!-- End of feedbacksense code -->`;

function ShareSurvey() {

  const { surveyId } = useParams();

  const [surveyType, setSurveyType] = React.useState<string>(Constants.EMAIL_LINK_SURVEY_TYPE);
  const [headerText, setHeaderText] = React.useState('Survey Link');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (surveyType.toLowerCase() === Constants.EMAIL_LINK_SURVEY_TYPE) {
      setHeaderText('Survey Link');
    } else if (surveyType.toLowerCase() === Constants.APP_WEB_SURVEY_TYPE) {
      setHeaderText('Install FeedbackSense');
    }
  })

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCopyButton = () => {
    setOpen(true);
    navigator.clipboard.writeText(getShareSurveyLink(window.location.host,surveyId));
  }

  return (
    <Box sx={{ height: 'calc(100vh - 70px)', overflowY: 'hidden', padding: '50px 30px' }} >
      <Box sx={{ border: '1px #454545 solid', borderRadius: '5px',backgroundColor: '#1A1A1A' }} >
        <Box sx={{ textAlign: 'start', padding: '15px', borderBottom: '1px #454545 solid' }} >
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px' }} >{headerText}</Typography>
        </Box>


        {/* for link or email survey */}
        {surveyType.toLowerCase() === Constants.EMAIL_LINK_SURVEY_TYPE &&
          <Box sx={{ padding: '20px', textAlign: 'start' }} >
            <Typography sx={{ color: '#454545', fontSize: '16' }} >Share this link with anyone you want and start getting responses to your survey.</Typography>
            <Box sx={{ display: 'flex' }} >
              <Button onClick={handleCopyButton} style={{ width: 'fit-content', marginTop: '0px', marginRight: '10px' }} sx={ButtonStyles.containedButton} variant="contained">Copy survey link</Button>
              <CssTextField
                size='small'
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                value={getShareSurveyLink(window.location.host,surveyId)}
                variant="outlined"
                style={{ width: '60%' }}
              />
            </Box>
          </Box>}

        
        {/* for app or in product survey */}
        {surveyType.toLowerCase() === Constants.APP_WEB_SURVEY_TYPE &&
          <Box sx={{ padding: '20px', textAlign: 'start' }} >
            <Typography sx={{ color: '#454545', fontSize: '16' }} >{'1. Paste this code into the <head> of every page you want to run surveys on. Paste the code before the </body> tag.'}</Typography>
            <CopyBlock
                    text={integrationCode}
                    language={'html'}
                    theme={dracula}
                    codeBlock
                />
            <Typography sx={{ color: '#454545', fontSize: '16' }} >{'2. Once the code has been installed, visit the page on which you installed the code. The first visit you get after the code has been installed will let us verify installation.'}</Typography>
            <Typography sx={{ color: '#454545', fontSize: '16' }} >{'3. If you’re sure you’ve had a visit since the code’s been installed, hit "Verify installation"'}</Typography>
            <Button onClick={handleCopyButton} style={{ width: 'fit-content', marginTop: '30px', marginRight: '10px' }} sx={ButtonStyles.containedButton} variant="contained">Verify installation</Button>
    
          </Box>}


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