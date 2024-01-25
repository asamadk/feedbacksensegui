import { Box, Button, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as LayoutStyles from '../Styles/LayoutStyles'
import { useSelector } from 'react-redux';
import { containedButton } from '../Styles/ButtonStyle';
import styled from '@emotion/styled';
import { handleLogout, validateLogoImageFile } from '../Utils/FeedbackUtils';
import CancelIcon from '@mui/icons-material/Cancel';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useEffect, useRef, useState } from 'react';
import UpgradePlanError from './UpgradePlanError';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { genericModalData, userRoleType } from '../Utils/types';
import { USER_UNAUTH_TEXT, colorPalette, componentName } from '../Utils/Constants';
import axios from 'axios';
import { deleteLogoAPI, getLogoAPI, uploadLogoAPI } from '../Utils/Endpoints';
import GenericModal from '../Modals/GenericModal';
import { REMOVE_FEEDBACK_SENSE_LOGO } from '../Utils/CustomSettingsConst';


function SurveyGeneralSettings() {

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const settings = useSelector((state: any) => state.settings);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const snackbarRef: any = useRef(null);
    
    const [genericModalObj, setGenericModalObj] = useState<genericModalData>();
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState<string>();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showGenericModal, setShowGenericModal] = useState(false);

    let init = false;

    useEffect(() => {
        if (init === false) {
            handleVisibility();
            init = true;
        }
    }, []);

    const getLogo = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getLogoAPI(), { withCredentials: true });
            setImageData(data?.data?.logoData)
            setLoading(false);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleVisibility = () => {
        if(settings != null && settings[REMOVE_FEEDBACK_SENSE_LOGO] === 'true'){
            getLogo();
        }else{
            setShowUpgrade(true);
        }
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        if (file == null) { return; }
        const validity = validateLogoImageFile(file);
        if (validity != null) {
            snackbarRef?.current?.show(validity, 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const logoData = e.target.result;
            uploadLogo(logoData);
        };
        reader.readAsDataURL(file);
    }

    const uploadLogo = async (logoData: string) => {
        try {
            setLoading(true);
            const { data } = await axios.post(uploadLogoAPI(), { logoData: logoData }, { withCredentials: true });
            setLoading(false);
            setImageData(logoData);
            snackbarRef?.current?.show(data?.message, 'success');
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleRemoveLogo = async () => {
        try {
            setLoading(true);
            const { data } = await axios.delete(deleteLogoAPI(), { withCredentials: true });
            setLoading(false);
            setImageData('');
            snackbarRef?.current?.show(data?.message, 'success');
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleRemoveModal = () => {
        setShowGenericModal(true);
        let genDeleteObj: genericModalData = {
            header: 'Do you really want to remove this logo?',
            warning: 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText: 'Remove',
            cancelButtonText: 'Cancel',
            description: 'The logo will be removed permanently.',
            type: 'delete',
        }
        setGenericModalObj(genDeleteObj);
    }

    const showUpgradeScreen = () => {
        return (
            showUpgrade && <>
                <Box width={'100%'} >
                    <Box padding={'20px'} >
                        <UpgradePlanError
                            message='Upgrade to upload logo'
                            desc='Upload your own logo to make your surveys look like yours.'
                            showButton={true}
                        />
                    </Box>
                </Box>
            </>
        )
    }

    const showUploadLogoScreen = () => {
        return (
            !showUpgrade && CoreUtils.isComponentVisible(userRole, componentName.UPLOAD_LOGO) && <>
                <Box sx={{ display: 'flex' }} >
                    <Box>
                        <Typography color={colorPalette.darkBackground} sx={{ marginBottom: '10px' }} >Company Logo</Typography>
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                            sx={containedButton}
                        >
                            Upload file
                            <VisuallyHiddenInput onChange={handleFileUpload} type="file" />
                        </Button>
                    </Box>
                    {imageData &&
                        <Box marginLeft={'30px'} >
                            <Box sx={{ position: 'relative', cursor: 'pointer' }} >
                                <Box sx={{ position: 'absolute', right: -5, top: -5 }} >
                                    <CancelIcon onClick={handleRemoveModal} sx={{ color: colorPalette.primary }} />
                                </Box>
                            </Box>
                            <img style={{ height: '100px', borderRadius: '6px' }} src={imageData} alt="Uploaded Preview" />
                        </Box>}
                </Box>
            </>
        )
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'delete') {
            handleRemoveLogo();
        }
    }

    return (
        <Box style={{ display: 'flex' }} sx={LayoutStyles.globalSettingSubContainers(colorPalette.background)} >
            {showUpgradeScreen()}
            {showUploadLogoScreen()}
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
                dualConfirmation={true}
            />
        </Box>
    )
}

export default SurveyGeneralSettings