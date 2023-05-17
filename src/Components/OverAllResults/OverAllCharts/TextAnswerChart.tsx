import { Box, Divider, Typography } from '@mui/material'
import React, { useState } from 'react'

const mainContainer = {
    marginTop: '20px',
    color: '#f1f1f1',
    textAlign: 'start',
    padding: '20px'
}

type propsType = {
    id: number,
    data: any
}

function TextAnswerChart(props: propsType) {

    const [data, setData] = useState(props.data);

    return (
        <Box sx={mainContainer} >
            <Box marginBottom={'20px'} >
                <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'} >Question : {props?.data?.question}</Typography>
            </Box>

            <Typography fontWeight={600} >Answers</Typography>
            {
                data?.statsArr?.map((answers: string) => {
                    return (
                        <Box>
                            <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
                            <Box display={'flex'} justifyContent={'space-between'} >
                                <Typography color={'#808080'} >{answers}</Typography>
                            </Box>
                        </Box>
                    )
                })
            }
            <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
            <Box>
                <Typography color={'#808080'} >
                    Total : <span style={{ color: '#f1f1f1' }}>{data?.statsArr?.length} response</span>
                </Typography>
            </Box>
        </Box>
    )
}

export default TextAnswerChart