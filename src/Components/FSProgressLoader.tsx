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
                            <Box display={'flex'} >
                                <Typography marginTop={'8px'} marginRight={'10px'} color={colorPalette.darkBackground} >Powered By</Typography>
                                <Typography variant='h4' color={colorPalette.darkBackground} >FeedbackSense</Typography>
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