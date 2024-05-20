import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { colorPalette } from '../Utils/Constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { containedButton } from '../Styles/ButtonStyle';
import { tableCellStyle, tableContainerStyle } from '../Styles/TableStyle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import axios from 'axios';
import { deleteUsageEventTypeURL, getUsageEventTypeURL } from '../Utils/Endpoints';
import CreateEventTypeModal from '../Modals/ContactModals/CreateEventTypeModal';
import GenericModal from '../Modals/GenericModal';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import { globalSettingSubContainers } from '../Styles/LayoutStyles';

function CustomEventsView(props : {back : any}) {

    const col: string[] = ['Event Name', 'Event Type', 'Action'];
    const navigate = useNavigate();
    const snackbarRef: any = useRef(null);

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [selectedEventType, setSelectedEventType] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePayload, setDeletePayload] = useState({
        cancelButtonText: 'Cancel',
        description: 'Are you sure you want to delete this task?',
        header: 'Delete Event Type',
        successButtonText: 'Delete',
        type: '',
        warning: 'This action cannot be reversed!',
        data: {}
    });
    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchEventType();
            init = true;
        }
    }, []);

    async function fetchEventType() {
        try {
            setLoading(true);
            const { data } = await axios.get(getUsageEventTypeURL(), { withCredentials: true });
            if (data.data) {
                setEvents(data.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const handleBackButtonClick = () => {
        props.back();
    }

    function handleCreateModalClose({ refresh }: any) {
        setShowCreateModal(false);
        if (refresh == true) {
            fetchEventType();
        }
    }

    function handleCreateModalClick() {
        setSelectedEventType(null);
        setShowCreateModal(true);
    }

    function handleEditClick(eventType: any) {
        setSelectedEventType(eventType);
        setShowCreateModal(true);
    }
    function handleDeleteClick(eventTypeId: string) {
        setShowDeleteModal(true);
        setDeletePayload({ ...deletePayload, data: { id: eventTypeId } });
    }

    async function handleEventTypeDelete() {
        const data: any = deletePayload.data;
        const typeId = data.id;
        setDeletePayload({ ...deletePayload, data: {} });
        setShowDeleteModal(false);
        try {
          setLoading(true);
          await axios.delete(deleteUsageEventTypeURL(typeId), { withCredentials: true });
          snackbarRef?.current?.show('Event type deleted', 'success');
          setEvents(events.filter(t => t.id !== typeId));
          setLoading(false);
        } catch (error) {
          snackbarRef?.current?.show('Something went wrong', 'error');
          setLoading(false);
          handleUnAuth(error);
        }
      }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between',marginBottom : '10px' }} >
                <Box display={'flex'}>
                    <IconButton onClick={handleBackButtonClick}  >
                        <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
                    </IconButton>
                    <Typography variant='h6' marginTop={'4px'} >Custom Event Configurations</Typography>
                </Box>
                <Box>
                    <Button
                        sx={containedButton} size='small'
                        onClick={handleCreateModalClick}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
            <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 130px)', textAlign: 'start', overflowY: 'scroll' }} >
                <Box>
                    <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 125px)' }} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead >
                                <TableRow >
                                    {col?.map((column: string) => (
                                        <TableCell sx={{ ...tableCellStyle, fontWeight: '600', background: colorPalette.secondary }} key={column}>
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    events?.map(event => (
                                        <TableRow key={event.id} >
                                            <TableCell sx={tableCellStyle} >
                                                {event.eventName}
                                            </TableCell>
                                            <TableCell sx={tableCellStyle} >
                                                {event.eventType}
                                            </TableCell>
                                            <TableCell sx={tableCellStyle} >
                                                <IconButton onClick={() => handleEditClick(event)} size='small' >
                                                    <EditIcon sx={{ color: colorPalette.fsGray }} fontSize='small' />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteClick(event.id)} size='small' >
                                                    <DeleteIcon sx={{ color: colorPalette.fsGray }} fontSize='small' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
            {
                showCreateModal &&
                <CreateEventTypeModal
                    open={showCreateModal}
                    close={handleCreateModalClose}
                    data={selectedEventType}
                />
            }
            <GenericModal
                open={showDeleteModal}
                payload={deletePayload}
                close={() => setShowDeleteModal(false)}
                callback={handleEventTypeDelete}
            />
        </Box>
    )
}

export default CustomEventsView