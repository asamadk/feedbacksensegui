import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import React from 'react'
import { colorPalette } from '../Utils/Constants';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: colorPalette.secondary,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: colorPalette.darkBackground,
        fontSize: theme.typography.pxToRem(13),
    },
}));

function CustomTooltip({ text }: { text: string }) {

    return (
        <>
            <BootstrapTooltip placement='top' title={text}>
                <HelpIcon sx={{ color: colorPalette.primary, cursor: 'pointer', fontSize: '15px' }} />
            </BootstrapTooltip>
        </>
    )
}

export default CustomTooltip