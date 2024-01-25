import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle'
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { colorPalette, componentList } from '../Utils/Constants';
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';
import { useSelector } from 'react-redux';

function ComponentSelectorModal(props: any) {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    const handleComponentClick = (componentId: number) => {
        props.onSelection(componentId);
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(defaultColor?.secondaryColor)}>
                    <Box >
                        <Box sx={modalHeaderStyle} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                Component Selector
                            </Typography>
                            <IconButton onClick={props.close} sx={{ color: colorPalette.darkBackground }} >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box>
                        <Box marginTop={'20px'} display={'flex'} flexWrap={'wrap'}>
                            {
                                componentList.map(component => {
                                    return (
                                        <Box key={component.id} >
                                            {
                                                component.isAvailable === true &&
                                                <Box
                                                    onClick={() => handleComponentClick(component.id)}
                                                    sx={{ cursor: 'pointer', background: colorPalette.background, boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }}
                                                    display={'inline-grid'}
                                                    height={'100px'}
                                                    width={'100px'}
                                                    padding={'10px'}
                                                    borderRadius={'10px'}
                                                    marginBottom={'20px'}
                                                    marginRight={'20px'}
                                                >
                                                    <DynamicComponentIcon id={component.id} />
                                                    <Typography>{component.header}</Typography>
                                                </Box>
                                            }
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </Box>
                    <Box sx={modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default ComponentSelectorModal