import { Box, Typography } from '@mui/material'
import React from 'react'
import ReactWordcloud from 'react-wordcloud';
import CustomTooltip from '../../CustomTooltip';

function WordCloud(props : any) {

    const options: any = {
        rotations: 2,
        rotationAngles: [0, 90],
        fontFamily : 'Apercu Pro',
        fontSizes : [15,50],
        color : '#f1f1f1'
    };

    return (
        <>
            <Box textAlign={'start'} padding={'20px'}>
                <Box display={'flex'} >
                    <Typography sx={{textDecoration : 'underline'}} color={'#f1f1f1'} variant='h6' marginBottom={'20px'} >Word Cloud</Typography>
                    <Box marginTop={'8px'} marginLeft={'2px'}>
                        <CustomTooltip
                            text='Visualize Key Concepts with Word Cloud: 
                            This feature creates a visual representation of the most frequently
                            mentioned words in your responses, highlighting dominant themes and 
                            ideas in an easily digestible format.'
                        />
                    </Box>
                </Box>
                <ReactWordcloud
                    words={props?.data}
                    options={options}
                />
            </Box>
        </>
    );
}

export default WordCloud