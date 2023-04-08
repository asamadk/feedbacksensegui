import { Box, Typography } from '@mui/material'
import React from 'react'

function SmileyScaleDisplay(props : any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'20%'} >
        <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
        <SmileyDisplay/>
        <Box display={'flex'} justifyContent={'space-around'} >
            <Typography fontSize={'12px'} color={'#29292a'} fontWeight={200} >{props?.data?.leftText}</Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'12px'} color={'#29292a'} fontWeight={200} >{props?.data?.rightText}</Typography>
        </Box>
    </Box>
  )
}

export default SmileyScaleDisplay;

function SmileyDisplay(){
    return(
        <Box marginTop={'20px'} display={'flex'} justifyContent={'space-around'} >
            <Typography sx={{cursor : 'pointer'}} fontSize={'58px'} >😡</Typography>   
            <Typography sx={{cursor : 'pointer'}} fontSize={'58px'} >🙁</Typography>   
            <Typography sx={{cursor : 'pointer'}} fontSize={'58px'} >😐</Typography>   
            <Typography sx={{cursor : 'pointer'}} fontSize={'58px'} >🙂</Typography>   
            <Typography sx={{cursor : 'pointer'}} fontSize={'58px'} >😍</Typography>   
        </Box>
    )
}