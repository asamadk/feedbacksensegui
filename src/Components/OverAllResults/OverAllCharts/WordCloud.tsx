import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import WordCloud from 'react-d3-cloud';
import CustomTooltip from '../../CustomTooltip';
import { colorPalette } from '../../../Utils/Constants';

function CustomWordCloud(props: any) {

    return (
        <>
            <Box textAlign={'start'} padding={'20px'}>
                <Box display={'flex'} >
                    <Typography sx={{ textDecoration: 'underline' }} color={colorPalette.darkBackground} variant='h6' marginBottom={'20px'} >Word Cloud</Typography>
                    <Box marginTop={'8px'} marginLeft={'2px'}>
                        <CustomTooltip
                            text='Visualize Key Concepts with Word Cloud: 
                            This feature creates a visual representation of the most frequently
                            mentioned words in your responses, highlighting dominant themes and 
                            ideas in an easily digestible format.'
                        />
                    </Box>
                </Box>
                <Box sx={{maxWidth : '400px'}} >
                    <WordCloud
                        data={props?.data}
                        font={'Apercu Pro'}
                        spiral="rectangular"
                        random={Math.random}
                        fontSize={(word) => Math.max(Math.log2(word.value) * 50, 20)}
                        rotate={(word) => word.value % 360}
                    />
                </Box>
            </Box>
        </>
    );
}

export default CustomWordCloud