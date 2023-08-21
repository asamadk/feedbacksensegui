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

function RatingScale(props: any) {

  useEffect(() => {
    populateCompConfig();
  }, [props.uiId]);

  const [question, setQuestion] = useState('');
  const [range, setRange] = useState(1);
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [background, setBackground] = useState<any>();

  const populateCompConfig = () => {
    const compConfig = getCompConfigFromUiId(props);
    setQuestion(compConfig?.question || '');
    setLeftText(compConfig?.leftText || '');
    setRightText(compConfig?.rightText || '');
    setRange(compConfig?.range || 1);
    if(props.theme != null){
      const currentTheme = JSON.parse(props.theme);
      setBackground(currentTheme.background);
  }
  }

  const handleSave = () => {
    let obj = {
      question: question,
      leftText: leftText,
      rightText: rightText,
      range: range
    }

    if (verifyComponent() === false) {
      return;
    }

    props.save(JSON.stringify(obj));
  }

  const verifyComponent = (): Boolean => {
    return true;
  }

  const handleSilderChange = (e: any) => {
    let range = e.target.value;
    setRange(range);
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
              <IconButton sx={{ color: '#f1f1f1' }} >
                <CloseIcon onClick={props.close} />
              </IconButton>
            </Box>

            <Box sx={ModalStyles.modalBodyContainerStyle} >
              <CssTextField
                sx={{ input: { color: 'white' },maxHeight : '50vh'  }}
                id="outlined-basic"
                placeholder='Enter your question here'
                variant="outlined"
                size={'small'}
                multiline
                value={question}
                style={{ width: '100%' }}
                onChange={(e) => setQuestion(e.target.value)}
              />


            </Box>

            <Box>
              <Box sx={{ marginTop: '10px' }} >
                <Typography color={'#454545'} >Select range</Typography>
                <Slider onChange={handleSilderChange} sx={{ width: '95%', marginLeft: '10px' }} value={range} valueLabelDisplay="auto" step={1} marks min={3} max={7} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }} >
              <CssTextField
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Text on the very left'
                variant="outlined"
                size={'small'}
                value={leftText}
                onChange={(e) => setLeftText(e.target.value)}
              />
              <CssTextField
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Text on the very right'
                variant="outlined"
                size={'small'}
                value={rightText}
                onChange={(e) => setRightText(e.target.value)}
              />
            </Box>

            <Box sx={ModalStyles.modalButtonContainerStyle} >
              <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
              <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
            </Box>
          </Box>
          <Box className={background?.value} sx={{ backgroundColor: '#ffffff', width: '55%' }} >
            <DynamicComponentDisplay
              data={{
                question: question,
                leftText: leftText,
                rightText: rightText,
                range: range
              }}
              theme={props.theme}
              compId={props.compId}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default RatingScale