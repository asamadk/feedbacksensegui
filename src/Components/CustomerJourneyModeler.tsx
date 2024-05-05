import { Box, Button, Checkbox, IconButton, Switch, TextField, Typography, styled } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colorPalette } from '../Utils/Constants'
import { globalSettingSubContainers } from '../Styles/LayoutStyles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { getLineChartColor, handleUnAuth } from '../Utils/FeedbackUtils';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { textFieldStyle } from '../Styles/InputStyles';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import axios from 'axios';
import { createJourneyStageURL, createJourneySubStageURL, getJourneyStageURL, getJourneySubStageURL } from '../Utils/Endpoints';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setGlobalStages } from '../Redux/Reducers/journeyStageReducer';
import { setGlobalSubStages } from '../Redux/Reducers/journeySubStageReducer';
import { stageContainer } from '../Styles/TableStyle';

const CssTextField = styled(TextField)(textFieldStyle);

function CustomerJourneyModeler(props: { backClick: any, type: 'stage' | 'sub-stage' }) {

    const snackbarRef: any = useRef(null);
    const dispatch = useDispatch();

    const globalStage = useSelector((state: any) => state.stage);
    const globalSubStage = useSelector((state: any) => state.subStage);
    
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [stages, setStages] = useState<any[]>([]);

    let init = false;
    useEffect(() => {
        if(init === false){
            if (props.type === 'stage') {
                fetchStages();
            } else {
                fetchSubStages();
            }
            init = true;
        }
    }, [props.type]);

    async function fetchStages() {
        try {
            setLoading(true);
            if(globalStage != null && globalStage.length > 0){
                setStages(globalStage);
            }else{
                const { data } = await axios.get(getJourneyStageURL(), { withCredentials: true });
                if(data.data){
                    setStages(data.data);
                    dispatch(setGlobalStages(data.data));
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    async function fetchSubStages() {
        try {
            setLoading(true);
            if(globalSubStage != null && globalSubStage.length > 0){
                setStages(globalSubStage);
            }else{
                const { data } = await axios.get(getJourneySubStageURL(), { withCredentials: true });
                if(data.data){
                    setStages(data.data);
                    dispatch(setGlobalSubStages(data.data));
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    

    const handleDragStart = (e: any, index: any) => {
        e.dataTransfer.setData('index', index.toString());
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (e: any, targetIndex: any) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData('index'));
        const draggedItem = stages[draggedIndex];
        const updatedStages = [...stages];
        updatedStages.splice(draggedIndex, 1);
        updatedStages.splice(targetIndex, 0, draggedItem);
        setStages(updatedStages);
    };

    function handleEndChange(stageId: string) {
        setStages(stages.map(stage => {
            if (stage.id === stageId) {
                stage.isEnd = !stage.isEnd
            }
            return stage;
        }));
    }

    function handleEnabledChange(stageId: string) {
        setStages(stages.map(stage => {
            if (stage.id === stageId) {
                stage.isEnabled = !stage.isEnabled
            }
            return stage;
        }));
    }

    function handleStageNameChange(stageId: string, val: string) {
        setStages(stages.map(stage => {
            if (stage.id === stageId) {
                stage.name = val
            }
            return stage;
        }));
    }

    async function handleSave() {
        const finalSave: any[] = [];
        stages.forEach((stage, index) => {
            finalSave.push({ ...stage, position: index })
        })
        if (!validateSaveResult(finalSave)) {
            return;
        }
        try {
            setLoading(true);
            const URL = props.type === 'stage' ? createJourneyStageURL() : createJourneySubStageURL();
            await axios.post(URL, finalSave, { withCredentials: true });
            snackbarRef?.current?.show('Journey Saved', 'success');
            setLoading(false);
        } catch (error: any) {
            console.log("🚀 ~ handleSave ~ error:", error)
            snackbarRef?.current?.show('Something went wrong', 'error');
            setLoading(false);
            handleUnAuth(error);
        }
        setEditMode(false);
        if(props.type === 'stage'){
            dispatch(setGlobalStages(finalSave));
        }else{
            dispatch(setGlobalSubStages(finalSave));
        }
    }

    function validateSaveResult(finalSave: any[]): boolean {
        let hasEnd = false;
        let hasEnabled = false
        let hasName = true;

        for (let i = 0; i < finalSave.length; i++) {
            const data = finalSave[i];
            if (data.isEnd === true && data.isEnabled === true) { hasEnd = true; }
            if (data.isEnabled === true) { hasEnabled = true; }
            if (data.name?.length < 1) { hasName = false }
        }

        if (hasName === false) {
            snackbarRef?.current?.show('Please provide a stage name', 'warning');
            return false;
        }

        if (hasEnd === false) {
            snackbarRef?.current?.show('At least one enabled stage should be marked as \'End\'', 'error');
            return false;
        }

        if (hasEnabled === false) {
            snackbarRef?.current?.show('At least one stage should be enabled', 'error');
            return false;
        }
        return true;
    }

    function addStages() {
        const newStage = { id: stages.length, name: '', position: stages.length, isEnabled: true, isEnd: false };
        setStages([...stages, newStage]);
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box display={'flex'}>
                    <IconButton onClick={props.backClick}  >
                        <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
                    </IconButton>
                    <Typography variant='h6' marginTop={'4px'} >
                        {props.type === 'stage' ? 'Custom Journey Stage' : 'Onboarding Stage'}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 120px)', textAlign: 'start', overflowY: 'scroll' }} >
                <Typography fontSize={'13px'} >
                    {
                        props.type === 'stage' ? 'Customize Customer Journey Stage Labels, Stages & more' : 'Customize Onboarding stages'
                    }
                </Typography>
                <Box marginTop={'20px'} >
                    <div style={containerStyle}>
                        <Box sx={{ display: 'flex', marginTop: '5px' }} >
                            <Box >
                                <Typography fontWeight={600} >{props.type === 'stage' ? 'Stage Name' : 'Sub-Stage Name'}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex' }} >
                            <Typography fontWeight={600} >Enabled</Typography>
                            <Typography fontWeight={600} marginLeft={'20px'}>End</Typography>
                            {/* <Typography fontWeight={600} marginLeft={'20px'}>Remove</Typography> */}
                        </Box>
                    </div>
                    {stages.map((stage, index) => (
                        <div
                            style={containerStyle}
                            key={stage.id}
                            draggable={editMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <Box sx={{ display: 'flex', marginTop: '5px' }} >
                                {
                                    editMode &&
                                    <DragIndicatorIcon sx={{ color: colorPalette.fsGray, cursor: 'grab', marginTop: '5px' }} />
                                }
                                {
                                    !editMode &&
                                    <Box sx={stageContainer(stage.position)} >
                                        <Typography fontSize={'13px'} >{stage.name}</Typography>
                                    </Box>

                                }
                                {
                                    editMode &&
                                    <CssTextField
                                        size='small'
                                        value={stage.name}
                                        onChange={(e) => handleStageNameChange(stage.id, e.target.value)}
                                    />
                                }
                            </Box>
                            <Box sx={{ display: 'flex' }} >
                                <Switch
                                    color='secondary'
                                    disabled={!editMode}
                                    checked={stage?.isEnabled}
                                    onChange={() => handleEnabledChange(stage.id)}
                                />
                                <Checkbox
                                    color='secondary'
                                    disabled={!editMode}
                                    checked={stage.isEnd}
                                    onChange={() => handleEndChange(stage.id)}
                                />
                                {/* <IconButton><RemoveCircleIcon/></IconButton> */}
                            </Box>
                        </div>
                    ))}
                    {
                        editMode &&
                        <div
                            style={{ ...containerStyle, justifyContent: 'center', cursor: 'pointer', background: colorPalette.secondary }}
                            onClick={addStages}
                        >
                            <Typography
                                sx={{ color: colorPalette.primary }}
                            >
                                + Create {props.type === 'stage' ? 'Stage' : 'Sub-Stage'}
                            </Typography>
                        </div>
                    }
                </Box>

                <Box sx={{ textAlign: 'end', width: '50%' }} >
                    {
                        !editMode &&
                        <Button
                            sx={{ ...containedButton, width: 'fit-content' }}
                            size='small'
                            onClick={() => setEditMode(true)}
                        >Edit</Button>
                    }
                    {
                        editMode &&
                        <>
                            <Button
                                onClick={handleSave}
                                sx={{ ...containedButton, width: 'fit-content' }}
                                size='small'
                            >Save</Button>
                            <Button
                                sx={{ ...outlinedButton, width: 'fit-content', marginLeft: '5px' }}
                                size='small'
                                onClick={() => setEditMode(false)}
                            >Cancel</Button>
                        </>
                    }
                </Box>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    );
}


export default CustomerJourneyModeler

const containerStyle = {
    border: `1px ${colorPalette.textSecondary} solid`,
    width: '50%',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
}
