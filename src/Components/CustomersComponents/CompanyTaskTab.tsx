import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
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
import { deleteTaskURL, getTaskURL, updateTaskURL } from '../../Utils/Endpoints';
import GenericModal from '../../Modals/GenericModal';
import { taskStatusStyle } from '../../Styles/LayoutStyles';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanyTaskTab(props: { companyId: string | null, personId: string | null }) {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const col: string[] = ['Task', 'Person', 'Assigned To', 'Due Date', 'Status', 'Action'];
  const [taskMetrics, setTaskMetrics] = useState<any[]>([]);
  const [taskList, setTasksList] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateTaskData, setUpdateTaskData] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deletePayload, setDeletePayload] = useState({
    cancelButtonText: 'Cancel',
    description: 'Are you sure you want to delete this task?',
    header: 'Delete Task',
    successButtonText: 'Delete',
    type: '',
    warning: 'This action cannot be reversed!',
    data: {}
  });

  const open = Boolean(anchorEl);

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
      const { data } = await axios.get(getTaskURL(props.companyId, props.personId, page, 20), { withCredentials: true });
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

  const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusMenu = () => {
    setAnchorEl(null);
  };

  async function handleTaskStatusUpdate(task: any, status: string) {
    setAnchorEl(null);
    const payload: any = {
      // personID: person,
      // companyID: props.companyId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      status: status,
    }
    try {
      setLoading(true);
      await axios.post(updateTaskURL(), payload, { withCredentials: true });
      setTasksList(taskList.map(t => {
        if (t.id === task.id) {
          t.status = status;
          return t;
        } else {
          return t;
        }
      }))
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
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
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 335px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
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
                taskList?.map(task => (
                  <TableRow key={task.id} >
                    <TableCell sx={tableCellStyle} >
                      {/* <Checkbox color='secondary' /> */}
                      {task.title}
                      <Typography sx={{ color: colorPalette.primary }} >{task?.company[0]?.name}</Typography>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <b style={{ color: colorPalette.primary }} >
                        {task.person?.firstName || 'N/A'}
                      </b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <b style={{ color: colorPalette.primary }} >
                        {task.owner?.name}
                      </b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {task.dueDate}
                    </TableCell>
                    <TableCell  sx={tableCellStyle} >
                      <Box sx={taskStatusStyle(task.status)} >
                        <span onClick={handleStatusClick} >{task.status}</span>
                      </Box>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        sx={{ boxShadow: 'none' }}
                        onClose={handleStatusMenu}
                      >
                        <MenuItem sx={{ ...taskStatusStyle('Open'), margin: '5px' }} onClick={() => handleTaskStatusUpdate(task, 'Open')}>
                          Open
                        </MenuItem>
                        <MenuItem sx={{ ...taskStatusStyle('InProgress'), margin: '5px' }} onClick={() => handleTaskStatusUpdate(task, 'InProgress')}>
                          In Progress
                        </MenuItem>
                        <MenuItem sx={{ ...taskStatusStyle('Completed'), margin: '5px' }} onClick={() => handleTaskStatusUpdate(task, 'Completed')}>
                          Completed
                        </MenuItem>
                        <MenuItem sx={{ ...taskStatusStyle('Cancelled'), margin: '5px' }} onClick={() => handleTaskStatusUpdate(task, 'Cancelled')}>
                          Cancelled
                        </MenuItem>
                      </Menu>
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