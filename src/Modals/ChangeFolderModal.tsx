import { Button, IconButton, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import * as InputStyles from '../Styles/InputStyles';
import React, { useEffect } from 'react'
import { getOrgId } from '../Utils/FeedbackUtils';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import * as Endpoints from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../Components/FSLoader';

function ChangeFolderModal(props: any) {

    const [folderList, setFolderList] = React.useState<any[]>([]);
    const [selectedFolder, setSelectedFolder] = React.useState<string>('0');
    const [ loading , setLoading] = React.useState(false);


    useEffect(() => {
        getFolders();
    },[]);

    const getFolders = async () => {
        let orgId = getOrgId();
        if (orgId == null) {
            //TODO show error
        }

        setLoading(true);
        let folderRes = await axios.get(Endpoints.getFolders(orgId));
        setLoading(false);

        const isValidated = FeedbackUtils.validateAPIResponse(folderRes);
        if (isValidated === false) {
            //something went wrong
            return;
        }

        let resData: any = folderRes.data;
        if (resData == null) {
            return;
        }

        if(resData.statusCode !== 200){
            //TODO show error
            return;
        }

        setFolderList(resData.data);
    }

    const handleFolderChange = async () => {
        if(selectedFolder === '0'){
            //TODO show error
            return;
        }
        let surveyId = props.surveyId;

        setLoading(true);
        let { data } = await axios.post(Endpoints.moveSurveyFolder(surveyId,selectedFolder));
        setLoading(false);

        if(FeedbackUtils.validateAPIResponse(data) === false){
            //TODO show error
            return;
        }

        let surveyData = data.data;
        console.log('Survey data',surveyData);
        props.callback(surveyData);
        props.close();
    }

    const handleDropdownChange = (event : any) => {
        let tempSearchText: string = event.target.value;
        setSelectedFolder(tempSearchText);
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
                            Move to folder
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Select 
                        onChange={handleDropdownChange} 
                        sx={InputStyles.muiSelectStyle} 
                        style={{width : '100%'}} 
                        value={selectedFolder} 
                        size='small'
                    >
                        <MenuItem value={'0'}>Select a folder</MenuItem>
                        {folderList.map(folder => {
                            return(<MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>)
                        })}
                    </Select>
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} onClick={handleFolderChange} sx={ButtonStyles.containedButton} variant="contained">Move to folder</Button>
                    </Box>
                </Box>
            </Modal>
            <FSLoader show={loading} />
        </>
    )
}

export default ChangeFolderModal