import { Box, Button, Grid, TextField, styled } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { colorPalette } from '../../Utils/Constants';
import { textFieldStyle } from '../../Styles/InputStyles';
import SearchIcon from '@mui/icons-material/Search';
import FlowBlock from '../FlowBlock';
import FlowTemplateBlockComponent from '../FlowTemplateBlockComponent';

const CssTextField = styled(TextField)(textFieldStyle);

const headerContainer = {
    borderBottom: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 20px'
}

const bodyContainer = {
    overflowY: 'scroll',
    height: 'calc(100vh - 70px)'
}

function FlowDashboard(props: { type: 'flows' | 'templates' }) {

    const [type, setType] = useState<'flows' | 'templates'>(props.type);
    const [flows, setFlows] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [templates, setTemplates] = useState([1, 2, 3, 4, 5]);

    useEffect(() => {
        setType(props.type)
    }, [props.type]);

    return (
        <Box>
            <Box sx={headerContainer} >
                <Box>
                    <Button
                        className='create-new-survey-button'
                        sx={outlinedButton}
                        style={{ width: 'fit-content', marginBottom: '15px', textTransform: 'none' }}
                        startIcon={<AddIcon />}
                        variant='outlined'
                    >
                        Add Filter
                    </Button>
                </Box>
                <Box>
                    <CssTextField
                        size='small'
                        sx={{ input: { color: colorPalette.darkBackground }, marginTop: '10px' }}
                        placeholder={`Search ${props.type}`}
                        InputProps={{
                            endAdornment: <SearchIcon sx={{ color: colorPalette.darkBackground, paddingLeft: '5px' }} />
                        }}
                    />
                    {
                        type === 'flows' &&
                        <Button
                            className='create-new-survey-button'
                            sx={containedButton}
                            style={{ width: 'fit-content', marginBottom: '15px', marginLeft: '10px', textTransform: 'none' }}
                            startIcon={<AddIcon />}
                            variant='contained'
                        >
                            Create Flows
                        </Button>
                    }
                </Box>
            </Box>
            <Box sx={bodyContainer} >
                <Grid
                    container
                    padding={'20px'}
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                    {type === 'flows' && flows.map((flow: any) => (
                        <Grid item xs={2} sm={4} md={4} key={flow}>
                            <FlowBlock />
                        </Grid>
                    ))}

                    {type === 'templates' && templates.map((template: any) => (
                        <Grid item xs={2} sm={4} md={4} key={template}>
                            <FlowTemplateBlockComponent />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default FlowDashboard