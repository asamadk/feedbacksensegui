import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import CustomTooltip from '../../CustomTooltip';

const TopicsDisplay = ({ topics }: any) => {
    return (
        <Box textAlign={'start'} padding={'20px'}>
            <Box display={'flex'} >
                <Typography color={'#f1f1f1'} variant='h6' marginBottom={'20px'} sx={{ textDecoration: 'underline' }} >Topic Cluster</Typography>
                <Box marginTop={'8px'} marginLeft={'2px'}>
                    <CustomTooltip
                        text='Discover key themes with Topic Modeling: This feature automatically analyzes responses to 
                        uncover and group common topics, providing you with instant insights into prevailing trends and 
                        sentiments in your survey data.'
                    />
                </Box>
                <Box marginLeft={'10px'} >
                    <Chip label='Beta' color="error" size="small" />
                </Box>
            </Box>
            <Box maxHeight={'300px'} sx={{ overflowY: 'scroll' }} >
                {topics.map((topic: string[], index: number) => (
                    <Box key={index} sx={{ marginBottom: '20px', display: 'flex' }}>
                        <Typography color={'#f1f1f1'} gutterBottom>
                            Topic {index + 1}
                        </Typography>
                        <Stack direction="row" sx={{ marginLeft: '20px' }} spacing={1}>
                            {topic.map((word, wordIndex) => (
                                <Chip key={wordIndex} label={word} />
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TopicsDisplay;
