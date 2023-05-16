import { Box, Button, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography, createTheme } from '@mui/material'
import React, { useRef } from 'react'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LaptopIcon from '@mui/icons-material/Laptop';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import CustomTabSet from '../Components/CustomTabSet';
import SurveyThemeSelector from '../Components/SurveyThemeSelector';
import EmailSurveyTemplate from '../Components/EmailSurveyTemplate';
import { useParams } from 'react-router';
import PoweredBy from '../Components/PoweredBy';

const tabsetList = [
    { id: 1, name: 'THEMES' },
    // { id: 2, name: 'EMAIL TEMPLATES' }
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

    const rerenderSelectedTheme = (themeData : any) => {
        setSelectedTheme(themeData);
    }

    return (
        <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)',overflowY : 'hidden' }} >
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
                        <ToggleButton color='warning' value="laptop" aria-label="laptop">
                            <LaptopIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                        <ToggleButton color='warning' value="phone" aria-label="phone">
                            <PhoneAndroidIcon sx={{ color: '#f1f1f1' }} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{display : 'flex',justifyContent : 'center'}} >
                <Box width={'35%'} >
                    {tabset === 0 &&  <SurveyThemeSelector updateTheme={rerenderSelectedTheme} surveyId={surveyId} />}
                    {tabset === 1 &&  <EmailSurveyTemplate/>}
                </Box>
                <Box width={'65%'} >
                    <Box 
                        width={devices === 'phone' ? '40%' : '100%'} 
                        sx={{backgroundColor : selectedTheme?.color[0]}} 
                        height={'calc(100vh - 134px)'}
                    >
                        <SelectedThemeTest selectedTheme={selectedTheme} />
                        <PoweredBy/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default DesignPreview;

function SelectedThemeTest( {selectedTheme} : any){

    const lightTheme = createTheme({
        palette: {
          mode: 'light',
        },
      });

    return(
        <ThemeProvider theme={lightTheme} >
            <Box sx={{position: 'relative',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width : '70%'}} >
                <Box margin={'20px'} >
                    <TextField 
                        value={selectedTheme?.header} 
                        size='small' 
                        sx={{width : '60%', color : selectedTheme?.textColor}} >    
                    </TextField>
                </Box>
                <Box>
                <Button 
                    style={{
                        width : 'fit-content', 
                        marginRight : '15px', 
                        backgroundColor:selectedTheme?.color[1],
                        color : selectedTheme?.textColor
                    }} 
                    variant="outlined">Cancel</Button>
                </Box>
            </Box>
        </ThemeProvider>
    )
}