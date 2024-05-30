import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTaskModal from '../../Modals/ContactModals/CreateTaskModa';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { deleteTaskURL, getTaskURL } from '../../Utils/Endpoints';
import GenericModal from '../../Modals/GenericModal';
import { taskStatusStyle } from '../../Styles/LayoutStyles';
import { paginationStyle, tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanyTaskTab(props: { companyId: string | null, personId: string | null }) {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const col: string[] = ['Task', 'Description', 'Person', 'Assigned To', 'Due Date', 'Status', 'Action'];
  const [taskMetrics, setTaskMetrics] = useState<any[]>([]);
  const [taskList, setTasksList] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateTaskData, setUpdateTaskData] = useState<any>(null);

  const [deletePayload, setDeletePayload] = useState({
    cancelButtonText: 'Cancel',
    description: 'Are you sure you want to delete this task?',
    header: 'Delete Task',
    successButtonText: 'Delete',
    type: '',
    warning: 'This action cannot be reversed!',
    data: {}
  });

  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchTasks();
      init = true;
    }
  }, [page]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data } = await axios.get(getTaskURL(props.companyId, props.personId, '', '', page, 20), { withCredentials: true });
      if (data.data) {
        const count = data.data.count;
        const list = data.data.list;
        const stats = data.data.stats;
        setTaskMetrics(stats);
        setTasksList(list);
        setTotalCount(count);
      }
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function handleCloseModal(data: any) {
    setShowTaskModal(false);
    if (data.refresh === true) {
      fetchTasks();
    }
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const subContainer = document.getElementById('company-table-container');
    if (subContainer) {
      subContainer.scrollTop = 0;
    }
  };

  function handleDeleteClick(taskId: string) {
    setShowDeleteModal(true);
    setDeletePayload({ ...deletePayload, data: { taskId: taskId } });
  }

  async function handleTaskDelete() {
    const data: any = deletePayload.data;
    const taskId = data.taskId;
    setDeletePayload({ ...deletePayload, data: {} });
    setShowDeleteModal(false);
    try {
      setLoading(true);
      await axios.delete(deleteTaskURL(taskId), { withCredentials: true });
      snackbarRef?.current?.show('Task deleted', 'success');
      setTasksList(taskList.filter(t => t.id !== taskId));
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function handleTaskEdit(task: any) {
    setUpdateTaskData(task);
    setShowTaskModal(true);
  }

  async function handleCreateTask() {
    setUpdateTaskData(null);
    setShowTaskModal(true);
  }

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Tasks</Typography>
        <Button
          onClick={handleCreateTask}
          sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }}
        >Create Task</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} >
        {
          taskMetrics?.map(metric => (
            <Box sx={{ borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px', padding: '20px', textAlign: 'center', background: colorPalette.textSecondary, width: '20%' }} >
              <Typography fontSize={13} fontWeight={600} >{metric.label}</Typography>
              <Typography marginTop={'10px'} variant='h4' fontWeight={600} >{metric.count}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 355px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle, fontWeight: '600', backgroundColor: colorPalette.textSecondary }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                taskList?.map(task => (
                  <TableRow key={task.id} >
                    <TableCell sx={tableCellStyle} >
                      <b>{task?.title}</b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <Tooltip title={task?.description} >
                        <p style={{margin : '0px'}} >
                          {task?.description?.substring(0, 49)}
                          {task?.description?.length > 50 ? '...' : ''}
                        </p>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {task.person[0]?.firstName || 'None'}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {task.owner?.name}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {task.dueDate}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <Box sx={{ ...taskStatusStyle(task.status), cursor: 'default',width : '70px',textAlign : 'center' }} >
                        <span >{task.status}</span>
                      </Box>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton onClick={() => handleTaskEdit(task)} size='small' >
                        <EditIcon sx={{ color: colorPalette.fsGray, fontSize: '20px' }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(task.id)} size='small' >
                        <DeleteIcon sx={{ color: colorPalette.fsGray, fontSize: '20px' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          {
            taskList?.length > 0 &&
            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={totalCount}
              rowsPerPage={20}
              page={page}
              onPageChange={handleChangePage}
              // sx={{ ...paginationStyle, right: '10px' }}
              onRowsPerPageChange={() => { }}
            />
          }
        </TableContainer>
      </Box>
      {
        showTaskModal &&
        <CreateTaskModal
          data={updateTaskData}
          companyId={props.companyId}
          personId={props.personId}
          open={showTaskModal}
          close={handleCloseModal}
        />
      }
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
      <GenericModal
        open={showDeleteModal}
        payload={deletePayload}
        close={() => setShowDeleteModal(false)}
        callback={handleTaskDelete}
      />
    </Box>
  )
}

export default CompanyTaskTab