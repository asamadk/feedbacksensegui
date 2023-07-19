import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
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

function WelcomModal(props: any) {

    useEffect(() => {
        populateCompConfig();
    }, [props.uiId]);

    const [background, setBackground] = useState<any>();
    const [welcomeText, setWelcomeText] = React.useState('');
    const [buttonText, setButtonText] = React.useState('');

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        setWelcomeText(compConfig?.welcomeText || '');
        setButtonText(compConfig?.buttonText || '');

        if (props.theme != null) {
            const currentTheme = JSON.parse(props.theme);
            setBackground(currentTheme.background);
        }
    }

    const handleSave = () => {
        let obj = {
            welcomeText: welcomeText,
            buttonText: buttonText
        }

        props.save(JSON.stringify(obj));
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
                            <IconButton color='info' sx={{ color: '#f1f1f1' }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>
                        <Box sx={ModalStyles.modalBodyContainerStyle} >
                            <CssTextField
                                sx={{ input: { color: 'white' }, maxHeight: '50vh' }}
                                id="outlined-basic"
                                placeholder='Enter your message here.'
                                variant="outlined"
                                size={'small'}
                                value={welcomeText}
                                multiline
                                style={{ width: '100%' }}
                                onChange={(e) => setWelcomeText(e.target.value)}
                            />
                        </Box>
                        <Box sx={ModalStyles.modalBodyContainerStyle} >
                            <Box sx={{ marginTop: '10px', marginBottom: '10px' }} />
                            <CssTextField
                                sx={{ input: { color: 'white' } }}
                                id="outlined-basic"
                                placeholder='Button label.'
                                variant="outlined"
                                size={'small'}
                                value={buttonText}
                                style={{ width: '100%' }}
                                onChange={(e) => setButtonText(e.target.value)}
                            />
                            <Box sx={ModalStyles.modalButtonContainerStyle} >
                                <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                                <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box className={background?.value} sx={{ backgroundColor: '#ffffff', width: '55%' }} >
                        <DynamicComponentDisplay
                            data={{ welcomeText: welcomeText, buttonText: buttonText }}
                            compId={props.compId}
                            theme={props.theme}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default WelcomModal;