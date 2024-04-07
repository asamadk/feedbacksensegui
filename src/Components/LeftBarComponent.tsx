import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { colorPalette } from '../Utils/Constants'
import { sideBarListType } from '../Utils/types'

type propType = {
    header: string,
    list: sideBarListType[],
    selected : string,
    callback : any
}

const mainContainer = {
    background: colorPalette.secondary,
    width: '18%',
    minWidth: '210px',
    height: 'calc(100vh - 40px)',
    textAlign: 'start',
    padding : '20px',
    color : colorPalette.darkBackground
}

const listText = {
    marginTop : '10px',
    fontWeight : '600',
    cursor : 'pointer',
    color : colorPalette.fsGray,
    width : 'fit-content'
}

const selectedListText = {
    marginTop : '10px',
    fontWeight : '600',
    cursor : 'pointer',
    color : colorPalette.primary,
    width : 'fit-content'
    // textDecoration : 'underline'
}

function LeftBarComponent(props: propType) {

    const [selectedTab, setSelectedTab] = useState(props.selected);

    const handleTabChange = (event : any) => {
        const selectedVal = event.target.id;
        setSelectedTab(selectedVal);
        props.callback(selectedVal);
    }

    return (
        <Box sx={mainContainer} >
            <Typography variant='h5' fontWeight={550}  >{props.header}</Typography>
            <Box marginTop={'40px'} >
                {
                    props.list?.map(list => (
                        <Box key={list.value} >
                            <Typography
                                id={list.value}
                                onClick={handleTabChange} 
                                sx={ selectedTab === list.value ? selectedListText : listText} 
                            >{list.label}</Typography>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default LeftBarComponent