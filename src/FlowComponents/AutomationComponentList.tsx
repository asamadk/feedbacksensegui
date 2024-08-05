import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { automationComponentList, colorPalette, componentList } from '../Utils/Constants';
import DynamicComponentIcon from './DynamicComponentIcon';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CloseIcon from '@mui/icons-material/Close';

const getCommonContainerStyle = () => {
    return {
        margin: '10px',
        borderRadius: '5px',
        textAlign: 'start',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        overflowY: 'hidden',
        cursor: 'pointer',
        // boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
        border: `1px ${colorPalette.secondary} solid`
    }
}

const commonLogoStyle = {
    marginRight: '10px',
    height: 'fit-content'
}

function AutomationComponentList(props: { recordType: string }) {

    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Box sx={{ height: 'calc(100vh - 85px)', backgroundColor: colorPalette.textSecondary, paddingTop: '10px', paddingBottom: '10px', borderTop: `4px ${colorPalette.background} solid` }}>
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
                            <Box marginTop={'10px'} sx={{ background: colorPalette.secondary, padding: '10px 20px', color: colorPalette.primary, textAlign: 'start' }} >
                                <Typography>{components.name}</Typography>
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
                                                    <Box display={'flex'} >
                                                        <Box sx={{ ...commonLogoStyle, color: colorPalette.primary }} >
                                                            <DynamicComponentIcon id={component.id} />
                                                        </Box>
                                                        <Typography
                                                            color={colorPalette.primary}
                                                            fontSize={15}
                                                        >{component.header}</Typography>
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