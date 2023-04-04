import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, Select, Slider, styled, TextField, Typography } from '@mui/material';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FFA500',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFA500',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  color: 'white'
});

function DateSelectorModal(props: any) {
  const [question, setQuestion] = useState('');

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
        <Box sx={ModalStyles.modalStyle}>
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
      </Modal>
    </>
  )
}

export default DateSelectorModal