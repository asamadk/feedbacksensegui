import { Box, Typography } from '@mui/material'
import React from 'react'

const surveyActionContainer = {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#121212',
    border: '1px #454545 solid',
    borderRadius: '5px',
    textAlign: 'start',
    padding : '5px',
    width: '130px'
}

function SingleSurveyAction(props: any) {

    const highlightTextBackGround = (e: any) => {
        e.target.style.borderRadius = '5px'
        e.target.style.backgroundColor = '#454545';
    }

    const unhighlightTextBackGround = (e: any) => {
        e.target.style.backgroundColor = '#121212';
    }

    return (
        <>
            {props.open &&
                <Box sx={surveyActionContainer} >
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} >
                        Disable
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} >
                        Share
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} >
                        Duplicate
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} 
                        onClick = {props.changeFolder}
                        >
                        Move to folder
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        onClick={props.delete}
                        sx={{ color: '#D81159', padding: '5px' }}
                    >Delete
                    </Typography>
                </Box>
            }
        </>
    )
}

export default SingleSurveyAction