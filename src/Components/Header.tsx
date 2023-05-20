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

function Header(props: any) {

    let navigate = useNavigate();
    let location = useLocation();

    const [showSurveyDetailHeader, setShowSurveyDetailHeader] = React.useState<Boolean>(false);
    const [inOrgSelectionMode, setInOrgSelectionMode] = React.useState<Boolean>(false);


    React.useEffect(() => {
        let currentPath: string = location.pathname;
        if (currentPath.includes('/user/create/organization')) {
            setInOrgSelectionMode(true);
        } else {
            setInOrgSelectionMode(false);
            if (currentPath.includes('/survey/detail/')) {
                setShowSurveyDetailHeader(true);
            } else {
                setShowSurveyDetailHeader(false);
            }
        }
    }, [location.pathname]);



    const handleRouteToHome = () => {
        if (inOrgSelectionMode === false) {
            navigate('/');
        }
    }

    return (
        <div style={bodyStyle} >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {inOrgSelectionMode === false && showSurveyDetailHeader === false &&
                    <div onClick={handleRouteToHome} style={{ display: 'flex', cursor: 'pointer', marginTop: '5px', marginBottom: '5px' }} >
                        <Typography style={{ color: '#f1f1f1', fontSize: '22px' }} variant='h4'>Feedback</Typography>
                        <Typography style={{ color: '#FFA500', fontSize: '22px' }} variant='h4'>Sense</Typography>
                    </div>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === false && <div><MainHeaderIcons /></div>}

                {inOrgSelectionMode === false && showSurveyDetailHeader === true &&
                    <div onClick={handleRouteToHome} style={{ display: 'flex', cursor: 'pointer', marginTop: '10px' }} >
                        <Typography style={{ color: '#f1f1f1', fontSize: '22px' }} variant='h4'>Feedback</Typography>
                        <Typography style={{ color: '#FFA500', fontSize: '22px' }} variant='h4'>Sense</Typography>
                    </div>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === true && <div><SurveyDetailHeader surveyId={props.surveyId} tabset={0} /></div>}

            </div>


        </div>
    )
}



export default Header