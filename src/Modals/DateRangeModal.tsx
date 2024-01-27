import React, { useRef, useState } from 'react'
import Notification from '../Utils/Notification'
import { Box, Button, Modal, Typography } from '@mui/material'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle';
import { useSelector } from 'react-redux';
import { containedButton, outlinedButton, transparentButton } from '../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getDateWithDuration } from '../Utils/FeedbackUtils';
import CustomTooltip from '../Components/CustomTooltip';
import { colorPalette } from '../Utils/Constants';

function DateRangeModal(props: any) {

    const snackbarRef: any = useRef(null);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [loading, setLoading] = React.useState(false);
    const [selectedDuration, setSelectedDuration] = useState(props.duration)
    const [startDate, setStartDate] = React.useState<string | null>(props.startDate);
    const [endDate, setEndDate] = React.useState<string | null>(props.endDate);

    const durations = [
        // { label: 'All time', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'last_7_days' },
        { label: 'Last 30 days', value: 'last_30_days' },
        { label: 'Last 90 days', value: 'last_90_days' },
        { label: 'Last 12 Months', value: 'last_12_months' },
        { label: 'Custom', value: 'custom' },
    ]

    const handleClose = () => {
        props.close();
    }

    const handleChangeDuration = (value: string) => {
        setSelectedDuration(value);
        const res = getDateWithDuration(value);
        setStartDate(res.startDate);
        setEndDate(res.endDate);
    }

    const handleApply = () => {
        console.log("🚀 ~ file: DateRangeModal.tsx:49 ~ handleApply ~ startDate:", startDate)
        console.log("🚀 ~ file: DateRangeModal.tsx:50 ~ handleApply ~ endDate:", endDate)
        props?.update(selectedDuration, startDate, endDate);
        handleClose();
    }

    const handleStartDateChange = (newValue : any) => {
        const formattedDate = dayjs(newValue).format('MM/DD/YYYY');
        setStartDate(formattedDate);
        setSelectedDuration('custom');
    }

    const handleEndDateChange = (newValue : any) => {
        const formattedDate = dayjs(newValue).format('MM/DD/YYYY');
        setEndDate(formattedDate);
        setSelectedDuration('custom');
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Select duration
                        </Typography>
                    </Box>
                    <Box display={'flex'} justifyContent={'space-around'}>
                        <Box marginTop={'10px'} width={'40%'} >
                            {durations.map(duration =>
                                <Button onClick={() => handleChangeDuration(duration.value)} sx={transparentButton} >
                                    {
                                        selectedDuration === duration.value ?
                                            <Typography color={colorPalette.primary} >{duration.label}</Typography> :
                                            <Typography color={colorPalette.darkBackground} >{duration.label}</Typography>
                                    }
                                </Button>)}
                        </Box>
                        <Box marginTop={'10px'} width={'40%'} >
                            <Box marginBottom={'10px'} >
                                Date format
                                <CustomTooltip
                                    text='MM/DD/YYYY (Eg. 02 July 2023 will be written as 07/02/2023)'
                                />
                            </Box>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box>
                                    <DatePicker
                                        onChange={handleStartDateChange}
                                        sx={{ width: '100%' }}
                                        label="Start date"
                                        value={dayjs(startDate)}
                                    />
                                </Box>
                                <Box margin={'10px'} ></Box>
                                <Box>
                                    <DatePicker
                                        onChange={handleEndDateChange}
                                        sx={{ width: '100%' }}
                                        label="End date"
                                        value={dayjs(endDate)}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </Box>
                    </Box>
                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={handleClose}
                            variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={handleApply} >
                            Apply
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default DateRangeModal