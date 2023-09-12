import { Box, Popover, Typography } from '@mui/material'
import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NodeError({ message }: { message: string }) {

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Box
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{ cursor: 'default', borderRadius: '3px', backgroundColor: '#e60023', height: '20px', width: '20px', position: 'absolute', right: 2, bottom: 2 }}
            >
                <ErrorOutlineIcon sx={{ color: '#f1f1f1', marginLeft: '1px', marginTop: '1px', height: '18px', width: '18px' }} />
            </Box>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
            >
                <Typography fontSize={12} p={0.5}>{message}</Typography>
            </Popover>

        </>
    )
}

export default NodeError