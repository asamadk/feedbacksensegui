import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { automationComponentList, colorPalette, componentList } from '../Utils/Constants';
import DynamicComponentIcon from './DynamicComponentIcon';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CloseIcon from '@mui/icons-material/Close';

const getCommonContainerStyle = () => {
    return {
        margin: '10px',
        borderRadius: '6px',
        textAlign: 'start',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: `1px ${colorPalette.secondary} solid`
    }
}

const commonLogoStyle = {
    marginRight: '5px',
    height: 'fit-content'
}

const mainContainer = {
    height: 'calc(100vh - 86px)',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderLeft: `2px ${colorPalette.textSecondary} solid`
}

const componentHeaderStyle = {
    marginTop: '10px',
    background: colorPalette.textSecondary,
    padding: '10px 20px',
    textAlign: 'start'
}

function AutomationComponentList(props: { recordType: string }) {

    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Box sx={mainContainer}>
            <Box margin={'0px 20px'} display={'flex'} justifyContent={'space-between'} >
                <Typography fontWeight={600} marginTop={'7px'} >Components</Typography>
            </Box>
            {
                automationComponentList(props.recordType).map(components => {
                    return (
                        <Box
                            key={components.id}
                            className={components.name}
                        >
                            <Box sx={componentHeaderStyle}>
                                <Typography fontWeight={600} >{components.name}</Typography>
                            </Box>
                            {
                                components.components.map(component => {
                                    return (
                                        <>
                                            {
                                                component.isAvailable === true &&
                                                <Box
                                                    onDragStart={(e) => onDragStart(e, component)}
                                                    key={component.id}
                                                    draggable={true}
                                                    sx={{ ...getCommonContainerStyle(), backgroundColor: colorPalette.background }}
                                                >
                                                    <Box>
                                                        <Box display={'flex'} >
                                                            <Box sx={commonLogoStyle} >
                                                                <DynamicComponentIcon id={component.id} />
                                                            </Box>
                                                            <Typography fontSize={15}>{component.header}</Typography>
                                                        </Box>
                                                        <Typography 
                                                            fontSize={'13px'} 
                                                            color={colorPalette.fsGray} 
                                                            marginLeft={'5px'}
                                                        >
                                                            {component.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        </>
                                    )
                                })
                            }
                        </Box>
                    )
                })
            }
        </Box>
    )
}

export default AutomationComponentList