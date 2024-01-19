import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FSLoader from '../../Components/FSLoader';
import { getLiveSurveyData, getSurveyLogoAPI, getTemplatesDisplayAPI, saveSurveyResponseDb } from '../../Utils/Endpoints';
import DynamicComponentDisplay from '../DynamicComponentDisplay';
import { v4 as uuidv4, v4 } from "uuid";
import { LIVE_SURVEY_USER_ID, TEMPLATE_KEY } from '../../Utils/Constants';
import SurveyEndPage from './SurveyEndPage';
import { CoreUtils } from '../CoreUtils/CoreUtils';
import { getSurveyUserInformation } from '../../Utils/FeedbackUtils';
import { useSearchParams } from 'react-router-dom';

type propType = {
    mode: 'test' | 'live',
    templateId?: string,
    source: 'template' | 'preview' | 'live'
}

function SurveyDisplays({ mode, templateId, source }: propType) {

    const { effectiveSurveyId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    let initialized = false;

    const [surveyId, setSurveyId] = useState(templateId == null ? effectiveSurveyId : templateId);
    const [loading, setLoading] = React.useState(false);
    const [surveyTheme, setSurveyTheme] = useState<any>();
    const [background, setBackground] = useState<any>();
    const [surveyDisplays, setSurveyDisplays] = useState<any[]>([]);
    const [currentSurvey, setCurrentSurvey] = useState<any>();
    const [currentPageData, setCurrentPagedata] = useState<any>();
    const [imgData, setImgData] = useState<string | null>(null);
    const [showEnd, setShowEnd] = useState(false);
    const [displayMssg, setDisplayMssg] = useState({
        message: '',
        type: 'success'
    });

    useEffect(() => {
        if (initialized === false) {
            fetchLiveSurveyNodes();
            getSurveyLogo();
        }
    }, []);

    const getSurveyLogo = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getSurveyLogoAPI(surveyId as string), { withCredentials: true });
            const tmpData = data?.data;
            if (tmpData == null || tmpData.length < 1) {
                setImgData(null);
            } else {
                setImgData(tmpData);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const fetchLiveSurveyNodes = async () => {
        try {
            initialized = true;
            setLoading(true);
            const url = source === 'template' ? getTemplatesDisplayAPI(surveyId) : getLiveSurveyData(surveyId);
            const { data } = await axios.get(url, { withCredentials: true });
            setLoading(false);
            const isAlreadyTaken = checkIfSurveyAlreadyTaken();
            if (isAlreadyTaken === true) {
                return;
            }
            setDisplayMssg({
                message: data?.message,
                type: data?.success === true ? 'success' : 'error'
            });
            const resData = data.data;
            setSurveyDisplays(resData.nodes);
            setSurveyTheme(resData.theme);
            setBackground(resData.background)
            const initialNode = CoreUtils.getInitialNode(resData.nodes);
            setCurrentSurvey(initialNode);
            populateComponentData(initialNode);
            if (mode === 'live') {
                localStorage.setItem(`${surveyId}_${LIVE_SURVEY_USER_ID}`, v4());
            }
        } catch (error: any) {
            setLoading(false);
            setDisplayMssg({
                message: error?.response?.data?.message,
                type: error?.response?.data?.success === true ? 'success' : 'error'
            });
        }
    }

    const checkIfSurveyAlreadyTaken = (): boolean => {
        if (mode === 'test') { return false; }
        const embed : string | null = searchParams.get('embed');
        if(embed === 'true'){return false;}
        
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

    const next = (answerData: any) => {
        if (currentSurvey) {
            const nextNodeId = CoreUtils.determineNextNode(currentSurvey, answerData);
            const nextPage = surveyDisplays.find(node => node.uId === nextNodeId);
            if (nextPage) {
                saveSurveyResponse(answerData, false);
                setCurrentSurvey(nextPage);
                populateComponentData(nextPage);
                setShowEnd(false);
            } else {
                saveSurveyResponse(answerData, true);
                setShowEnd(true);
            }
        }
    }

    const saveSurveyResponse = (data: any, surveyCompleted: boolean): void => {
        if (surveyId === TEMPLATE_KEY || mode === 'test') {
            return;
        }
        data.surveyCompleted = surveyCompleted;
        try {
            const userDetails = getSurveyUserInformation();
            let tempResponse = {
                uiId: currentSurvey?.data?.uId,
                id: currentSurvey?.data?.compId,
                data: data,
                compData: currentPageData,
            }
            axios.post(saveSurveyResponseDb(surveyId), {
                data: tempResponse,
                info: userDetails,
                anUserId: localStorage.getItem(`${surveyId}_${LIVE_SURVEY_USER_ID}`)
            }, { withCredentials: true });
        } catch (error: any) {
            console.warn("🚀 ~ file: IndividualResponse.tsx:81 ~ fetchSurveyResponseList ~ error:", error)
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
                <Box className={background?.value} sx={{ height: '100vh', backgroundColor: '#ffffff', overflowY: 'scroll' }} >
                    <FSLoader show={loading} />
                    <Box>
                        <DynamicComponentDisplay
                            theme={surveyTheme}
                            mode={mode}
                            compId={currentSurvey?.data?.compId}
                            data={currentPageData}
                            next={next}
                            uiId={currentSurvey?.data?.uId}
                            surveyId={surveyId}
                            imgData={imgData}
                        />
                    </Box>
                </Box>
            }
            {displayMssg.type !== 'error' && showEnd === true &&
                <SurveyEndPage />
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