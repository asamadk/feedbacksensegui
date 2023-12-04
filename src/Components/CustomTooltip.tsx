import { Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import React from 'react'

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#004cb3',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#004cb3',
        fontSize: theme.typography.pxToRem(13),
    },
}));

function CustomTooltip({ text }: { text: string }) {

    return (
        <>
            <BootstrapTooltip placement='top' title={text}>
                <HelpIcon sx={{ color: '#f1f1f1', cursor: 'pointer', fontSize: '15px' }} />
            </BootstrapTooltip>
        </>
    )
}

export default CustomTooltip