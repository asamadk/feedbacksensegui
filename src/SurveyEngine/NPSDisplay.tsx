import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';

function NPSDisplay(props: any) {

    const [position, setPosition] = useState('absolute');

    useEffect(() => {
        verifyLiveSurvey();
    }, []);

    const verifyLiveSurvey = () => {
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }

    const next = (index: any) => {
        props.next({
            value: index
        });
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={0}>
            <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
            <NpsCount
                next={next}
            />
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

function NpsCount(props: any) {

    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    const handleMouseEnter = (e: any) => {
        e.target.style.padding = '30px'
        e.target.style.transition = '0.3s'
    }

    const handleMouseLeave = (e: any) => {
        e.target.style.padding = '15px'
    }

    return (
        <Box flexWrap={'wrap'} marginTop={'20px'} marginBottom={'20px'} display={'flex'} justifyContent={isSmallScreen ? 'start' : 'space-between'}>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('1')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'1'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('2')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'2'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('3')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'3'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('4')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'4'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('5')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'5'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('6')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'6'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('7')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'7'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('8')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'8'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('9')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'9'}</Typography>
            </Box>
            <Box border={'1px #808080 solid'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: 'pointer', marginRight: '7px',marginTop : '5px' }} onClick={() => props.next('10')} padding={'15px'} borderRadius={'5px'} bgcolor={'rgb(144 140 141 / 10%)'} >
                <Typography color={'#454545'} >{'10'}</Typography>
            </Box>
        </Box>
    )
}