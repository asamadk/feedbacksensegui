import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, ownerDocument } from '@mui/material'
import { tableCellStyle, tableContainerStyle } from '../Styles/TableStyle';
import { colorPalette } from '../Utils/Constants';
import { taskStatusStyle } from '../Styles/LayoutStyles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { containedButton } from '../Styles/ButtonStyle';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import GenericModal from '../Modals/GenericModal';
import CreateTaskModal from '../Modals/ContactModals/CreateTaskModa';
import axios from 'axios';
import { completeTaskURL, deleteTaskURL, getTaskURL } from '../Utils/Endpoints';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';

const col: string[] = ['Task', 'Assigned To', 'Due Date', 'Status', 'Action'];

function TasksLayout() {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const [taskList, setTasksList] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [updateTaskData, setUpdateTaskData] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskMetrics, setTaskMetrics] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');

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
      init = true
    }
  }, [statusFilter, ownerFilter, page]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const subContainer = document.getElementById('company-table-container');
    if (subContainer) {
      subContainer.scrollTop = 0;
    }
  };

  async function fetchTasks() {
    try {
      setLoading(true);
      const url = getTaskURL(
        '',
        '',
        statusFilter === 'all' ? '' : statusFilter,
        ownerFilter === 'all' ? '' : ownerFilter,
        page,
        20
      );
      const { data } = await axios.get(url, { withCredentials: true });
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

  async function handleCreateTask() {
    setUpdateTaskData(null);
    setShowTaskModal(true);
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

  function handleCloseModal(data: any) {
    setShowTaskModal(false);
    if (data.refresh === true) {
      fetchTasks();
    }
  }

  async function handleTaskEdit(task: any) {
    setUpdateTaskData(task);
    setShowTaskModal(true);
  }

  function handleDeleteClick(taskId: string) {
    setShowDeleteModal(true);
    setDeletePayload({ ...deletePayload, data: { taskId: taskId } });
  }

  function handleStatusFilterChange(val: string) {
    setStatusFilter(val);
  }

  function handleOwnerFilterChange(val: string) {
    setOwnerFilter(val);
  }

  async function completeTask(taskId: string, status: string) {
    try {
      setLoading(true);
      await axios.post(completeTaskURL(), { id: taskId }, { withCredentials: true });
      snackbarRef?.current?.show('Task Updated', 'success');
      setLoading(false);
      setTasksList(taskList.map(task => {
        if (task.id === taskId) {
          if(task.status === 'Completed'){
            task.status = 'Open';
          }else{
            task.status = 'Completed';
          }
        }
        return task;
      }))
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  return (
    <Box padding={2} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Box sx={{ display: 'flex' }} >
          <Typography variant='h5' >Tasks</Typography>
          <TaskFilters
            status={statusFilter}
            owner={ownerFilter}
            statusChange={handleStatusFilterChange}
            ownerChange={handleOwnerFilterChange}
          />
        </Box>
        <Button
          onClick={handleCreateTask}
          sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }}
        >Add Task</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }} >
        {
          taskMetrics?.map(metric => (
            <Box>
              <Typography variant='h2' sx={{ color: colorPalette.primary }} >{metric.count}</Typography>
              <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{metric.label}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 210px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle, fontWeight: '600', backgroundColor: colorPalette.secondary }} key={column}>
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
                      <Tooltip title='Complete Task' >
                        <Checkbox onChange={() => completeTask(task.id, task.status)} checked={task.status === 'Completed'} color='secondary' />
                      </Tooltip>
                      <b>{task.title}</b>
                      <Typography sx={{ fontSize: 15, fontWeight: 550, marginLeft: '30px' }} >
                        {task.description?.length > 70 ? task.description.substring(0, 70) + '...' : task.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <b style={{ color: colorPalette.primary }} >
                        {task.owner?.name}
                      </b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {task.dueDate}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <Box sx={taskStatusStyle(task.status)} >
                        <span >{task.status}</span>
                      </Box>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton onClick={() => handleTaskEdit(task)} size='small' >
                        <EditIcon sx={{ color: colorPalette.fsGray }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(task.id)} size='small' >
                        <DeleteIcon sx={{ color: colorPalette.fsGray }} />
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
              onRowsPerPageChange={() => { }}
            />
          }
        </TableContainer>
      </Box>
      {
        showTaskModal &&
        <CreateTaskModal
          data={updateTaskData}
          // companyId={props.companyId} 
          // personId={props.personId}
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

export default TasksLayout


function TaskFilters(props: { status: string, owner: string, statusChange: any, ownerChange: any }) {

  const userState = useSelector((state: any) => state.users);

  return (
    <Box marginLeft={'20px'} >
      <Select
        size='small'
        sx={{ width: '150px' }}
        value={props.status}
        onChange={(e) => props.statusChange(e.target.value)}
      >
        <MenuItem value='all' >All Status</MenuItem>
        <MenuItem value='Open' >Open</MenuItem>
        <MenuItem value='InProgress' >InProgress</MenuItem>
        <MenuItem value='Completed' >Completed</MenuItem>
        <MenuItem value='Cancelled' >Cancelled</MenuItem>
      </Select>

      <Select
        sx={{ marginLeft: '10px', width: '150px' }}
        size='small'
        value={props.owner}
        onChange={(e) => props.ownerChange(e.target.value)}
      >
        <MenuItem value='all' >All Owners</MenuItem>
        {
          userState.map((usr: any) =>
            <MenuItem value={usr.id} >{usr.name}</MenuItem>
          )
        }
      </Select>
    </Box>
  )
}