import { Box, Button, IconButton, Menu, MenuItem, Popover, TextField, Typography, styled } from '@mui/material'
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { textFieldStyle } from '../../Styles/InputStyles';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { containedButton, getOutlinedButtonBG, outlinedButton } from '../../Styles/ButtonStyle';
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [loading, setLoading] = React.useState(false);
    const [flowDetail, setFlowDetail] = React.useState<any>();
    const [oldName, setOldName] = useState('');
    const [showFlowName, setShowFlowName] = React.useState(true);
    const [isWorkflowPublished, setIsWorkflowPublished] = React.useState(false);
    const [flow, setFlow] = React.useState<any>();
    const [componentConfig, setComponentConfig] = React.useState<Map<string, object>>(new Map());
    const [componentId, setComponentId] = React.useState<string>();
    const [comUiId, setCompUiId] = React.useState<string>('');
    const [openEditModal, setOpenEditModal] = React.useState(false);
    const [saveFlowTemp, setSaveFlowTemp] = React.useState<any>();
    const [showList, setShowList] = useState(false);
    const open = Boolean(anchorEl);
    const showDelete = Boolean(deleteAnchorEl);
    const workflowDirty = useSelector((state: any) => state.workflowDirty);
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);

    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchAutomationFlow();
            init = true;
        }
    }, []);

    function hideDeletePopover() {
        setDeleteAnchorEl(null);
        setAnchorEl(null);
    }

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
            setLoading(false);
            if (data.statusCode !== 200) {
                dispatch(showNotification(data?.message, 'error'))
                return;
            }
            dispatch(showNotification(data?.message, 'success'))
            handleCloseEditName(false);
            setOldName(flowDetail.name);
        } catch (error) {
            handleUnAuth(error);
            setLoading(false);
        }
    }

    const handleCloseEditName = (rerender: boolean) => {
        setShowFlowName(true);
        if (rerender && oldName.length > 0) {
            setFlowDetail((prevDetail: any) => ({ ...prevDetail, name: oldName }));
        }
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
            const { data } = await axios.post(endpoints.flows.unpublish(flowDetail.id), {}, { withCredentials: true });
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
        setOldName(flowDetail?.name);
        setShowFlowName(false);
    }

    async function handleDeleteWorkflow() {
        try {
            if (flowId == null) { return; }
            const { data } = await axios.delete(endpoints.flows.delete(flowId), { withCredentials: true });
            dispatch(showNotification(data?.message, 'success'));
            hideDeletePopover();
            navigate(-1);
        } catch (error) {
            dispatch(showNotification('Something went wrong', 'error'));
            dispatch(setLoader(false));
        }
    }

    function ComponentListAdd() {

        const handleClose = () => {
            setShowList(false)
        };

        return (
            <>
                {
                    !flowDetail?.is_published ?
                        <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                            {
                                !showList ?
                                    <IconButton
                                        onClick={(e) => setShowList(true)}
                                        size='small'
                                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                                    >
                                        <AddCircleIcon
                                            fontSize='large'
                                            sx={{ color: colorPalette.primary, fontSize: '50px' }}
                                        />
                                    </IconButton> :
                                    <IconButton
                                        onClick={handleClose}
                                        size='small'
                                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                                    >
                                        <CancelIcon
                                            fontSize='large'
                                            sx={{ color: colorPalette.primary, fontSize: '50px' }}
                                        />
                                    </IconButton>
                            }
                        </Box> : <></>
                }
            </>
        )
    }

    return (
        <Box sx={{ backgroundColor: colorPalette.background, height: 'calc(100vh - 0px)' }} >
            <Box sx={{ ...localSurveyNavbar, border: 'none' }} >
                <Box display={'flex'} >
                    <IconButton onClick={() => navigate(-1)} sx={{ marginTop: '5px', marginLeft: '5px' }} >
                        <ArrowBackIcon />
                    </IconButton>
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
                            onChange={(e) => {handleFlowNameChange(e);}}
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
                            size='small'
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
                        size='small'
                    >
                        {flowDetail?.is_published === true ? 'Unpublish' : 'Publish'}
                    </Button>
                    {
                        flowDetail?.is_published === false &&
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ marginLeft: '10px', marginTop: '5px' }} size='small' >
                            <ArrowDropDownIcon />
                        </IconButton>
                    }
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={(e) => setDeleteAnchorEl(e.currentTarget)}>
                            <DeleteIcon />
                            Delete
                        </MenuItem>
                    </Menu>
                    <Popover
                        id={showDelete ? 'simple-popover' : undefined}
                        open={showDelete}
                        anchorEl={deleteAnchorEl}
                        onClose={() => setDeleteAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Box sx={{ padding: '10px', textAlign: 'end' }} >
                            <Typography>Are you sure you want to delete this flow ?</Typography>
                            <Box>
                                <Button
                                    onClick={hideDeletePopover}
                                    sx={{ ...outlinedButton, marginRight: '5px' }}
                                    size='small'
                                    variant='outlined'
                                >Cancel</Button>
                                <Button
                                    onClick={handleDeleteWorkflow}
                                    size='small'
                                    variant='contained'
                                    sx={containedButton}
                                >Delete</Button>
                            </Box>
                        </Box>
                    </Popover>
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
                {ComponentListAdd()}
                {
                    isWorkflowPublished === false && showList === true &&
                    <Box sx={{ overflowY: 'scroll', height: 'calc(100vh - 60px)' }} width={'20%'} >
                        <AutomationComponentList recordType={flowDetail?.type} />
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