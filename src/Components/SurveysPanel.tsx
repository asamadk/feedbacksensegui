import { Button, Grid, IconButton, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useEffect, useRef, useState } from 'react'
import * as Constants from '../Utils/Constants';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import SurveyBlock from './SurveyBlock';
import axios from 'axios';
import CreateSurveyModal from '../Modals/CreateSurveyModal';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router';
import Logo from './Logo';
import { useSelector } from 'react-redux';
import { userRoleType } from '../Utils/types';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { setSurvey } from '../Redux/Reducers/surveyReducer';
import { useDispatch } from 'react-redux';
import { muiSelectStyle, textFieldStyle } from '../Styles/InputStyles';
import { setUsers } from '../Redux/Reducers/usersReducer';
import AppsIcon from '@mui/icons-material/Apps';

const buttonContainerStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between'
}

const CssTextField = styled(TextField)(textFieldStyle);

function SurveysPanel(props: any) {

    const snackbarRef: any = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [surveys, setSurveys] = useState<any[]>([]);
    const [unfilteredSurveys, setUnfilteredSureveys] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState<string>('0');
    const [selectedSurveyType, setSelectedSurveyType] = useState<string>('0');
    const [openCreateSurvey, setOpenCreateSurvey] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState<Boolean>(false);
    const [forceRerender, setForceRerender] = React.useState(false);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const userState = useSelector((state: any) => state.users);
    const defaultColor = useSelector((state: any) => state.colorReducer);

    let initialized = false;

    useEffect(() => {
        if (initialized === false) {
            getSurveys();
            getUserList();
            initialized = true;
        }
    }, [forceRerender]);

    useEffect(() => {
        filterSurveysByFolderId(props.folderId);
        setSelectedUser('0');
        setSearchText('');
    }, [props.folderId]);

    const filterSurveysByFolderId = (folderId: string) => {
        setSurveys(unfilteredSurveys);
        if (folderId !== '0') {
            setSurveys((surveys) => surveys.filter(survey => survey.folder_id === folderId));
        }
    }

    const getUserList = async (): Promise<void> => {
        try {
            if (userState == null || userState.length < 1) {
                setLoading(true);
                let { data } = await axios.get(Endpoints.getUserListAPI(), { withCredentials: true });
                setLoading(false);
                if (data?.statusCode !== 200) {
                    snackbarRef?.current?.show(data?.message, 'error');
                    return;
                }

                if (data.data != null) {
                    dispatch(setUsers(data.data))
                }
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === Constants.USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const getSurveys = async (): Promise<void> => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getSurveyList(), { withCredentials: true });
            setLoading(false);
            if (data?.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            let resData: any = data.data;
            if (resData != null) {
                populateSurveys(resData);
            } else {
                setIsEmpty(true);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === Constants.USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const populateSurveys = (surveyData: any[]) => {
        dispatch(setSurvey(surveyData));
        setSurveys([]);
        setSurveys(surveyData);
        setUnfilteredSureveys(surveyData);
        if (surveyData?.length < 1) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }

    const handleUserChange = (event: any) => {
        let userID = event.target.value;
        setSelectedUser(userID);
        filterSurveys(userID, searchText, selectedSurveyType);
    }

    const handleSearch = (event: any) => {
        let tempSearchText: string = event.target.value;
        setSearchText(tempSearchText);

        filterSurveys(selectedUser, tempSearchText, selectedSurveyType);
    }

    const filterSurveys = (userId: string, surveyName: string, surveyType: string) => {
        let tempUnfilteredSurveys: any[] = [];
        unfilteredSurveys.forEach(survey => {
            if (
                survey.name.toLowerCase().includes(surveyName.toLowerCase()) &&
                (survey.folder_id === props.folderId || props.folderId === '0') &&
                (survey.user_id === userId || userId === '0') &&
                (survey.survey_type_id === surveyType || surveyType === '0')
            ) {
                tempUnfilteredSurveys.push(survey);
            }
        });
        setSurveys(tempUnfilteredSurveys);
    }

    const deleteSurvey = (surveyId: string) => {
        let tempSurveys: any[] = [];
        unfilteredSurveys.forEach(survey => {
            if (survey.id !== surveyId) {
                tempSurveys.push(survey);
            }
        });
        setUnfilteredSureveys(tempSurveys);

        let filteredTempSurveys: any[] = [];
        surveys.forEach(survey => {
            if (survey.id !== surveyId) {
                filteredTempSurveys.push(survey);
            }
        });
        setSurveys(filteredTempSurveys);
        snackbarRef?.current?.show('Survey deleted', 'success');
        if (tempSurveys.length < 1) {
            setForceRerender(!forceRerender);
        }

    }

    const rerenderAfterFolderChange = () => {
        filterSurveysByFolderId(props.folderId);
        setSelectedUser('All Users');
        setSearchText('');
    }

    const updateSurveyList = () => {
        getSurveys();
    }

    const handleCreateNewSurvey = () => {
        setOpenCreateSurvey(true);
    }

    const handleCloseCreateNewSurvey = () => {
        setOpenCreateSurvey(false);
    }

    const runOnCreate = () => {
        setOpenCreateSurvey(false);
        setForceRerender(!forceRerender);
        props.runOnSurveyCreate();
    }

    const updateSurvey = (surveyId: string, tempSurvey: any) => {
        const updatedSurveys = surveys.map(survey => {
            if (survey.id === surveyId) {
                return { ...survey, ...tempSurvey };
            }
            return survey;
        });
        setSurveys(updatedSurveys);

        const unfilteredUpdatedSurveys = unfilteredSurveys.map(survey => {
            if (survey.id === surveyId) {
                return { ...survey, ...tempSurvey };
            }
            return survey;
        });
        setUnfilteredSureveys(unfilteredUpdatedSurveys);
    }

    return (
        <>
            {
                isEmpty === true ?
                    <div style={{
                        position: "relative",
                        top: "25%",
                        width: 'fit-content',
                        margin: 'auto'
                    }} >
                        <Box sx={{ width: 'fit-content', margin: 'auto' }} >
                            <Logo />
                        </Box>
                        <Typography style={{ color: Constants.colorPalette.darkBackground }} variant='h4'>Create your first survey to get started!</Typography>
                        <Typography style={{ color: Constants.colorPalette.primary }} variant='subtitle2'>Click the button below to add your first survey.</Typography>
                        <Button sx={containedButtonStyle} onClick={handleCreateNewSurvey} >Get Started</Button>
                    </div>
                    :
                    <Box sx={{ padding: '15px 20px',backgroundColor : Constants.colorPalette.textSecondary, overflowY: 'scroll', height: 'calc(100vh - 100px)' }} >
                        <Box >
                            <Box sx={buttonContainerStyles} >
                                <Box>
                                    <Typography     
                                        sx={{ textAlign: 'start', color: Constants.colorPalette.textPrimary,marginTop : '20px' }} 
                                        variant='h5' 
                                        title={props?.folder}
                                    >
                                        {props?.folder?.substring(0, 100)}
                                        {props?.folder?.length > 100 ? '...' : ''}
                                    </Typography>
                                </Box>
                                <Box marginTop={'9px'} >
                                    <Select
                                        onChange={handleUserChange}
                                        sx={{ ...muiSelectStyle, width: '150px', height: '36px' }}
                                        value={selectedUser}
                                        size='small'
                                    >
                                        <MenuItem value={'0'}>All Users</MenuItem>
                                        {userState.map((user: any) => {
                                            return (
                                                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                            );
                                        })}
                                    </Select>
                                    <CssTextField
                                        onChange={handleSearch}
                                        value={searchText}
                                        size='small'
                                        sx={{ input: { color: Constants.colorPalette.darkBackground } }}
                                        placeholder='Search surveys and folders..'
                                        style={searchBoxStyle}
                                        InputProps={{
                                            endAdornment: <SearchIcon sx={{ color: Constants.colorPalette.darkBackground, paddingLeft: '5px' }} />
                                        }}
                                    />
                                    {
                                        CoreUtils.isComponentVisible(userRole, Constants.componentName.CREATE_SURVEY_BUTTON) &&
                                        <Button
                                            sx={ButtonStyles.containedButton}
                                            style={{ width: 'fit-content', marginBottom: '15px', marginLeft: '10px', textTransform: 'none' }}
                                            startIcon={<AddIcon />}
                                            variant='contained'
                                            onClick={handleCreateNewSurvey}
                                        >
                                            Create new survey
                                        </Button>
                                    }
                                </Box>
                            </Box>
                        </Box>
                        <Grid 
                            container 
                            spacing={{ xs: 2, md: 3 }} 
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            {surveys.map((survey: any) => (
                                <Grid item xs={2} sm={4} md={4} key={survey.id}>
                                    <SurveyBlock
                                        survey={survey}
                                        delete={deleteSurvey}
                                        rerender={rerenderAfterFolderChange}
                                        updateSurvey={updateSurvey}
                                        update={props.update}
                                        updateSurveyList={updateSurveyList}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
            }
            <CreateSurveyModal update={runOnCreate} surveys={surveys} open={openCreateSurvey} close={handleCloseCreateNewSurvey} />
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default SurveysPanel

const searchBoxStyle = { 
    width: '250px', 
    marginLeft: '10px',
    marginTop : '8px'
}

const containedButtonStyle = {
    marginTop: '10px',
    color: '#f1f1f1',
    backgroundColor: Constants.colorPalette.primary,
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#004cb3"
    }
}