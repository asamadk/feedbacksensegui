import { Button, Divider, FilledInput, Grid, IconButton, InputLabel, makeStyles, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useEffect, useState } from 'react'
import * as Constants from '../Utils/Constants';
import * as InputStyles from '../Styles/InputStyles';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import SurveyBlock from './SurveyBlock';
import axios from 'axios';
import CreateSurveyModal from '../Modals/CreateSurveyModal';

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

    const [surveys, setSurveys] = useState<any[]>([]);
    const [unfilteredSurveys, setUnfilteredSureveys] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [userList, setUserList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('0');
    const [selectedSurveyType, setSelectedSurveyType] = useState<string>('0');
    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);
    const [openCreateSurvey, setOpenCreateSurvey] = useState(false);

    useEffect(() => {
        getSurveys();
        getUserList();
        getSurveyTypes();
    }, []);

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
        let { data } = await axios.get(Endpoints.getSurveyTypes());
        const isValidated = FeedbackUtils.validateAPIResponse(data);
        if (isValidated === false) {
            return;
        }

        if (data.data != null) {
            data.data.unshift({
                id: '0',
                label: 'All survey type'
            });
            setSurveyTypes(data.data);
        }
    }

    const getUserList = async (): Promise<void> => {
        try {
            let { data } = await axios.get(Endpoints.getUserList(FeedbackUtils.getOrgId()));
            const isValidated = FeedbackUtils.validateAPIResponse(data);
            if (isValidated === false) {
                return;
            }
            if (data.data != null) {
                data.data.unshift({
                    id: '0',
                    name: 'All Users'
                })
                setUserList(data.data);
            }
        } catch (error) {
            console.log('Exception :: getUserList :: ', error);
        }
    }

    const getSurveys = async (): Promise<void> => {
        let orgId = FeedbackUtils.getOrgId();
        if (orgId === '') {
            //TODO : show error;
        }

        let { data } = await axios.get(Endpoints.getSurveyList(orgId));
        const isValidated = FeedbackUtils.validateAPIResponse(data);
        if (isValidated === false) {
            return;
        }

        let resData: any = data.data;
        if (resData != null) {
            console.log('ResData = ', resData);
            setSurveys(resData);
            setUnfilteredSureveys(resData);
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
        surveys.forEach(survey => {
            if (survey.id !== surveyId) {
                tempSurveys.push(survey);
            }
        });

        setSurveys(tempSurveys);
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

    return (
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

            <Grid style={{ marginTop: '20px', overflowY : 'scroll', height : 'calc(100vh - 210px)' }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
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
            <CreateSurveyModal surveys={surveys}  open={openCreateSurvey} close={handleCloseCreateNewSurvey} />
        </Box>
    )
}

export default SurveysPanel