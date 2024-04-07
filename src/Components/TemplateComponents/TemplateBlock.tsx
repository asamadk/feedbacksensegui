import { Box, Divider, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { colorPalette } from '../../Utils/Constants';

const subContainer = { 
    color : colorPalette.darkBackground,
    borderRadius: '6px 6px 0px 0px',
    minHeight  : '50px'
}

const mainContainer = { 
    margin: '10px', 
    borderRadius: '6px', 
    backgroundColor: colorPalette.background, 
    cursor: 'pointer',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
}

function TemplateBlock({ template }: any) {

    const navigate = useNavigate();

    const handleClickTemplateDetails = (templateId: string) => {
        navigate(
            `/template/details/${templateId}`,
            {state: {...template}}
        );
    }

    return (
        <Box
            sx={mainContainer}
            onClick={() => handleClickTemplateDetails(template?.id)}
        >
            <Box sx={subContainer} padding={'15px'} >
                <Typography
                    textAlign={'start'}
                    fontSize={14}
                    fontWeight={600}
                >
                    {`${template?.name}`}
                </Typography>
            </Box>
            <Box padding={'15px'} >
                <Typography
                    textAlign={'start'}
                    fontSize={14}
                    color={'gray'}
                >
                    {`${template?.description?.substring(0, 80)} ${template?.description?.length > 80 ? '...' : ''}`}
                </Typography>
            </Box>
            <Box padding={'15px'} display={'flex'} justifyContent={'space-between'} color={colorPalette.primary}>
                <Typography fontSize={'14px'} >{template?.questionCount} questions</Typography>
                <Box display={'flex'}>
                    <AccessTimeIcon sx={{ marginRight: '5px' }} />
                    <Typography fontSize={'14px'} >{`< ${template?.timeTaken} minute`}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default TemplateBlock