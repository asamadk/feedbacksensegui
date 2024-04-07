import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CustomChip from './CustomChip';

const surveyBlockMainContainer = {
    borderRadius: '5px',
    cursor: 'pointer',
    height: '197px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
}

function FlowBlock() {
    return (
        <Box sx={{ ...surveyBlockMainContainer, backgroundColor: colorPalette.textSecondary }} >
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', height: '50px' }}
            >
                <Box>
                    <Tooltip title={'Flow Name'} >
                        <Typography
                            // aria-owns={openName ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            sx={{ paddingTop: '10px', color: colorPalette.textPrimary }}
                        >
                            Flow Name
                        </Typography>
                    </Tooltip>
                </Box>
                <Box display={'flex'} >
                    <Tooltip title='More' >
                        <IconButton id="basic-button"
                            sx={{ color: colorPalette.fsGray, width: '50px' }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </Tooltip>
                    {/* <SingleSurveyAction
                        anchor={anchorEl}
                        changeFolder={handleChangeFolderClick}
                        delete={handleDeleteOptionClick}
                        open={open}
                        survey={survey}
                        closeAndUpdate={handleCloseAndUpdate}
                        updateSurveyList={updateSurveyList}
                        close={handleCloseSingleSurveyAction}
                        updatePublishStatus={updateSurveyPublishStatus}
                        updateActiveSurveyCount={updateActiveSurveyCount}
                    /> */}
                </Box>
            </Box>
            <Box sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex', marginTop: '40px', marginBottom: '10px', height: 24 }} ></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                    <CustomChip status={'success'} />
                    <Box>
                        <Typography variant='subtitle1' sx={{ fontSize: 14, marginLeft: '5px', color: colorPalette.fsGray }} >
                            {/* {new Date().toDateString()} */}
                            Edited by <b>Adam</b> 3 days ago
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default FlowBlock