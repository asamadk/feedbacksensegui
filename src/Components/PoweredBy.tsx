import { Box, Typography } from '@mui/material'
import { colorPalette } from '../Utils/Constants';

const mainContainerCss = {
  padding: '5px',
  borderRadius: '6px',
  cursor: 'pointer',
  width : 'fit-content',
  position : 'absolute',
  bottom : 0
}

function PoweredBy(props: any) {
  return (
    <Box sx={mainContainerCss} >
      {
        props.imgData == null ?
          <Box sx={{ display: 'flex', background: '#ffffff', padding: '5px 10px', borderRadius: '6px',justifyContent : 'center' }} >
            <Typography marginTop={'3px'} fontSize={'12px'} color={'black'} marginRight={'5px'} >Powered by</Typography>
            <Typography fontWeight={900} fontSize={'16px'} color={colorPalette.primary} >Retain</Typography>
            <Typography fontWeight={900} fontSize={'16px'} color={colorPalette.primary} >Sense</Typography>
          </Box> :
          <>
            <img style={{ height: '50px', borderRadius: '6px' }} src={props.imgData} alt="Uploaded Preview" />
          </>
      }
    </Box>
  )
}

export default PoweredBy