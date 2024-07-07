import React, { useRef, useState } from 'react'
import { Box, Button, Chip, MenuItem, Modal, Select, Tooltip, Typography } from '@mui/material'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle';
import { colorPalette } from '../Utils/Constants';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../Utils/Notification';
import ConditionBuilder from '../Components/ConditionBuilder';

function FilterModal(props: { open: boolean, close: any, update: any, data: any }) {

    const snackbarRef: any = useRef(null);

    const [loading, setLoading] = useState(false);
    // const [query, setQuery] = useState<RuleGroupType>({
    //     combinator: 'and',
    //     rules: []
    // });

    // const handleQueryChange = (data: RuleGroupType) => {
    //     setQuery(data);
    // };

    // const handleClose = () => {
    //     props.close();
    // }

    // const handleApplyConditions = () => {
    //     const sql = formatQuery(query, 'sql');
    //     console.log('Formatted SQL query:', sql);
    //     // Send the formatted query to your backend or handle it as needed
    // };

    return (
        <>
            <Modal
                open={props.open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(colorPalette.background)}>
                    <Box sx={modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">Apply Filter</Typography>
                    </Box>
                    <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }} >
                        {/* <ConditionBuilder/> */}
                    </Box>
                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            // onClick={handleClose}
                            variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            // onClick={handleApplyConditions} 
                        >
                            Apply
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default FilterModal