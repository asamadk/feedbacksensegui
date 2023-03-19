import { Box, Typography } from '@mui/material'
import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'
import * as LayoutStyles from '../Styles/LayoutStyles'

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

function SurveySettingsWeb() {
    return (
        <Box sx={LayoutStyles.globalSettingSubContainers} >
            <Box textAlign={'start'} >
                <Typography color={'#f1f1f1'} sx={{ marginBottom: '5px' }} >Install FeedbackSense on your own </Typography>
                <Typography color={'#454545'} sx={{ marginBottom: '10px' }} >
                    Add the FeedbackSense snippet using one of the methods below so you can start collecting website and in-product surveys feedback.
                </Typography>
                <Box >
                <CopyBlock
                    text={integrationCode}
                    language={'html'}
                    theme={dracula}
                    codeBlock
                />
                </Box>
            </Box>
        </Box>
    )
}

export default SurveySettingsWeb