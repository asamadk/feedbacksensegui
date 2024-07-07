import { Box, Drawer, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { fieldOptions } from '../Utils/ConditionConstants'
import InfoIcon from '@mui/icons-material/Info';
import { colorPalette } from '../Utils/Constants'

function VariablesModal(props: { open: boolean, close: any,recordType :string}) {

    return (
        <Drawer
            anchor={'right'}
            open={props.open}
            onClose={props.close}
            sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        >
            <Box
                sx={{ width: 350,padding : 2 }}
                role="presentation"
            >
                <Typography variant='h6' fontWeight={600} >Choose Field</Typography>
                <Typography sx={{ fontSize: '12px', color: colorPalette.fsGray }} >
                    <InfoIcon sx={{ position: 'relative', top: '3px', fontSize: '15px', marginRight: '5px' }} />
                    Copy the Field API to use in email
                </Typography>
                <Grid container >
                    <Grid sx={{p : 1,fontWeight : 600}} xs={6} >Field Name</Grid>
                    <Grid sx={{p : 1,fontWeight : 600}} xs={6} >Field API</Grid>
                    
                    {
                        fieldOptions[props.recordType].map((field :any) => <>
                            <Grid sx={{p : 1}} xs={6} >{field.label}</Grid>
                            <Grid sx={{p : 1}} xs={6} >{`{{${field.value}}}`}</Grid>
                        </>)
                    }
                    
                </Grid>
            </Box>
        </Drawer>
    )
}

export default VariablesModal