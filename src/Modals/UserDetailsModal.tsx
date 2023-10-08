import React, { useEffect, useState } from 'react'
import { Avatar, Button, Chip, IconButton, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'

function UserDetailsModal({ open, close, user, roles }: any) {

    const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN' | 'USER' | 'GUEST'>();

    useEffect(() => {
        setUserRole(user?.role);
    }, [user]);

    const handleOwnerChange = (e: any) => {
        setUserRole(e.target.value)
    }

    return (
        <>
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            User Details
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={close} />
                        </IconButton>
                    </Box>

                    <Box sx={{ padding: '20px', borderRadius: '10px', margin: '5px' }} >
                        <Box display={'flex'}>
                            <Avatar sx={{ bgcolor: '#006DFF', width: 24, height: 24, fontSize: 14, mt: '15px', mr: '15px' }} alt={user?.name} src={user?.image} />
                            <Box textAlign={'start'} >
                                <Typography variant='h6' color={'white'}>{user?.name}</Typography>
                                <Typography color={'#808080'} >{user?.email}</Typography>
                            </Box>
                        </Box>
                        <Box marginLeft={'35px'} marginTop={'20px'} >
                            <Box>
                                <InputLabel id="demo-simple-select-label">Change Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    size='small'
                                    sx={{ width: '120px' }}
                                    value={userRole}
                                    onChange={handleOwnerChange}
                                >
                                    {
                                        roles?.map((role: string) => (
                                            <MenuItem value={role}>{role}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={close} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained">Save</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default UserDetailsModal