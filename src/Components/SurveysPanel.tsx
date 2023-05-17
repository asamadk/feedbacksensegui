import { Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useEffect, useRef, useState } from 'react'
import * as Constants from '../Utils/Constants';
import * as InputStyles from '../Styles/InputStyles';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import SurveyBlock from './SurveyBlock';
import axios from 'axios';
import CreateSurveyModal from '../Modals/CreateSurveyModal';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useNavigate } from 'react-router';

const buttonContainerStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between'
}

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFA500',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFA500',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFA500',
        },
    },
});

function SurveysPanel(props: any) {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();

    const [surveys, setSurveys] = useState<any[]>([]);
    const [unfilteredSurveys, setUnfilteredSureveys] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [userList, setUserList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('0');
    const [selectedSurveyType, setSelectedSurveyType] = useState<string>('0');
    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);
    const [openCreateSurvey, setOpenCreateSurvey] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = React.useState<Boolean>(false);
    const [forceRerender, setForceRerender] = React.useState(false);

    useEffect(() => {
        getSurveys();
        getUserList();
        getSurveyTypes();
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

    const getSurveyTypes = async (): Promise<void> => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getSurveyTypes(), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            if (data.data != null) {
                data.data.unshift({
                    id: '0',
                    label: 'All survey type'
                });
                setSurveyTypes(data.data);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if(error?.response?.data?.message === Constants.USER_UNAUTH_TEXT){
                navigate('/login');
            }
        }
    }

    const getUserList = async (): Promise<void> => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getUserList(), { withCredentials: true });
            setLoading(false);
            if (data?.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            if (data.data != null) {
                data.data.unshift({
                    id: '0',
                    name: 'All Users'
                })
                setUserList(data.data);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if(error?.response?.data?.message === Constants.USER_UNAUTH_TEXT){
                navigate('/login');
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
                setSurveys(resData);
                setUnfilteredSureveys(resData);
                if (resData?.length < 1) {
                    setIsEmpty(true);
                } else {
                    setIsEmpty(false);
                }
            } else {
                setIsEmpty(true);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if(error?.response?.data?.message === Constants.USER_UNAUTH_TEXT){
                navigate('/login');
            }
        }
    }

    const handleUserChange = (event: any) => {
        let userID = event.target.value;
        setSelectedUser(userID);
        filterSurveys(userID, searchText, selectedSurveyType);
    }

    const handleSurveyTypeChange = (event: any) => {
        let typeId = event.target.value;
        setSelectedSurveyType(typeId);

        filterSurveys(selectedUser, searchText, typeId);
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

        let filteredTempSurveys : any[] = [];
        surveys.forEach(survey => {
            if (survey.id !== surveyId) {
                filteredTempSurveys.push(survey);
            }
        });
        setSurveys(filteredTempSurveys);
        snackbarRef?.current?.show('Survey deleted', 'success');
        if(tempSurveys.length < 1){
            setForceRerender(!forceRerender);
        }

    }

    const rerenderAfterFolderChange = () => {
        filterSurveysByFolderId(props.folderId);
        setSelectedUser('All Users');
        setSearchText('');
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
                        <img style={{ maxWidth: 230 }} alt='Create your first survey to get started!' src='/completed-task.png'></img>
                        <Typography style={{ color: '#f1f1f1' }} variant='h6'>Create your first survey to get started!</Typography>
                        <Typography style={{ color: '#FFA500' }} variant='subtitle2'>Click the button below to add your first survey.</Typography>
                        <Button sx={containedButtonStyle} onClick={handleCreateNewSurvey} variant="contained">Get Started</Button>
                    </div>
                    :
                    <Box sx={{ padding: '15px 20px' }} >
                        <Typography sx={{ textAlign: 'start' }} variant='h5'>{props.folder}</Typography>
                        <Box sx={buttonContainerStyles} >
                            <Box>
                                <Button
                                    sx={ButtonStyles.containedButton}
                                    style={{ width: 'fit-content', marginBottom: '15px', marginRight: '30px', textTransform: 'none' }}
                                    startIcon={<AddIcon />}
                                    variant='contained'
                                    onClick={handleCreateNewSurvey}
                                >
                                    Create new survey
                                </Button>
                                <Select onChange={handleUserChange} sx={InputStyles.muiSelectStyle} value={selectedUser} size='small' >
                                    {userList.map(user => {
                                        return (
                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                        );
                                    })}
                                </Select>
                                <Select onChange={handleSurveyTypeChange} value={selectedSurveyType} style={{ marginLeft: '10px' }} sx={InputStyles.muiSelectStyle} size='small' >
                                    {surveyTypes.map(type => {
                                        return (
                                            <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </Box>
                            <Box>
                                <CssTextField
                                    onChange={handleSearch}
                                    value={searchText}
                                    size='small'
                                    sx={{ input: { color: 'white' } }}
                                    placeholder='Search surveys and folders..'
                                    style={{ width: '250px' }}
                                    InputProps={{
                                        endAdornment: <SearchIcon sx={{ color: '#f1f1f1', paddingLeft: '5px' }} />
                                    }}
                                />
                            </Box>
                        </Box>
                        <div style={{ border: '0.5px #454545 solid', marginTop: '10px' }} />

                        <Grid style={{ marginTop: '20px', overflowY: 'scroll', height: 'calc(100vh - 230px)' }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {surveys.map((survey) => (
                                <Grid item xs={2} sm={4} md={4} key={survey.id}>
                                    <SurveyBlock
                                        survey={survey}
                                        delete={deleteSurvey}
                                        rerender={rerenderAfterFolderChange}
                                        update={props.update}
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

const containedButtonStyle = {
    marginTop: '10px',
    color : '#f1f1f1',
    backgroundColor: '#D81159',
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#FF367F"
    }
}