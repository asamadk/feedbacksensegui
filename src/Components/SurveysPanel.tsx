import { Button, Divider, FilledInput, Grid, IconButton, InputLabel, makeStyles, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import * as ButtonStyles from '../Styles/ButtonStyle'
import React from 'react'
import * as InputStyles from '../Styles/InputStyles';
import SurveyBlock from './SurveyBlock';

const buttonContainerStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between'
}

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFA500',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFA500',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFA500',
        },
    },
});

function SurveysPanel() {
    return (
        <Box sx={{ padding: '15px 20px' }} >
            <Typography sx={{ textAlign: 'start' }} variant='h5'>All Surveys</Typography>
            <Box sx={buttonContainerStyles} >
                <Box>
                    <Button 
                        sx={ButtonStyles.containedButton} 
                        style={{ width: 'fit-content', marginBottom: '15px', marginRight: '30px',textTransform : 'none' }} 
                        startIcon={<AddIcon />} 
                        variant='contained' >
                            Create new survey
                    </Button>
                    <Select sx={InputStyles.muiSelectStyle} value={10} size='small' >
                        <MenuItem value={10}>All survey types</MenuItem>
                        <MenuItem value={12}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <Select value={10} style={{ marginLeft: '10px' }} sx={InputStyles.muiSelectStyle} size='small' >
                        <MenuItem value={10}>All authors</MenuItem>
                        <MenuItem value={12}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </Box>
                <Box>
                    <CssTextField
                        size='small'
                        sx={{ input: { color: 'white' } }}
                        placeholder='Search surveys and folders..'
                        style={{ width: '250px' }}
                        InputProps={{
                            endAdornment: <SearchIcon sx={{ color: '#f1f1f1', paddingLeft: '5px' }} />
                        }}
                    />
                </Box>
            </Box>
            <div style={{ border: '0.5px #454545 solid', marginTop: '10px' }} />

            <Grid style={{marginTop : '20px'}} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(Array(6)).map((_, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <SurveyBlock />
                    </Grid>
                ))}
            </Grid>


        </Box>
    )
}

export default SurveysPanel