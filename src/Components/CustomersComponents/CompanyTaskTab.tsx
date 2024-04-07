import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CreateTaskModal from '../../Modals/ContactModals/CreateTaskModa';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { getTaskURL } from '../../Utils/Endpoints';

const taskStatusStyle = {
  background: colorPalette.secondary,
  color: colorPalette.primary,
  padding: '5px',
  borderRadius: '6px',
  fontWeight: '600',
  width: 'fit-content',
  cursor: 'pointer'
}

function CompanyTaskTab(props: { companyId: string }) {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const col: string[] = ['Task', 'Assigned To', 'Due Date', 'Status', 'Action'];
  const [taskMetrics, setTaskMetrics] = useState<any[]>([]);
  const [taskList, setTasksList] = useState<any[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);


  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchTasks();
      init = true;
    }
    const tmp = [
      { id: 1, count: 0, label: 'Task overdue' },
      { id: 1, count: 10, label: 'Task due Today' },
      { id: 1, count: 7, label: 'Due next 7 days' }
    ];
    setTaskMetrics(tmp);

  }, [page]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data } = await axios.get(getTaskURL(props.companyId, '', page, 20), { withCredentials: true });
      if(data.data){
        setTasksList(data.data);
      }
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong','error');
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

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Tasks</Typography>
        <Button
          onClick={() => setShowTaskModal(true)}
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
        <TableContainer sx={{ backgroundColor: colorPalette.textSecondary, border: 'none', height: 'calc(100vh - 335px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ fontWeight: '600' }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                taskList?.map(task => (
                  <TableRow key={task.id} >
                    <TableCell>
                      {/* <Checkbox color='secondary' /> */}
                      {task.title}
                      <Typography sx={{ color: colorPalette.primary }} >{task?.company.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: colorPalette.primary }} >
                        {task.person?.firstName || 'UNASSIGNED'}
                      </b>
                    </TableCell>
                    <TableCell>
                      {task.dueDate}
                    </TableCell>
                    <TableCell >
                      <Box sx={taskStatusStyle} >
                        {task.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton size='small' >
                        <EditIcon sx={{ color: colorPalette.fsGray }} />
                      </IconButton>
                      <IconButton size='small' >
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
              sx={{ background: colorPalette.textSecondary }}
            />
          }
        </TableContainer>
      </Box>
      {
        showTaskModal &&
        <CreateTaskModal companyId={props.companyId} open={showTaskModal} close={handleCloseModal} />
      }
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default CompanyTaskTab