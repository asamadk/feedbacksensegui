import { Box, Button, styled, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { globalSettingSubContainers } from '../Styles/LayoutStyles'
import { textFieldStyle } from '../Styles/InputStyles';
import { containedButton } from '../Styles/ButtonStyle';
import { colorPalette } from '../Utils/Constants';
import CheckIcon from '@mui/icons-material/Check';

const CssTextField = styled(TextField)(textFieldStyle);

function RedeemCodeLayout() {

  const [coupon,setCoupon] = useState('');
  
  function applyCoupon(){
    console.log("🚀 ~ RedeemCodeLayout ~ coupon:", coupon);
  }

  return (
    <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 80px)' }} >
      <img style={{width : '200px'}} src='/appsumo.png' alt='appsumo' />
      <Box sx={{ marginTop: '10%' }} fontSize={'small'} textAlign={'start'} margin={'auto'} width={'49%'} >
        <Typography fontWeight={600} textAlign={'start'} variant='h5' >
          Redeem Coupon
        </Typography>
        <Typography textAlign={'start'} sx={{ fontSize: '15px', marginBottom: '10px', color: colorPalette.fsGray }} >
          Hey SuMolings! Redeem your AppSumo code
        </Typography>
        {/* <Typography>
          <CheckIcon sx={{position : 'relative',top : '5px'}} color='secondary' /> 
          Enter your code & follow the checkout process to gain access to RetainSense
        </Typography>
        <Typography marginTop={'10px'} >
          <CheckIcon sx={{position : 'relative',top : '5px'}} color='secondary' /> 
          The first code will be automatically activated after the checkout process.
        </Typography> */}
        <Typography marginTop={'10px'} >
          <CheckIcon sx={{position : 'relative',top : '5px'}} color='secondary' /> 
          If you have purchased multiple codes, please send us mail on <b>support@retainsense.com</b>
          and withing <b>24 Hours</b> all the codes will be activated.
        </Typography>
        {/* <Box marginTop={'20px'} >
          <CssTextField 
            size='small' 
            label='AppSumo Code' 
            fullWidth 
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button onClick={applyCoupon} sx={containedButton} >Apply Coupon</Button>
        </Box> */}
      </Box>
    </Box>

  )
}

export default RedeemCodeLayout