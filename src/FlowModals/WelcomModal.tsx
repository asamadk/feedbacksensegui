import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { getColorsFromTheme, getCompConfigFromUiId } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { componentName } from '../Utils/Constants';
import { userRoleType } from '../Utils/types';

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

function WelcomModal(props: any) {

    useEffect(() => {
        populateCompConfig();
    }, [props.uiId]);

    const [background, setBackground] = useState<any>();
    const [welcomeText, setWelcomeText] = React.useState('');
    const [buttonText, setButtonText] = React.useState('');
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);

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
                <Box sx={ModalStyles.modalStyleComponents(defaultColor?.secondaryColor)}>
                    <Box width={'40%'} marginRight={10} >
                        <Box sx={ModalStyles.modalHeaderStyle} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                {props.header}
                            </Typography>
                            <IconButton sx={{ color: '#f1f1f1' }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>
                        <ModalSnippets text={'To make changes, please unpublish the workflow'} published={props.isPublished} />
                        <ModalSnippets 
                            text={'Guest cannot edit the surveys'} 
                            published={!CoreUtils.isComponentVisible(userRole,componentName.SAVE_SURVEY_BUTTON)} 
                        />
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