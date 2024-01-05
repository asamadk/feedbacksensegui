import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

const mainContainer = {
    marginTop: '20px',
    color: '#f1f1f1',
    textAlign: 'start',
    padding: '20px',
}

type propsType = {
    id: number,
    data: any
}

function DateCharts(props: propsType) {
    return (
        <Box sx={mainContainer} >
            <Box marginBottom={'20px'} >
                <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'} >Question : {props?.data?.question}</Typography>
            </Box>
            <Typography fontWeight={600} >Answers</Typography>
            {props?.data?.actions?.map((answer: string) => {
                return (
                    <Box sx={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }} >
                        {/* <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} /> */}
                        <Box display={'flex'} justifyContent={'space-between'} >
                            <Typography color={'#f1f1f1'} >{new Date(answer)?.toDateString()}</Typography>
                        </Box>
                    </Box>
                )
            })}
            <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
            <Box>
                <Typography color={'#808080'} >
                    Total : <span style={{ color: '#f1f1f1' }}>{props?.data?.clickFrequency} response</span>
                </Typography>
            </Box>
        </Box>
    )
}

export default DateCharts