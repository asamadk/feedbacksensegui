import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import * as Types from '../Utils/types'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'

function GenericModal(props: any) {

    let payload: Types.genericModalData = props.payload;

    const handleSuccessButtonClick = () => {
        props.callback();
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
                            {payload?.header}
                        </Typography>
                        <IconButton onClick={props.close} color='info' sx={{ color: '#f1f1f1' }} >
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