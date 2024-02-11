import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../../../Utils/Constants'

const mainContainer = {
    marginTop: '20px',
    color: colorPalette.darkBackground,
    textAlign: 'start',
    padding: '20px',
}

type propsType = {
    id: number,
    data: any
}

const dateChip = {
    width: 'fit-content',
    background: colorPalette.textSecondary,
    padding: '5px 10px',
    borderRadius: '5px',
    marginTop: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    marginRight: '10px'
}

function DateCharts(props: propsType) {
    return (
        <Box sx={mainContainer} >
            <Box marginBottom={'20px'} >
                <Typography fontSize={20} color={colorPalette.darkBackground} paddingBottom={'10px'} >{props?.data?.question}</Typography>
            </Box>
            <Typography fontWeight={600} >Answers</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }} >
                {props?.data?.actions?.map((answer: string) => {
                    return (
                        <Box sx={dateChip} >
                            <Box display={'flex'} justifyContent={'space-between'} >
                                <Typography color={colorPalette.darkBackground} >{new Date(answer)?.toDateString()}</Typography>
                            </Box>
                        </Box>

                    )
                })}
            </Box>
            <Box>
                <Typography marginTop={'10px'} color={colorPalette.darkBackground} >
                    Total : <span style={{ color: colorPalette.fsGray }}>{props?.data?.clickFrequency} response</span>
                </Typography>
            </Box>
        </Box>
    )
}

export default DateCharts