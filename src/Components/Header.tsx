import React from 'react'
import { Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router';
import MainHeaderIcons from '../HeaderComponents/MainHeaderIcons';
import SurveyDetailHeader from '../HeaderComponents/SurveyDetailHeader';

const bodyStyle: {} = {
    backgroundColor: '#1E1E1E',
    padding: '10px 20px',
    borderBottom: '1px #454545 solid'
}

function Header(props : any) {

    let navigate = useNavigate();
    let location = useLocation();

    const [showSurveyDetailHeader, setShowSurveyDetailHeader] = React.useState<Boolean>(false);
    const [inOrgSelectionMode, setInOrgSelectionMode] = React.useState<Boolean>(false);


    React.useEffect(() => {
        let currentPath: string = location.pathname;
        if(currentPath.includes('/user/create/organization')){
            setInOrgSelectionMode(true);
        }else{
            setInOrgSelectionMode(false);
            if (currentPath.includes('/survey/detail/')) {
                setShowSurveyDetailHeader(true);
            } else {
                setShowSurveyDetailHeader(false);
            }
        }
    }, [location.pathname]);



    const handleRouteToHome = () => {
        // localStorage.removeItem(SURVEY_LOCAL_KEY);
        if(inOrgSelectionMode === false){
            navigate('/');
        }
    }

    return (
        <div style={bodyStyle} >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div onClick={handleRouteToHome} style={{ display: 'flex', cursor: 'pointer' }} >
                    <Typography style={{ color: '#f1f1f1', fontSize: '30px' }} variant='h4'>Feedback</Typography>
                    <Typography style={{ color: '#FFA500', fontSize: '30px' }} variant='h4'>Sense</Typography>
                </div>

                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === false && <div><MainHeaderIcons /></div>}
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === true && <div><SurveyDetailHeader surveyId={props.surveyId} tabset={0} /></div>}

            </div>


        </div>
    )
}



export default Header