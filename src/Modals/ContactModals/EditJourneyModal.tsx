import React, { useRef, useState } from 'react'
import { Autocomplete, Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, createFilterOptions, styled } from '@mui/material'
import Notification from '../../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import CloseIcon from '@mui/icons-material/Close';
import { colorPalette } from '../../Utils/Constants';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { useSelector } from 'react-redux';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { updateCompanyJourneyURL } from '../../Utils/Endpoints';

function EditJourneyModal(props: { companyId: string, open: boolean, close: any, value: string,field :string }) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);

    const globalStage = useSelector((state: any) => state.stage);
    const globalOnboardingStage = useSelector((state: any) => state.subStage);
    const globalRiskStage = useSelector((state: any) => state.riskStage);

    const [stageVal, setStageVal] = useState<string>(props.value);

    const handleClose = () => {
        props.close({ refresh: false });
    }

    async function updateCompanyStage() {
        try {
            setLoading(true);
            const payload = {
                companyId: props.companyId,
                journey: stageVal,
                type : props.field
            }
            await axios.post(updateCompanyJourneyURL(), payload, { withCredentials: true });
            handleClose();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modalStyle(colorPalette.background), width: '30%' }}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                Update Journey
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <Select
                            size='small'
                            fullWidth
                            value={stageVal}
                            onChange={(e) => setStageVal(e.target.value)}
                        >
                            <MenuItem value={'None'} >None</MenuItem>
                            {
                                props.field === 'Journey Stage' &&
                                globalStage?.map((stage: any) =>
                                    stage?.isEnabled === true &&
                                    <MenuItem value={stage.id} >{stage.name}</MenuItem>
                                )
                            }
                            {
                                props.field === 'Onboarding' &&
                                globalOnboardingStage?.map((stage: any) =>
                                    stage?.isEnabled === true &&
                                    <MenuItem value={stage.id} >{stage.name}</MenuItem>
                                )
                            }
                            {
                                props.field === 'Risk' &&
                                globalRiskStage?.map((stage: any) =>
                                    stage?.isEnabled === true &&
                                    <MenuItem value={stage.id} >{stage.name}</MenuItem>
                                )
                            }
                        </Select>
                    </Box>

                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={handleClose}
                            variant="contained"
                        >Cancel</Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={updateCompanyStage}
                        >
                            Save
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default EditJourneyModal