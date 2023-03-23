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
    const [selectedUser, setSelectedUser] = useState<string>('All Users');
    const [selectedSurveyType, setSelectedSurveyType] = useState<string>('All survey type');
    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);

    useEffect(() => {
        getSurveys();
        getUserList();
        getSurveyTypes();
    }, []);

    useEffect(() => {
        filterSurveysByFolderId(props.folderId);
        setSelectedUser('All Users');
        setSearchText('');
    }, [props.folderId]);

    const filterSurveysByFolderId = (folderId: number) => {
        setSurveys(unfilteredSurveys);
        if (folderId !== 0) {
            setSurveys((surveys) => surveys.filter(survey => survey.folder === folderId));
        }
    }

    const getSurveyTypes = async () :Promise<void> => {
        let res = await axios.get(Endpoints.getSurveyTypes());
        const isValidated = FeedbackUtils.validateAPIResponse(res);
        if (isValidated === false) {
            return;
        }

        let resData: any[] = res.data;
        if (resData != null) {
            resData.unshift({
                id : 0,
                name : 'All survey type'
            });

            setSurveyTypes(resData);
        }
    }

    const getUserList = async (): Promise<void> => {
        let res = await axios.get(Endpoints.getUserList());
        const isValidated = FeedbackUtils.validateAPIResponse(res);
        if (isValidated === false) {
            return;
        }

        let resData: any[] = res.data;
        if (resData != null) {
            resData.unshift({
                id : 0,
                name : 'All Users'
            })
            setUserList(resData);
        }
    }

    const getSurveys = async (): Promise<void> => {
        let res = await axios.get(Endpoints.getSurveyList());
        const isValidated = FeedbackUtils.validateAPIResponse(res);
        if (isValidated === false) {
            return;
        }

        let resData: any[] = res.data;
        if (resData != null) {
            setSurveys(resData);
            setUnfilteredSureveys(resData);
        }
    }

    const handleUserChange = (event : any) => {
        let userName = event.target.value;
        setSelectedUser(userName);
        filterSurveys(userName,searchText,selectedSurveyType);
    }

    const handleSurveyTypeChange = (event : any) => {
        let typeName = event.target.value;
        setSelectedSurveyType(typeName);

        filterSurveys(selectedUser,searchText,typeName);
    }

    const handleSearch = (event: any) => {
        let tempSearchText: string = event.target.value;
        setSearchText(tempSearchText);

        filterSurveys(selectedUser,tempSearchText, selectedSurveyType);
    }

    const filterSurveys = (username : string, surveyName : string, surveyType : string) => {
        let tempUnfilteredSurveys: any[] = [];
        unfilteredSurveys.forEach(survey => {
            if(
                survey.name.toLowerCase().includes(surveyName.toLowerCase()) && 
                (survey.folder === props.folderId || props.folderId === 0) &&
                (survey.createdBy.toLowerCase() === username.toLowerCase() || username.toLowerCase() === 'All Users'.toLowerCase()) &&
                (survey.type.toLowerCase() === surveyType.toLowerCase() || surveyType.toLowerCase() === 'All survey type'.toLowerCase())
            ){
                tempUnfilteredSurveys.push(survey);
            }
        });
        setSurveys(tempUnfilteredSurveys);
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
                        variant='contained' >
                        Create new survey
                    </Button>
                    <Select onChange={handleUserChange} sx={InputStyles.muiSelectStyle} value={selectedUser} size='small' >
                        {userList.map(user => {
                            return (
                                <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                            );
                        })}
                    </Select>
                    <Select onChange={handleSurveyTypeChange} value={selectedSurveyType} style={{ marginLeft: '10px' }} sx={InputStyles.muiSelectStyle} size='small' >
                        {surveyTypes.map(type => {
                            return(
                                <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
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

            <Grid style={{ marginTop: '20px' }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {surveys.map((survey) => (
                    <Grid item xs={2} sm={4} md={4} key={survey.id}>
                        <SurveyBlock
                            survey={survey}
                        />
                    </Grid>
                ))}
            </Grid>


        </Box>
    )
}

export default SurveysPanel