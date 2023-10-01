import { Box, Divider, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router';

function TemplateBlock({ template }: any) {

    const onHoverStart = (event: any) => {
        event.currentTarget.style.border = '1px #808080 solid';
    }

    const onHoverEnd = (event: any) => {
        event.currentTarget.style.border = '1px #454545 solid';
    }

    const navigate = useNavigate();

    const handleClickTemplateDetails = (templateId: string) => {
        navigate(
            `/template/details/${templateId}`,
            {state: {...template}}
        );
    }

    return (
        <Box
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            sx={{ margin: '10px', borderRadius: '10px', border: '1px #454545 solid', backgroundColor: '#1E1E1E', cursor: 'pointer'}}
            onClick={() => handleClickTemplateDetails(template?.id)}
        >
            <Box sx={{ backgroundColor: '#006dff', borderRadius: '10px 10px 0px 0px' }} padding={'15px'} >
                <Typography
                    textAlign={'start'}
                    fontSize={14}
                    color={'white'}
                >
                    {`${template?.name?.substring(0, 35)} ${template?.name.length > 35 ? '...' : ''}`}
                </Typography>
            </Box>
            <Divider sx={{ color: '#454545' }} />
            <Box height={'50px'} marginBottom={'50px'} padding={'15px'} >
                <Typography
                    textAlign={'start'}
                    fontSize={14}
                    color={'white'}
                >
                    {`${template?.description?.substring(0, 80)} ${template?.description?.length > 80 ? '...' : ''}`}
                </Typography>
            </Box>
            <Divider sx={{ color: '#454545' }} />
            <Box padding={'15px'} display={'flex'} justifyContent={'space-between'} color={'#808080'}>
                <Typography fontSize={'14px'} >{template?.questionCount} questions</Typography>
                <Box display={'flex'} >
                    <AccessTimeIcon sx={{ marginRight: '5px' }} />
                    <Typography fontSize={'14px'} >{`< ${template?.timeTaken} minute`}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default TemplateBlock