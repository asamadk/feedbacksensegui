import { Box, Button, Modal, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Logo from '../Logo';
import { containedButton } from '../../Styles/ButtonStyle';

function PaymentSuccess() {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    let hydrate = false;

    useEffect(() => {
        if (hydrate === false) {
            hydrate = true;
        }
    });

    return (
        <Box sx={{backgroundColor : defaultColor.backgroundColor,height : 'calc(100vh - 57px)'}} >
            <Box paddingTop={'10%'}  >
                <Box textAlign="center" sx={{backgroundColor : defaultColor.primaryColor,pb : 2,pt : 2}} >
                    <Box width={'fit-content'} margin={'auto'} >
                        <Logo/>
                    </Box>
                    <Typography color={'white'} variant="h4" sx={{ fontWeight: 'bold' }}>
                        Payment Complete!
                    </Typography>
                    <Typography color={'#808080'} variant="body1" sx={{ mb: 1 }}>
                        Thank you for completing your secure online payment.
                    </Typography>
                    <Box textAlign="center">
                        <Button
                            sx={{...containedButton,width : 'fit-content'}}
                            variant="contained"
                            color="primary"
                            size="small"
                            href="/"
                        >
                            GO BACK
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default PaymentSuccess