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

const tabsetList = [
    { id: 1, name: 'COLORS' },
    { id: 1, name: 'BACKGROUND' },
]

const localNavbar = {
    borderBottom: '1px #454545 solid',
    paddingBottom: '10px',
    textAlign: 'end',
    paddingRight: '10px', display: 'flex', justifyContent: 'space-between'
}

function DesignPreview() {
    const { surveyId } = useParams();

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

    return (
        <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)', overflowY: 'hidden' }} >
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
                        <ToggleButton color='info' value="laptop" aria-label="laptop">
                            <LaptopIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                        <ToggleButton color='info' value="phone" aria-label="phone">
                            <PhoneAndroidIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} >
                <Box width={'35%'} >
                    {
                        tabset === 0 &&
                        <SurveyThemeSelector
                            selectedBackground={selectedBackground}
                            updateBackground={rerenderBackgroundTheme}
                            updateTheme={rerenderSelectedTheme}
                            surveyId={surveyId}
                        />
                    }
                    {
                        tabset === 1 &&
                        <BackgroundTemplates
                            selectedTheme={selectedTheme}
                            updateTheme={rerenderBackgroundTheme}
                            surveyId={surveyId}
                        />
                    }
                </Box>
                <Box width={'65%'} >
                    <Box
                        className={selectedBackground?.value}
                        width={devices === 'phone' ? '40%' : '100%'}
                        height={'calc(100vh - 134px)'}
                    >
                        <SelectedThemeTest selectedTheme={selectedTheme} />
                        <PoweredBy />
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
        // paddingBottom: '40px',
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