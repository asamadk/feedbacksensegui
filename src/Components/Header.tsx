import React from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router';
import MainHeaderIcons from '../HeaderComponents/MainHeaderIcons';
import SurveyDetailHeader from '../HeaderComponents/SurveyDetailHeader';
import Logo from './Logo';

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
                    <Box sx={{marginLeft : '10px'}} onClick={handleRouteToHome} >
                        <Logo/>
                    </Box>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === false && <div><MainHeaderIcons /></div>}

                {inOrgSelectionMode === false && showSurveyDetailHeader === true &&
                    <Box sx={{marginTop : '8px'}} onClick={handleRouteToHome} >
                        <Logo/>
                    </Box>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === true && <div><SurveyDetailHeader surveyId={props.surveyId} tabset={0} /></div>}

            </div>


        </div>
    )
}



export default Header