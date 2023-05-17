import { Box, Button, IconButton, Typography } from '@mui/material'
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
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Utils/FeedbackUtils';

const responseStyle = {
    padding: '10px',
    margin: '10px',
    textAlign: 'start',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: '0.3s',
    backgroundColor: '#1A1A1A'
}

const selectedResponseStyle = {
    padding: '10px',
    margin: '10px',
    textAlign: 'start',
    cursor: 'pointer',
    borderRadius: '6px',
    border: '1px #454545 solid',
    transition: '0.3s',
    backgroundColor: '#1A1A1A'
}

type IndividualResponseProps = {
    surveyId: string
}

function IndividualResponse(props: IndividualResponseProps) {
    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [surveyResponseList, setSurveyResponseList] = useState<any[]>([]);
    const [selectedResponse, setSelectedResponse] = useState<any>();
    const [loading, setLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        fetchSurveyResponseList()
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
                if (count === 0) {
                    setSelectedResponse(res);
                    res.selected = true;
                } else {
                    res.selected = false;
                }
                count++;
            })
            if (responseList.length < 1) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }
            setSurveyResponseList(responseList);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
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
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
                handleLogout();
            }
        }
    }

    return (
        <Box>

            {
                isEmpty === false &&
                <Box sx={{ scrollbarWidth: '0.5px' }} >
                    <Box sx={{ textAlign: 'start', paddingTop: '4px', paddingLeft: '10px', borderBottom: '1px #454545 solid', height: '48px' }} >
                        <Typography
                            paddingTop={'10px'}
                            paddingLeft={'10px'}
                            fontSize={'14px'}
                            fontWeight={'600'}
                            color={'#FFA500'} >
                            {'Individual Responses'}
                        </Typography>
                    </Box>
                    <Box display={'flex'} height={'calc(100vh - 120px)'} >
                        <Box sx={{ overflowY: 'scroll' }} borderRight={'1px #454545 solid'} width={'27%'} >
                            <Box sx={{ borderBottom: '1px #454545 solid', height: '48px' }} >
                                <Box marginLeft={'10px'} marginRight={'10px'} color={'#f1f1f1'} display={'flex'} justifyContent={'space-between'} padding={'12px'} >
                                    <Typography border={'none'} fontWeight={'600'} fontSize={'14px'} >Response</Typography>
                                    <Typography border={'none'} color={'#808080'} >{surveyResponseList?.length}</Typography>
                                </Box>
                            </Box>
                            {surveyResponseList.map((res: any) => {
                                return (
                                    <Box
                                        key={res.id}
                                        id={res.id}
                                        onClick={() => handleResponseListClick(res.id)}
                                        sx={res?.selected === true ? selectedResponseStyle : responseStyle}
                                    >
                                        <Typography fontSize={'14px'} fontWeight={'600'} color={'#f1f1f1'} >{'Anonymous Response'}</Typography>
                                        <Typography sx={{ fontSize: '13px' }} color={'#808080'} >{res?.id}</Typography>
                                        <Typography sx={{ fontSize: '13px' }} color={'#808080'} >
                                            {new Date(res?.created_at)?.toLocaleString()}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                        <Box sx={{ overflowY: 'scroll' }} borderRight={'1px #454545 solid'} width={'53%'} >
                            <Box sx={{ borderBottom: '1px #454545 solid', height: '48px' }} >
                                <Box marginLeft={'10px'} marginRight={'10px'} color={'#f1f1f1'} display={'flex'} justifyContent={'space-between'} padding={'12px'} >
                                    <Typography fontWeight={'600'} fontSize={'14px'} >Anonymous response</Typography>
                                    <Box sx={{ position: 'relative', top: '-8px', left: '20px' }} >
                                        <Button onClick={handleShareResponseClick} style={{ width: 'fit-content', margin: '0', padding: '0' }} sx={outlinedButton} >Share</Button>
                                        <IconButton onClick={handleDeleteResponseClick} >
                                            <DeleteIcon sx={{ color: '#808080' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <AnonymousResponseDetail
                                    data={selectedResponse}
                                />
                            </Box>

                        </Box>
                        <Box padding={'10px'} marginTop={'5px'} color={'#f1f1f1'} textAlign={'start'} borderRight={'1px #454545 solid'} width={'25%'} >
                            <Typography fontWeight={'600'} fontSize={'14px'} >Response details</Typography>
                            <Box color={'#808080'} marginTop={'12px'}>
                                <Typography>{selectedResponse?.userDetails}</Typography>
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