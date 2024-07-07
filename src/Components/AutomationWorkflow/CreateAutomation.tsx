import { Box, Button, IconButton, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import FSLoader from '../FSLoader'
import Notification from '../../Utils/Notification'
import { useDispatch } from 'react-redux';
import { colorPalette } from '../../Utils/Constants';
import { localSurveyNavbar } from '../../Styles/LayoutStyles';
import { iconStyle } from '../../Layout/CreateSurvey';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { textFieldStyle } from '../../Styles/InputStyles';
import { containedButton, getOutlinedButtonBG } from '../../Styles/ButtonStyle';
import DoneIcon from '@mui/icons-material/Done';
import FeedbackCanvas from '../../FlowComponents/FeedbackCanvas';
import FeedbackComponentList from '../../FlowComponents/FeedbackComponentList';
import DynamicComponentModal from '../../FlowComponents/DynamicComponentModal';
import { updateWorkflowDirty } from '../../Redux/Actions/workflowDirtyActions';
import { updateWorkflowCheck } from '../../Redux/Actions/workflowCheckActions';
import { getComponentConfigFromNode, handleUnAuth, validateComponentLogic, validateFlowComponent } from '../../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import GenericModal from '../../Modals/GenericModal';
import { genericModalData, surveyFlowType } from '../../Utils/types';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import AutomationComponentList from '../../FlowComponents/AutomationComponentList';
import { setLoader } from '../../Redux/Reducers/LoadingReducer';
import { endpoints } from '../../Utils/Endpoints';
import { showNotification } from '../../Redux/Reducers/NotificationReducer';

const CssTextField = styled(TextField)(textFieldStyle);

function CreateAutomation() {

    const { flowId } = useParams();

    const snackbarRef: any = useRef(null);
    const dispatch = useDispatch<any>();
    const childRef = useRef<any>(null);
    const navigate = useNavigate();

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [loading, setLoading] = React.useState(false);
    const [flowDetail, setFlowDetail] = React.useState<any>();
    const [showFlowName, setShowFlowName] = React.useState(true);
    const [isWorkflowPublished, setIsWorkflowPublished] = React.useState(false);
    const [flow, setFlow] = React.useState<any>();
    const [componentConfig, setComponentConfig] = React.useState<Map<string, object>>(new Map());
    const [componentId, setComponentId] = React.useState<string>();
    const [comUiId, setCompUiId] = React.useState<string>('');
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [saveFlowTemp, setSaveFlowTemp] = React.useState<any>();
    const [showList, setShowList] = useState(true);

    const workflowDirty = useSelector((state: any) => state.workflowDirty);
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);

    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchAutomationFlow();
            init = true;
        }
    }, []);

    async function fetchAutomationFlow() {
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.flows.getOneById(flowId), { withCredentials: true });
            if (data.data) {
                setFlowDetail(data.data);
                if (data?.data?.workflows != null && data?.data.workflows.length > 0) {
                    const tempFlow = data?.data;
                    setIsWorkflowPublished(tempFlow?.is_published);
                    setFlow(tempFlow?.workflows[0]);
                    populateComponentConfig(data?.data?.workflows[0]);
                }
            }
            dispatch(setLoader(false));
        } catch (error) {
            dispatch(setLoader(false));
            handleUnAuth(error);
        }
    }

    const populateComponentConfig = (flow: any) => {
        if (flow == null || flow.json == null) { return; }
        const flowMap: surveyFlowType = JSON.parse(flow.json);
        const compConfMap = new Map<string, object>();
        flowMap?.nodes?.forEach((node) => {
            const compConfig = getComponentConfigFromNode(node);
            compConfig.existing = true;
            const compUiId = node?.id;
            compConfMap.set(compUiId, compConfig);
        });
        setComponentConfig(compConfMap);
    }

    const handleFlowNameChange = (e: any) => {
        setFlowDetail((prevDetail: any) => ({ ...prevDetail, name: e.target.value }));
    }

    async function handleSaveNameClick() {
        try {
            const payload = {
                id: flowId,
                name: flowDetail.name
            };
            setLoading(true);
            const { data } = await axios.post(endpoints.flows.update, payload, { withCredentials: true });
            console.log("🚀 ~ handleSaveNameClick ~ data:", data)
            setLoading(false);
            if (data.statusCode !== 200) {
                dispatch(showNotification(data?.message, 'error'))
                return;
            }
            dispatch(showNotification(data?.message, 'success'))
            handleCloseEditName(false);
        } catch (error) {
            console.log("🚀 ~ handleSaveNameClick ~ error:", error)
            handleUnAuth(error);
            setLoading(false);
        }
    }

    const handleCloseEditName = (rerender: boolean) => {
        setShowFlowName(true);
    }

    const handleSaveButtonClick = () => {
        const flowData = childRef.current.getFlowData();
        if (flowData) {
            handleSaveFlow(flowData);
        }
    };

    const checkWorkflow = (value: boolean) => {
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = value;
        dispatch(updateWorkflowCheck(tempWorkflowDirty));
    }

    const handleComponentEditClick = (uId: string, compId: string) => {
        setComponentId(compId);
        setCompUiId(uId);
        setOpenEditModal(true);
    }

    const handleSaveFlow = async (flow: any) => {
        try {
            if (flow == null || flow.length < 1) { return; }
            if (componentConfig.size < 1) {
                saveFlow(flow, false);
                return;
            }
            for (const key in flow) {
                if (key.toLowerCase() !== 'nodes') {
                    continue;
                }
                let nodeList: any[] = flow[key];
                nodeList.forEach(n => {
                    if (componentConfig.has(n.id)) {
                        const compConfStr = componentConfig.get(n.id);
                        if (compConfStr != null) {
                            n.data.compConfig = JSON.stringify(compConfStr);
                        }
                    }
                });
            }
            saveFlow(flow, false);
        } catch (error) {
            dispatch(showNotification('Something went wrong', 'error'));
        }
    }

    const handleDisableEnableFlow = async () => {
        if (flowDetail?.is_published === true) {
            unPublishAutomationFlow();
        } else {
            publishAutomationFlow();
        }
    }

    async function unPublishAutomationFlow() {
        try {
            dispatch(setLoader(true));
            const {data} = await axios.post(endpoints.flows.unpublish(flowDetail.id), {}, { withCredentials: true });
            setFlowDetail(data?.data);
            setIsWorkflowPublished(false);
            dispatch(showNotification('Flow unpublished', 'success'));
            dispatch(setLoader(false));
        } catch (error) {
            dispatch(showNotification('Something went wrong', 'error'));
            dispatch(setLoader(false));
            handleUnAuth(error);
        }
    }

    async function publishAutomationFlow() {
        const isWorkflowDirty = workflowDirty[currentWorkflowId];
        if (isWorkflowDirty === true) {
            showUnsavedWarning();
            return;
        }
        try {
            dispatch(setLoader(true));
            const { data } = await axios.post(endpoints.flows.publish(flowDetail.id), {}, { withCredentials: true });
            setFlowDetail(data?.data);
            setIsWorkflowPublished(true);
            dispatch(showNotification(data?.message, 'success'));
            dispatch(setLoader(false));
        } catch (error: any) {
            dispatch(showNotification(error?.response?.data?.message, 'error'));
            dispatch(setLoader(false));
            handleUnAuth(error);
        }
    }

    const showUnsavedWarning = () => {
        setShowGenericModal(true);
        let genDeleteObj: genericModalData = {
            header: 'You have some unsaved changes in workflow',
            warning: 'Please save those changes if you want them to reflect in automation.',
            successButtonText: 'Close',
            cancelButtonText: 'Cancel',
            description: 'Unsaved changes will be removed permanently.',
            type: 'workflow-check',
            data: {}
        }
        setGenericModalObj(genDeleteObj);
    }

    const handleSaveComponentConfig = (data: any) => {
        if (isWorkflowPublished === true) {
            snackbarRef?.current?.show('Please disable workflow to edit.', 'error');
            return;
        }
        let tempMap = new Map(componentConfig);
        if (componentId == null) {
            snackbarRef?.current?.show('A component error has been occurred.', 'error');
            return;
        }
        const validatedComp = validateFlowComponent(JSON.parse(data), parseInt(componentId));
        const validatedLogic = validateComponentLogic(JSON.parse(data), null, parseInt(componentId), []);
        if (validatedComp != null) {
            snackbarRef?.current?.show(validatedComp, 'warning');
            // return;
        } else {
            if (validatedLogic != null) {
                snackbarRef?.current?.show(validatedLogic, 'warning');
                // return;
            }
        }

        const tempComponentData: any = tempMap.get(comUiId);
        const isComponentExisting: boolean | null = tempComponentData?.existing;
        if (isComponentExisting === true) {
            const tempData = JSON.parse(data);
            tempData.existing = true;
            data = JSON.stringify(tempData);
        } else {
            const tempData = JSON.parse(data);
            tempData.existing = false;
            data = JSON.stringify(tempData);
        }
        tempMap?.set(comUiId, JSON.parse(data));
        setComponentConfig(tempMap);
        setOpenEditModal(false);
        if (validatedComp == null && validatedLogic == null) {
            snackbarRef?.current?.show('Saved.', 'success');
        }
        const dataObj = JSON.parse(data);
        childRef?.current?.createEdge(dataObj, comUiId, Array.from(tempMap.keys()));
        //If changes are done in new component then we do not check to delete survey responses.
        if (isComponentExisting === true) {
            checkWorkflow(true);
        }
        makeGlobalWorkflowDirty(true);
    }

    const makeGlobalWorkflowDirty = (values: boolean) => {
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = values;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
    }

    const handleSuccessGenericButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type !== 'save_survey') {
            return;
        }

        if (saveFlowTemp == null || saveFlowTemp?.length < 1) { return; }
        if (componentConfig.size < 1) {
            saveFlow(saveFlowTemp, true);
            return;
        }
        for (const key in saveFlowTemp) {
            if (key.toLowerCase() !== 'nodes') {
                continue;
            }
            let nodeList: any[] = saveFlowTemp[key];
            nodeList.forEach(n => {
                if (componentConfig.has(n.id)) {
                    n.data.compConfig = JSON.stringify(componentConfig.get(n.id));
                }
            });
        }
        saveFlow(saveFlowTemp, true);
    }

    const saveFlow = async (flow: any, deleteResponse: boolean) => {
        try {
            if (isWorkflowPublished === true) {
                snackbarRef?.current?.show('Cannot save published surveys.', 'error');
                return;
            }
            setLoading(true);
            if (flowId == null) {
                return;
            }

            const payload = {
                flowId: flowId,
                flowJSON: JSON.stringify(flow)
            }
            const { data } = await axios.post(endpoints.flows.updateJSON, payload, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                dispatch(showNotification(data?.message, 'error'))
                return;
            }
            dispatch(showNotification(data?.message, 'success'))
            checkWorkflow(false);
            makeGlobalWorkflowDirty(false);
        } catch (error: any) {
            setLoading(false)
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            handleUnAuth(error);
        }
    }

    const handleEditNameClick = () => {
        setShowFlowName(false);
    }

    return (
        <Box sx={{ backgroundColor: colorPalette.background, height: 'calc(100vh - 0px)' }} >
            <Box sx={{ ...localSurveyNavbar, border: 'none' }} >
                <Box display={'flex'} >
                    {showFlowName &&
                        <Typography
                            style={{ position: 'relative', top: '15px', paddingLeft: '20px', cursor: 'pointer', fontSize: '17px' }}
                            color={colorPalette.darkBackground} >
                            {flowDetail?.name?.substring(0, 45)}
                            {flowDetail?.name?.length > 45 ? '...' : ''}
                        </Typography>
                    }
                    {showFlowName &&
                        <IconButton onClick={handleEditNameClick} size='small' sx={iconStyle} >
                            <ModeEditOutlineOutlinedIcon sx={{ color: colorPalette.fsGray }} />
                        </IconButton>}
                    {showFlowName === false &&
                        <CssTextField
                            sx={{ input: { color: colorPalette.darkBackground } }}
                            id="outlined-basic"
                            value={flowDetail?.name}
                            variant="outlined"
                            size='small'
                            onChange={(e) => handleFlowNameChange(e)}
                            style={{ width: '300px', paddingTop: '5px', paddingLeft: '10px' }}
                        />
                    }
                    {
                        showFlowName === false &&
                        <IconButton onClick={handleSaveNameClick} size='small' sx={iconStyle} >
                            <CheckIcon sx={{ color: colorPalette.fsGray }} />
                        </IconButton>
                    }
                    {
                        showFlowName === false &&
                        <IconButton onClick={() => handleCloseEditName(true)} size='small' sx={iconStyle} >
                            <CloseIcon sx={{ color: colorPalette.fsGray }} />
                        </IconButton>
                    }
                </Box>
                <Box display={'flex'} >
                    {
                        flowDetail?.is_published == false &&
                        <Button
                            endIcon={<SaveIcon />}
                            onClick={handleSaveButtonClick}
                            style={{ width: '110px', marginRight: '10px' }}
                            sx={getOutlinedButtonBG(colorPalette.textSecondary)}
                            variant="text"
                        >
                            Save
                        </Button>
                    }
                    <Button
                        endIcon={flowDetail?.is_published === true ? <CloseIcon /> : <DoneIcon />}
                        onClick={handleDisableEnableFlow}
                        style={{ width: '110px' }}
                        sx={containedButton}
                        variant="contained"
                    >
                        {flowDetail?.is_published === true ? 'Unpublish' : 'Publish'}
                    </Button>
                    <IconButton onClick={() => navigate('/flows')} sx={{ position: 'relative', top: '5px', marginLeft: '5px' }} >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box display={'flex'} >
                <Box width={isWorkflowPublished === true || showList === false ? '100%' : '80%'} >
                    <FeedbackCanvas
                        source='flow'
                        published={isWorkflowPublished}
                        flow={flow}
                        config={componentConfig}
                        surveyDetail={flowDetail}
                        onEdit={handleComponentEditClick}
                        performSave={handleSaveFlow}
                        dirty={() => { checkWorkflow(true) }}
                        ref={childRef}
                    />
                </Box>
                {
                    showList === false &&
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 0,
                            marginTop: '20px',
                            background: colorPalette.primary,
                            padding: '10px',
                            borderRadius: '6px 0px 0px 6px',
                            color: colorPalette.background,
                            cursor: 'pointer'
                        }}
                        onClick={() => setShowList(true)}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </Box>
                }
                {
                    isWorkflowPublished === false && showList === true &&
                    <Box sx={{ overflowY: 'scroll', height: 'calc(100vh - 60px)' }} width={'20%'} >
                        <AutomationComponentList recordType={flowDetail?.type} change={() => setShowList(false)} />
                    </Box>
                }
            </Box>

            <DynamicComponentModal
                close={() => setOpenEditModal(false)}
                open={openEditModal}
                uiId={comUiId}
                compId={componentId}
                save={handleSaveComponentConfig}
                data={componentConfig}
                isPublished={isWorkflowPublished}
                theme={flowDetail?.survey_design_json}
                recordType={flowDetail?.type}
            />

            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessGenericButtonClick}
            />
        </Box>
    )
}

export default CreateAutomation