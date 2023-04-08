import { Box, IconButton, Typography } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';

function RatingScaleDisplay(props: any) {
    return (
        <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'20%'} >
            <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
            <SmileyDisplay range={props?.data?.range} />
            <Box display={'flex'} justifyContent={'space-around'} >
                <Typography fontSize={'12px'} color={'#29292a'} fontWeight={500} >{props?.data?.leftText}</Typography>
                {
                    Array.from(Array((props?.data?.range))?.keys())?.map(ran => {
                        return (
                            <Typography fontSize={'20px'} color={'#29292a'} fontWeight={400} ></Typography>
                        )
                    })
                }
                <Typography fontSize={'12px'} color={'#29292a'} fontWeight={500} >{props?.data?.rightText}</Typography>
            </Box>
        </Box>
    )
}

export default RatingScaleDisplay

function SmileyDisplay(props: any) {
    return (
        <Box marginTop={'20px'} display={'flex'} justifyContent={'space-around'} >
            {
                Array.from(Array(props?.range)?.keys())?.map(ran => {
                    return (
                        <>
                            <IconButton>
                                <StarBorderIcon sx={{fontSize : '58px'}} fontSize='large' />
                            </IconButton>
                        </>
                    )
                })
            }
        </Box>
    )
}