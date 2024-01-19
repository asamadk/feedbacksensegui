import { AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import styled from '@emotion/styled';
import { transparentButton } from '../../Styles/ButtonStyle';
import { ALL_TEMPLATE_KEY } from '../../Utils/Constants';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }: any) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
    backgroundColor: 'transparent',
    borderRadius: '5px'
}));

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#006dff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#006dff',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#006dff',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#006dff',
        },
    },
    color: 'white'
});

function TemplateLeftPanel(
    { data, filter, templateOptions, templates }: { data: Map<string, Set<string>>, filter: any, templateOptions: any, templates: any[] }
) {

    const navigate = useNavigate();
    const defaultColor = useSelector((state: any) => state.colorReducer);

    const [expanded, setExpanded] = React.useState<string | false>(ALL_TEMPLATE_KEY);
    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleBackButtonClick = () => {
        window.history.back();
    }

    const handleAutoCompleteClick = (event: any, data: any) => {
        const templateId = data?.value;
        let templateData: any = null;
        templates.forEach(template => {
            if (template.id === templateId) {
                templateData = template;
                return;
            }
        });

        if (templateData != null) {
            navigate(
                `/template/details/${templateId}`,
                { state: { ...templateData } }
            );
        }
    }

    return (
        <Box height={'calc(100vh - 62px)'} padding={'0px 20px'} borderRight={'1px #454545 solid'} sx={{backgroundColor : defaultColor?.primaryColor}}>
            <Box textAlign={'start'} display={'flex'} justifyContent={'space-between'}>
                {/* <IconButton sx={{ marginTop: '10px' }} onClick={handleBackButtonClick}  >
                    <ArrowBackIcon sx={{ color: '#f1f1f1' }} />
                </IconButton> */}
                <Typography sx={{ textAlign: 'start',marginTop: '10px' }} fontSize={24} color={'white'}>
                Templates Library
            </Typography>
            </Box>
            <Typography sx={{ textAlign: 'start' }} color={'#808080'} >
                Explore a diverse collection of over 90 pre-designed templates, at your fingertips.
            </Typography>
            <Box sx={{ marginTop: '20px', marginBottom: '50px', }}>
                <Autocomplete
                    onChange={(event, value: any) => handleAutoCompleteClick(event, value)}
                    size='small'
                    autoHighlight
                    disablePortal
                    id="combo-box-demo"
                    options={templateOptions}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <CssTextField {...params} label="Search Templates" />}
                />
            </Box>
            <Box sx={{overflowY : 'scroll',height : 'calc(100vh - 340px)'}} >
                {Array.from(data.entries()).map(([key, value]) => (
                    <Box key={key} >
                        {key === ALL_TEMPLATE_KEY ?
                            <Button
                                onClick={() => { filter(ALL_TEMPLATE_KEY, ''); setExpanded(false) }}
                                sx={{ width: '100%', display: 'flex', justifyContent: 'start', marginBottom: '10px', color: 'white' }}
                            >
                                All Templates
                            </Button> :
                            <AccordionBlock
                                key={key}
                                header={key}
                                expanded={expanded}
                                subCategories={Array.from(value)}
                                selected={expanded === key}
                                handleChange={handleChange}
                                handleSubCatChange={filter}
                            />
                        }
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default TemplateLeftPanel


function AccordionBlock(props: any) {
    return (
        <Box borderRadius={'5px'} border={props.selected === true ? '1px #808080 solid' : ''} marginBottom={'10px'} >
            <Accordion expanded={props.expanded === props.header} onChange={props.handleChange(props.header)}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>{props.header}</Typography>
                </AccordionSummary>
                {
                    props.subCategories != null && props.subCategories.length > 0 &&
                    <AccordionDetails>
                        {
                            props.subCategories.map((cat: string) => {
                                return (
                                    <Button
                                        onClick={() => props.handleSubCatChange(props.header, cat)}
                                        sx={transparentButton}
                                    >
                                        {cat}
                                    </Button>
                                )
                            })
                        }
                    </AccordionDetails>
                }
            </Accordion>
        </Box>
    )
}