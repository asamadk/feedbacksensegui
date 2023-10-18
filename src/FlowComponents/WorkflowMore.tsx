import { Menu, MenuItem } from '@mui/material'
import React from 'react'

function WorkflowMore(props: any) {

    const handleLogClick = () => {
        props?.close();
        props?.openLogs();
    }

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={props.anchor}
                open={props.open}
                onClose={props.close}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem >
                    Duplicate
                </MenuItem>
                <MenuItem onClick={handleLogClick} >
                    Logs
                </MenuItem>
            </Menu>
        </>
    )
}

export default WorkflowMore