import { Box, Button, IconButton, Modal, TextField, Typography, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import * as Types from '../Utils/types'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { useSelector } from 'react-redux';
import { useMemo, useState } from 'react';

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

function GenericModal(props: any) {

    const defaultColor = useSelector((state: any) => state.colorReducer);
    let payload: Types.genericModalData = props.payload;

    const handleSuccessButtonClick = () => {
        props.callback();
    }

    const [validVal, setValidVal] = useState('');
    const [proceed, setProceed] = useState(false);

    useMemo(() => {
        if (validVal === 'continue') {
            setProceed(true);
        } else {
            setProceed(false);
        }
    }, [validVal]);

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            {payload?.header}
                        </Typography>
                        <IconButton onClick={props.close} sx={{ color: '#f1f1f1' }} >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ marginTop: '20px', marginBottom: '20px' }} >
                        {payload?.warning != null && <Typography
                            sx={{ fontSize: '16px', color: '#454545' }} >
                            {payload?.warning}
                        </Typography>}

                        <Typography>{payload?.description.split('|')[0]}</Typography>
                        <Typography>{payload?.description.split('|')[1]}</Typography>

                    </Box>

                    <Box>
                        {
                            props.dualConfirmation === true &&
                            <CssTextField
                                sx={{ input: { color: 'white' }, marginTop: '10px' }}
                                id="outlined-basic"
                                placeholder='Type "continue" to proceed'
                                variant="outlined"
                                size={'small'}
                                style={{ width: '100%' }}
                                value={validVal}
                                onChange={(e) => setValidVal(e.target.value)}
                            />
                        }
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={ButtonStyles.outlinedButton}
                            onClick={props.close}
                            variant="contained">
                            {payload?.cancelButtonText}
                        </Button>
                        <Button
                            style={{ width: 'fit-content' }}
                            sx={ButtonStyles.containedButton}
                            variant="contained"
                            onClick={handleSuccessButtonClick}
                            disabled={props.dualConfirmation && !proceed}
                        >
                            {payload?.successButtonText}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default GenericModal