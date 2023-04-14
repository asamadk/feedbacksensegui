import { Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import FSLoader from '../../Components/FSLoader';
import { getLiveSurveyData } from '../../Utils/Endpoints';
import DynamicComponentDisplay from '../DynamicComponentDisplay';

function SurveyDisplays() {

    const { surveyId } = useParams();

    const [ loading , setLoading] = React.useState(false);
    const [currentPage , setCurrentPage] = useState(0);
    const [surveyTheme, setSurveyTheme] = useState<any>();
    const [surveyDiplays, setSurveyDisplays] = useState<any[]>([]);
    const [currentSurvey, setCurrentSurvey] = useState<any>();
    const [currentPageData, setCurrentPagedata] = useState<any>();
    const [ displayMssg, setDisplayMssg ] = useState({
        message : '',
        type : 'success'
    });
    
    useEffect(() => {
        fetchLiveSurveyNodes();
    },[]);

    const fetchLiveSurveyNodes = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getLiveSurveyData(surveyId));
            setLoading(false);
            setDisplayMssg({
                message : data?.message,
                type : data?.success === true ? 'success' : 'error'
            });
            const resData = data.data;
            setCurrentPage(0);
            setSurveyDisplays(resData.nodes);
            setSurveyTheme(resData.theme);
            setCurrentSurvey(resData.nodes[0]);
            populateComponentData(resData.nodes[0]);
        } catch (error : any ) {
            setLoading(false);
            console.log(error?.response?.data?.message)
        }
    }

    const populateComponentData = (comp : any ) => {
        if(comp == null){return;}
        const compConfigStr : string = comp?.data?.compConfig
        if(compConfigStr != null && compConfigStr.length > 0){
            // console.log("🚀 ~ file: SurveyDisplays.tsx:54 ~ populateComponentData ~ compConfigStr:", compConfigStr)
            setCurrentPagedata(JSON.parse(compConfigStr));
        }
    }

    const next = () => {
        if(currentPage < surveyDiplays?.length){
            setCurrentPage(currentPage + 1);
        }
        
    }

    return (
        <Box sx={{height: '100vh',backgroundColor: surveyTheme?.color[0]}} >
            {displayMssg.type === 'error' && <DisplayError/>}
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
    )
}

export default SurveyDisplays

//TODO show error page here
function DisplayError(){
    return(
        <Box>

        </Box>
    )
}