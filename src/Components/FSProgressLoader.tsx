import { Backdrop, Box, LinearProgress, Typography } from '@mui/material'
import { colorPalette } from '../Utils/Constants'

function FSProgressLoader(props: any) {
    return (
        <>
            {props.show && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={props.show}
                >
                    <Box>
                        <Box sx={{borderRadius : '6px',padding : '10px',background : '#fff'}} >
                            <Box display={'flex'} textAlign={'start'} >
                                <Typography 
                                    height={'15px'}
                                    marginTop={'8px'}
                                    marginRight={'10px'} 
                                    fontSize={'12px'}
                                    color={colorPalette.fsGray} 
                                >Powered By</Typography>
                                <Typography 
                                    variant='h6'
                                    fontWeight={600}
                                    color={'#000000'}
                                >FeedbackSense</Typography>
                            </Box>
                            <LinearProgress color="secondary" />
                        </Box>
                    </Box>
                </Backdrop>
            )}
        </>
    )
}

export default FSProgressLoader