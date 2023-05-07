import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FSLoader from '../../Components/FSLoader';
import { getLiveSurveyData } from '../../Utils/Endpoints';
import DynamicComponentDisplay from '../DynamicComponentDisplay';
import { v4 as uuidv4, v4 } from "uuid";

import { getSurveyDisplayContainerStyle } from '../../Styles/SurveyDisplay';
import { LIVE_SURVEY_USER_ID } from '../../Utils/Constants';
import SurveyEndPage from './SurveyEndPage';

function SurveyDisplays() {

    const { surveyId } = useParams();

    let initialized = false;
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [surveyTheme, setSurveyTheme] = useState<any>();
    const [surveyDiplays, setSurveyDisplays] = useState<any[]>([]);
    const [currentSurvey, setCurrentSurvey] = useState<any>();
    const [currentPageData, setCurrentPagedata] = useState<any>();
    const [displayMssg, setDisplayMssg] = useState({
        message: '',
        type: 'success'
    });
    const [showEnd , setShowEnd] = useState(false);

    useEffect(() => {
        if(initialized === false){
            fetchLiveSurveyNodes();
        }
    }, []);

    const fetchLiveSurveyNodes = async () => {
        try {
            initialized = true;
            setLoading(true);
            const url = getLiveSurveyData(surveyId);
            const { data } = await axios.get(url,{ withCredentials : true });
            setLoading(false);
            const isAlreadyTaken = checkIfSurveyAlreadytaken();
            if (isAlreadyTaken === true) {
                return;
            }
            setDisplayMssg({
                message: data?.message,
                type: data?.success === true ? 'success' : 'error'
            });
            const resData = data.data;
            setCurrentPage(0);
            setSurveyDisplays(resData.nodes);
            setSurveyTheme(resData.theme);
            setCurrentSurvey(resData.nodes[0]);
            populateComponentData(resData.nodes[0]);
            localStorage.setItem(`${surveyId}_${LIVE_SURVEY_USER_ID}`, v4());
        } catch (error: any) {
            setLoading(false);
            console.log('Error message = ', error?.response?.data?.message)
            setDisplayMssg({
                message: error?.response?.data?.message,
                type: error?.response?.data?.success === true ? 'success' : 'error'
            });
        }
    }

    const checkIfSurveyAlreadytaken = (): boolean => {
        if (localStorage.getItem(`${surveyId}_${LIVE_SURVEY_USER_ID}`) != null) {
            setDisplayMssg({
                message: 'You have already taken this survey.',
                type: 'error'
            });
            return true;
        }
        return false;
    }

    const populateComponentData = (comp: any) => {
        if (comp == null) { return; }
        const compConfigStr: string = comp?.data?.compConfig
        if (compConfigStr != null && compConfigStr.length > 0) {
            setCurrentPagedata(JSON.parse(compConfigStr));
        }
    }

    const next = () => {
        console.log("🚀 ~ file: SurveyDisplays.tsx:88 ~ next ~ currentPage:", currentPage)
        console.log("🚀 ~ file: SurveyDisplays.tsx:89 ~ next ~ surveyDiplays?.length:", surveyDiplays?.length)
        if (currentPage < surveyDiplays?.length - 1) {
            const nextPage = surveyDiplays[currentPage + 1];
            if (nextPage != null) {
                setCurrentSurvey(nextPage);
                populateComponentData(nextPage);
                setCurrentPage(currentPage + 1);
                setShowEnd(false);
            }
        }else{
            setShowEnd(true);
            console.log('On last page')
        }
    }

    return (
        <>
            {displayMssg.type === 'error' &&
                <Box >
                    <DisplayError error={displayMssg.message} />
                </Box>
            }
                {displayMssg.type !== 'error' && showEnd === false &&
                    <Box sx={{ height: '100vh', backgroundColor: surveyTheme?.color[0] }} >
                        <FSLoader show={loading} />
                        <Box>
                            <DynamicComponentDisplay
                                theme={surveyTheme}
                                compId={currentSurvey?.data?.compId}
                                data={currentPageData}
                                next={next}
                                surveyId={surveyId}
                            />
                        </Box>
                    </Box>
                }
                {displayMssg.type !== 'error' && showEnd === true &&
                    <SurveyEndPage/>
                }
        </>
    )
}

export default SurveyDisplays

function DisplayError(props: any) {
    return (
        <Box sx={{ backgroundColor: '#454545' }} >
            <Box sx={centerAlignContainer} >
                <Typography
                    color={'#454545'}
                    fontSize={'26px'}
                >
                    {props.error}
                </Typography>
            </Box>
        </Box>
    )
}

const centerAlignContainer = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', width: '90%', textAlign: 'center',
    marginRight: '10px',
}