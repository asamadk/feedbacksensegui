import { Box, Button, IconButton, Pagination, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { outlinedButton } from '../Styles/ButtonStyle'
import DeleteIcon from '@mui/icons-material/Delete';
import AnonymousResponseDetail from './AnonymousResponseDetail';
import axios from 'axios';
import { deleteSurveyResponse, getSurveyResponseList } from '../Utils/Endpoints';
import * as Types from '../Utils/types'
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import GenericModal from '../Modals/GenericModal';
import EmptyAnalysis from './OverAllResults/EmptyAnalysis';
import { USER_UNAUTH_TEXT, colorPalette, componentName } from '../Utils/Constants';
import { useNavigate } from 'react-router';
import { getPersonName, handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import AndroidIcon from '@mui/icons-material/Android';
import CategoryIcon from '@mui/icons-material/Category';
import TabIcon from '@mui/icons-material/Tab';

const responseStyle = (bgColor: string) => {
    return {
        padding: '10px',
        margin: '10px',
        textAlign: 'start',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: '0.3s',
        backgroundColor: bgColor,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }
}

const selectedResponseStyle = (bgColor: string) => {
    return {
        padding: '10px',
        margin: '10px',
        textAlign: 'start',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: '0.3s',
        backgroundColor: bgColor,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    }
}

const columnStyle = {
    overflowY: 'scroll',
    background: colorPalette.background,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    borderRadius: '6px'
}

type IndividualResponseProps = {
    surveyId: string
}

function IndividualResponse(props: IndividualResponseProps) {
    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [surveyResponseList, setSurveyResponseList] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const userRole: Types.userRoleType = useSelector((state: any) => state.userRole);

    let init = false;

    useEffect(() => {
        if (init === false) {
            fetchSurveyResponseList()
            init = true;
        }
    }, []);     

    const fetchSurveyResponseList = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getSurveyResponseList(props.surveyId), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            const responseList: any[] = data.data;
            let count = 0;
            responseList.forEach(res => {
                res.userDetails = JSON.parse(res.userDetails);
                if (count === 0) {
                    setSelectedResponse(res);
                    res.selected = true;

                } else {
                    res.selected = false;
                }
                count++;
            });
            console.log("🚀 ~ fetchSurveyResponseList ~ responseList:", responseList)

            if (responseList.length < 1) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

            setSurveyResponseList(responseList);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleResponseListClick = (selectedId: string) => {
        const tempSurveyResponseList: any[] = JSON.parse(JSON.stringify(surveyResponseList));
        tempSurveyResponseList.forEach((res: any) => {
            if (res.id === selectedId) {
                res.selected = true;
                setSelectedResponse(res);
            } else {
                res.selected = false;
            }
        });
        setSurveyResponseList(tempSurveyResponseList);
    }

    const handleShareResponseClick = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        snackbarRef?.current?.show('Link copied', 'success');
    }

    const handleDeleteResponseClick = () => {
        setShowGenericModal(true);
        let genDeleteObj: Types.genericModalData = {
            header: 'Do you really want to delete this survey response?',
            warning: 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            description: 'The survey response will be removed permanently.',
            type: 'delete'
        }
        setGenericModalObj(genDeleteObj);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'delete') {
            handleDeleteSurveyResponse();
        }
    }

    const handleDeleteSurveyResponse = async () => {
        try {
            setLoading(true);
            const { data } = await axios.delete(deleteSurveyResponse(selectedResponse.id), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            const tempSurveyResList: any[] = [];
            surveyResponseList.forEach(res => {
                if (res.id !== selectedResponse.id) {
                    tempSurveyResList.push(res);
                }
            });
            setSurveyResponseList(tempSurveyResList);
            if (tempSurveyResList.length > 0) {
                tempSurveyResList[0].selected = true;
                setSelectedResponse(tempSurveyResList[0]);
            }

            if (tempSurveyResList.length === 0) {
                setIsEmpty(true);
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    return (
        <Box>

            {
                isEmpty === false &&
                <Box sx={{ scrollbarWidth: '0.5px', background: colorPalette.textSecondary }} >
                    <Box sx={{ textAlign: 'start', paddingTop: '4px', paddingLeft: '10px', height: '48px' }} >
                        <Typography
                            paddingTop={'10px'}
                            paddingLeft={'10px'}
                            fontSize={'14px'}
                            fontWeight={'600'}
                            color={colorPalette.darkBackground} >
                            {'Individual Responses'}
                        </Typography>
                    </Box>
                    <Box display={'flex'} height={'calc(100vh - 120px)'} >
                        <Box sx={{ ...columnStyle, margin: '0px 10px', height: 'calc(100vh - 125px)' }} width={'25%'} >
                            <Box sx={{ height: '48px' }} >
                                <Box marginLeft={'10px'} marginRight={'10px'} color={colorPalette.darkBackground} display={'flex'} justifyContent={'space-between'} padding={'12px'} >
                                    <Typography border={'none'} fontWeight={'600'} fontSize={'14px'} >Response</Typography>
                                    <Typography border={'none'} color={colorPalette.fsGray} >{surveyResponseList?.length}</Typography>
                                </Box>
                            </Box>
                            {surveyResponseList.map((res: any) => {   
                                return (
                                    <Box
                                        key={res.id}
                                        id={res.id}
                                        onClick={() => handleResponseListClick(res.id)}
                                        sx={res?.selected === true ? selectedResponseStyle(colorPalette.darkBackground) : responseStyle(colorPalette?.textSecondary)}
                                    >
                                        <Typography 
                                            fontSize={'14px'} 
                                            fontWeight={'600'} 
                                            color={res?.selected === true ? colorPalette.secondary : colorPalette.primary} 
                                        >
                                            {getPersonName(res?.person)}
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: '13px' }}
                                            color={res?.selected === true ? colorPalette.textSecondary : colorPalette.textPrimary}
                                        >
                                            {res?.company != null ?res?.company?.name : 'N/A'}
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: '13px' }}
                                            color={res?.selected === true ? colorPalette.secondary : colorPalette.primary}
                                        >
                                            {new Date(res?.created_at)?.toDateString()}
                                        </Typography>
                                    </Box>
                                )
                            })}
                            {/* <Stack direction={'row'} spacing={2} marginTop={'20px'} padding={'10px'}>
                                <Pagination
                                    count={Math.ceil((surveyResponseList?.length || 0) / 10)}
                                    variant="outlined"
                                    shape="rounded"
                                    page={currentPage}
                                    onChange={(event, page) => setCurrentPage(page)}
                                />
                            </Stack> */}
                        </Box>
                        <Box
                            sx={columnStyle}
                            width={'53%'}
                        >
                            <Box sx={{ height: '48px' }} >
                                <Box marginLeft={'10px'} marginRight={'10px'} color={colorPalette.darkBackground} display={'flex'} justifyContent={'space-between'} padding={'12px'} >
                                    <Typography fontWeight={'600'} fontSize={'14px'} >Anonymous response</Typography>
                                    <Box sx={{ position: 'relative', top: '-8px', left: '20px' }} >
                                        {
                                            CoreUtils.isComponentVisible(userRole, componentName.DELETE_SURVEY_RESPONSE) &&
                                            <>
                                                <Button onClick={handleShareResponseClick} style={{ width: 'fit-content', margin: '0', padding: '0' }} sx={outlinedButton} >Share</Button>
                                                <IconButton onClick={handleDeleteResponseClick} >
                                                    <DeleteIcon sx={{ color: colorPalette.primary }} />
                                                </IconButton>
                                            </>
                                        }
                                    </Box>
                                </Box>
                                <AnonymousResponseDetail
                                    data={selectedResponse}
                                />
                            </Box>

                        </Box>
                        <Box sx={{ ...columnStyle, width: '25%', margin: '0px 10px' }} padding={'10px'} color={colorPalette.darkBackground} textAlign={'start'}>
                            <Typography fontWeight={'600'} fontSize={'14px'} >Response details</Typography>
                            <Box color={colorPalette.fsGray} marginTop={'12px'}>
                                <Typography>
                                    <AndroidIcon sx={{color : colorPalette.primary,position : 'relative',top : 5,marginRight : '10px'}} />
                                    {`OS : ${selectedResponse?.userDetails?.os?.family}`}
                                </Typography>
                                <Typography>
                                    <CategoryIcon sx={{color : colorPalette.primary,position : 'relative',top : 5,marginRight : '10px'}} />
                                    {`Product : ${selectedResponse?.userDetails?.product}`}
                                </Typography>
                                <Typography>
                                    <TabIcon sx={{color : colorPalette.primary,position : 'relative',top : 5,marginRight : '10px'}} />
                                    {`Browser : ${selectedResponse?.userDetails?.browser}`}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <FSLoader show={loading} />
                    <Notification ref={snackbarRef} />
                    <GenericModal
                        payload={genericModalObj}
                        close={() => setShowGenericModal(false)}
                        open={showGenericModal}
                        callback={handleSuccessButtonClick}
                    />
                </Box>
            }
            {isEmpty === true && <EmptyAnalysis />}
        </Box>
    )
}

export default IndividualResponse