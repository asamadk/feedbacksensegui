import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNotesModal from '../../Modals/ContactModals/CreateNotesModal';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { deleteNotesURL, getNotesURL } from '../../Utils/Endpoints';
import GenericModal from '../../Modals/GenericModal';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanyNotesTab(props: { companyId: string | null, personId: string | null }) {
  const col: string[] = ['Title', '', 'Company', 'Note Date', 'Action'];
  const [metrics, setMetrics] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateNoteData, setUpdateNoteData] = useState<any>(null);

  const [deletePayload, setDeletePayload] = useState({
    cancelButtonText: 'Cancel',
    description: 'Are you sure you want to delete this note?',
    header: 'Delete Note',
    successButtonText: 'Delete',
    type: '',
    warning: 'This action cannot be reversed!',
    data: {}
  });

  let init = false;

  useEffect(() => {
    if (init === false) {
      fetchData();
      init = true;
    }
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const URL = getNotesURL(props.companyId,props.personId,page,20);
      const { data } = await axios.get(URL, { withCredentials: true });
      if (data.data) {
        const res = data.data;
        setMetrics(res.stats);
        setNotes(res.list);
        setTotalCount(res.count);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function handleCreateModalClose(data: any) {
    setShowCreateModal(false);
    if (data.refresh === true) {
      fetchData();
    }
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const subContainer = document.getElementById('company-table-container');
    if (subContainer) {
      subContainer.scrollTop = 0;
    }
  };

  function handleDeleteClick(noteId: string) {
    setShowDeleteModal(true);
    setDeletePayload({ ...deletePayload, data: { noteId: noteId } });
  }

  async function handleNoteDelete() {
    const data: any = deletePayload.data;
    const noteId = data.noteId;
    setDeletePayload({ ...deletePayload, data: {} });
    setShowDeleteModal(false);
    try {
      setLoading(true);
      await axios.delete(deleteNotesURL(noteId), { withCredentials: true });
      snackbarRef?.current?.show('Task deleted', 'success');
      setNotes(notes.filter(n => n.id !== noteId));
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function handleNoteEdit(note: any) {
    setUpdateNoteData(note);
    setShowCreateModal(true);
  }

  async function handleCreateNote() {
    setUpdateNoteData(null);
    setShowCreateModal(true);
  }

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Notes</Typography>
        <Button
          onClick={handleCreateNote}
          sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }}
        >Add a Note</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} >
        {
          metrics?.map(metric => (
            <Box sx={{ borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px', padding: '20px', textAlign: 'center', background: colorPalette.textSecondary, width: '20%' }} >
              <Typography fontSize={13} fontWeight={600} >{metric.label}</Typography>
              <Typography marginTop={'10px'} variant='h4' fontWeight={600} >{metric.count}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer
          id='company-table-container'
          sx={{ ...tableContainerStyle, height: 'calc(100vh - 350px)' }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle,fontWeight: '600',backgroundColor : colorPalette.secondary }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                notes?.map(note => (
                  <TableRow key={note?.id} >
                    <TableCell sx={tableCellStyle} >
                      {note.title}
                    </TableCell>
                    <TableCell sx={tableCellStyle} > </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {note.company?.name}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {new Date(note.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton onClick={() => handleNoteEdit(note)} size='small' >
                        <EditIcon sx={{ color: colorPalette.fsGray }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(note?.id)} size='small' >
                        <DeleteIcon sx={{ color: colorPalette.fsGray }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          {
            notes?.length > 0 &&
            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={totalCount}
              rowsPerPage={20}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={() => { }}
              sx={{ background: colorPalette.textSecondary }}
            />
          }
        </TableContainer>
      </Box>
      {
        showCreateModal &&
        <CreateNotesModal
          data={updateNoteData}
          personId={props.personId}
          companyId={props.companyId}
          open={showCreateModal}
          close={handleCreateModalClose}
        />
      }
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
      <GenericModal
        open={showDeleteModal}
        payload={deletePayload}
        close={() => setShowDeleteModal(false)}
        callback={handleNoteDelete}
      />
    </Box>
  )
}

export default CompanyNotesTab