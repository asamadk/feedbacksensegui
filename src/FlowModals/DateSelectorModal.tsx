import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, Select, Slider, styled, TextField, Typography } from '@mui/material';
import { getColorsFromTheme, getCompConfigFromUiId } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#006DFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006DFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006DFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006DFF',
    },
  },
  color: 'white'
});

function DateSelectorModal(props: any) {

  useEffect(() => {
    populateCompConfig();
  }, [props.uiId]);

  const [background, setBackground] = useState<any>();
  const [question, setQuestion] = useState('');

  const populateCompConfig = () => {
    const compConfig = getCompConfigFromUiId(props);
    setQuestion(compConfig?.question || '');
    if(props.theme != null){
      const currentTheme = JSON.parse(props.theme);
      setBackground(currentTheme.background);
    }
  }

  const handleSave = () => {
    let obj = {
      question: question,
    }

    if (verifyComponent() === false) {
      return;
    }

    props.save(JSON.stringify(obj));
  }

  const verifyComponent = (): Boolean => {
    return true;
  }

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyles.modalStyleComponents}>
          <Box width={'40%'} marginRight={10} >
            <Box sx={ModalStyles.modalHeaderStyle} >
              <Typography id="modal-modal-title" variant="h5" component="h2">
                {props.header}
              </Typography>
              <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                <CloseIcon onClick={props.close} />
              </IconButton>
            </Box>

            <Box sx={ModalStyles.modalBodyContainerStyle} >
              <CssTextField
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Enter your question here'
                variant="outlined"
                size={'small'}
                value={question}
                style={{ width: '100%' }}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Box>

            <Box sx={ModalStyles.modalButtonContainerStyle} >
              <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
              <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
            </Box>
          </Box>
          <Box className={background?.value} sx={{ backgroundColor: '#ffffff', width: '55%' }} >
            <DynamicComponentDisplay
              theme={props.theme}
              data={{
                question: question,
              }}
              compId={props.compId}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DateSelectorModal