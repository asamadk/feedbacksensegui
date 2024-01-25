import { Box, Button, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography, createTheme, useMediaQuery } from '@mui/material'
import React, { useRef } from 'react'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LaptopIcon from '@mui/icons-material/Laptop';
import CustomTabSet from '../Components/CustomTabSet';
import SurveyThemeSelector from '../Components/SurveyThemeSelector';
import BackgroundTemplates from '../Components/BackgroundTemplates';
import { useParams } from 'react-router';
import PoweredBy from '../Components/PoweredBy';
import '../Styles/CSS/Backgrounds.css'
import { useSelector } from 'react-redux';
import { setSurvey } from '../Redux/Reducers/surveyReducer';
import { useDispatch } from 'react-redux';
import { colorPalette } from '../Utils/Constants';

const tabsetList = [
    { id: 1, name: 'COLORS' },
    { id: 1, name: 'BACKGROUND' },
]

const localNavbar = {
    background : colorPalette.textSecondary,
    paddingBottom: '10px',
    textAlign: 'end',
    paddingRight: '10px', display: 'flex', justifyContent: 'space-between'
}

function DesignPreview() {
    
    const { surveyId } = useParams();
    const dispatch = useDispatch<any>();

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const surveysState = useSelector((state: any) => state.surveys);
    
    const [selectedTheme, setSelectedTheme] = React.useState<any>();
    const [selectedBackground, setSelectedBackground] = React.useState<any>();
    const [tabset, setTabset] = React.useState(0);
    const [devices, setDevices] = React.useState('laptop');

    const handleDevices = (
        event: React.MouseEvent<HTMLElement>,
        newDevices: string,
    ) => {
        if (newDevices != null) {
            setDevices(newDevices);
        }
    };

    const changetabset = (value: number) => {
        setTabset(value);
    }

    const rerenderSelectedTheme = (themeData: any) => {
        setSelectedTheme(themeData);
    }

    const rerenderBackgroundTheme = (backgroundData: any) => {
        setSelectedBackground(backgroundData);
    }

    const updateThemeReduxState = (designObj : string) => {
        const tempSurveys = JSON.parse(JSON.stringify(surveysState));
        tempSurveys?.forEach((srv: any) => {
          if (srv.id === surveyId) {
            srv.survey_design_json = designObj;
            return;
          }
        });
        dispatch(setSurvey(tempSurveys));
      }

    return (
        <Box sx={{ backgroundColor: defaultColor?.backgroundColor, height: 'calc(100vh - 69px)', overflowY: 'hidden' }} >
            <Box sx={localNavbar} >
                <Box sx={{ position: 'relative', right: '-20px' }}>
                    <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={tabset} />
                </Box>
                <Box>
                    <ToggleButtonGroup
                        value={devices}
                        onChange={handleDevices}
                        exclusive
                        aria-label="device"
                        sx={{ marginTop: '5px' }}
                    >
                        <ToggleButton color='success' value="laptop" aria-label="laptop">
                            <LaptopIcon sx={{ color: colorPalette.secondary }} />
                        </ToggleButton>
                        <ToggleButton color='success' value="phone" aria-label="phone">
                            <PhoneAndroidIcon sx={{ color: colorPalette.secondary }} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center',background : colorPalette.textSecondary,boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }} >
                <Box width={'35%'} >
                    {
                        tabset === 0 &&
                        <SurveyThemeSelector
                            selectedBackground={selectedBackground}
                            updateBackground={rerenderBackgroundTheme}
                            updateTheme={rerenderSelectedTheme}
                            surveyId={surveyId}
                            updateThemeReduxState={updateThemeReduxState}
                        />
                    }
                    {
                        tabset === 1 &&
                        <BackgroundTemplates
                            selectedTheme={selectedTheme}
                            updateTheme={rerenderBackgroundTheme}
                            surveyId={surveyId}
                            updateThemeReduxState={updateThemeReduxState}
                        />
                    }
                </Box>
                <Box width={'65%'} borderRadius={'6px'}>
                    <Box
                        className={selectedBackground?.value}
                        width={devices === 'phone' ? '40%' : '97%'}
                        height={'calc(100vh - 197px)'}
                        sx={{transition: 'all 0.5s ease 0s',borderRadius : '6px'}}
                    >
                        <SelectedThemeTest selectedTheme={selectedTheme} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DesignPreview;

function SelectedThemeTest({ selectedTheme }: any) {

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    const inputStyleCSS = {
        borderRadius: '10px',
        width: ' 60%',
        border: 'none',
        padding: '12px',
        backgroundColor: selectedTheme?.shade,
        color: selectedTheme?.color[0],
        margin: 'auto'
    }

    return (
        <ThemeProvider theme={lightTheme} >
            <Box sx={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%' }} >
                <Box margin={'20px'} >
                    <Typography marginBottom={'20px'} fontSize={'26px'} color={selectedTheme?.color[0]} fontWeight={200} >
                        We love FeedbackSense!
                    </Typography>
                    <input
                        style={inputStyleCSS}
                        value={selectedTheme?.header}
                    />
                </Box>
                <Box>
                    <Button
                        style={{
                            width: 'fit-content',
                            marginRight: '15px',
                            backgroundColor: selectedTheme?.color[0],
                            color: selectedTheme?.textColor
                        }}
                        variant="outlined">Cancel</Button>
                </Box>
            </Box>
        </ThemeProvider>
    )
}