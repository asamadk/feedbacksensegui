import { Box, Typography } from '@mui/material'
import React from 'react'

function NPSDisplay(props : any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'20%'} >
        <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
        <NpsCount/>
        <Box display={'flex'} justifyContent={'space-around'} >
            <Typography fontSize={'12px'} color={'#29292a'} fontWeight={200} >{props?.data?.leftText}</Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={200} ></Typography>
            <Typography fontSize={'12px'} color={'#29292a'} fontWeight={200} >{props?.data?.rightText}</Typography>
        </Box>
    </Box>
  )
}

export default NPSDisplay

function NpsCount(){
    return(
        <Box marginTop={'20px'} marginBottom={'20px'} display={'flex'} justifyContent={'space-around'} >
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'1'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'2'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'3'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'4'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'5'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'6'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'7'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'8'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'9'}</Typography>
            </Box>
            <Box padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'10'}</Typography>
            </Box>
        </Box>
    )
}