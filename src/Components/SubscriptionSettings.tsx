import { Box, Button, Chip, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'

import React from 'react'
import CustomChip from './CustomChip'
import * as LayoutStyles from '../Styles/LayoutStyles'


const subscriptionSubContainer = {
    border : '1px #454545 solid', 
    color : '#f1f1f1', 
    borderRadius : '5px', 
    padding : '20px' ,
    width : '80%',
    display : 'flex',
    justifyContent : 'space-between'
}

const subscriptionDetailList = {
    display : 'flex', 
    justifyContent : 'space-between',
    borderBottom : '1px #454545 solid',
    paddingTop : '10px',
    paddingBottom : '10px'
}

function SubscriptionSettings() {
  return (
    <Box sx={LayoutStyles.globalSettingSubContainers} >
        <Box sx={{display : 'flex', justifyContent : 'space-between'}} >
            <Box sx={subscriptionSubContainer} >
                <Box sx={{textAlign : 'start'}} >
                    <Typography fontSize={14} >Current subscription : </Typography>
                    <Typography fontSize={24} >Free</Typography>
                </Box>
                <Box>
                    <CustomChip/>
                </Box>
            </Box>
            <Box sx={{marginLeft : '20px'}} >
                <Button sx={ButtonStyles.containedButton} variant="contained">Upgrade Subscription</Button>
            </Box>
        </Box>

        <Box>
            <Box sx={{textAlign : 'start', marginTop : '50px', marginBottom : '20px'}} >
                <Typography color={'#f1f1f1'} fontSize={20} >Subscription Details</Typography>
            </Box>

            <Box sx={subscriptionDetailList} style={{borderTop : '1px #454545 solid'}} >
                <Typography color={'#454545'} >Subscription Name </Typography>
                <Typography color={'#454545'} >Free </Typography>
            </Box>
            <Box sx={subscriptionDetailList} >
                <Typography color={'#454545'} >Billing cycle </Typography>
                <Typography color={'#454545'} >Monthly </Typography>
            </Box>
            <Box sx={subscriptionDetailList} >
                <Typography color={'#454545'} >Next invoice date </Typography>
                <Typography color={'#454545'} >April 13, 2023 </Typography>
            </Box>
            <Box sx={subscriptionDetailList} >
                <Typography color={'#454545'} >Response usage </Typography>
                <Typography color={'#454545'} >2/25000 </Typography>
            </Box>
            <Box sx={subscriptionDetailList} >
                <Typography color={'#454545'} >Response usage reset cycle  </Typography>
                <Typography color={'#454545'} >Monthly </Typography>
            </Box>
            <Box sx={subscriptionDetailList} >
                <Typography color={'#454545'} >Survey active   </Typography>
                <Typography color={'#454545'} >0/1 </Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default SubscriptionSettings