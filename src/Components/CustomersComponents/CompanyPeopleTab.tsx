import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, styled } from '@mui/material'
import { textFieldStyle } from '../../Styles/InputStyles';
import { colorPalette } from '../../Utils/Constants';
import { outlinedButton } from '../../Styles/ButtonStyle';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { getCompanyPersonListURL } from '../../Utils/Endpoints';
import { useNavigate, useParams } from 'react-router';
import { getPersonName, handleLogout, handleUnAuth } from '../../Utils/FeedbackUtils';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

const CssTextField = styled(TextField)(textFieldStyle);

const headerContainer = {
  borderBottom: `1px ${colorPalette.textSecondary} solid`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 20px'
}

const col: string[] = ['Full Name', 'Email', 'Company', 'Created Date', 'Actions'];


function CompanyPeopleTab() {

  const { id } = useParams();
  const navigate = useNavigate();

  const snackbarRef: any = useRef(null);
  const [peopleList, setPeopleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchPeopleOfCompany();
      init = true;
    }
  }, []);

  async function fetchPeopleOfCompany() {
    try {
      setLoading(true);
      const { data } = await axios.get(getCompanyPersonListURL(id as string), { withCredentials: true });
      if (data.data) {
        setPeopleList(data.data)
      }
      setLoading(false);
    } catch (error : any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function handleOpenPeopleDetail(personId: any,person :any) {
    navigate(`/contacts/person/detail/${personId}`,{ state:  person});
  }

  return (
    <Box sx={{ height: 'calc(100vh - 130px)', overflowY: 'scroll' }} >
      <Box sx={headerContainer} >
        <Box>
        </Box>
        <Box>
          <CssTextField
            size='small'
            sx={{ input: { color: colorPalette.darkBackground }, marginTop: '10px',marginBottom : '10px' }}
            placeholder={`Search people`}
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: colorPalette.darkBackground, paddingLeft: '5px' }} />
            }}
          />
        </Box>
      </Box>
      <Box sx={{ padding: '20px' }} >
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 95px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle,fontWeight: '600',background : colorPalette.secondary }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                peopleList?.map(person => (
                  <TableRow key={person.id} >
                    <TableCell sx={tableCellStyle} >
                      {getPersonName(person)}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {person.email}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {person.company.name}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {new Date(person.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton onClick={() => handleOpenPeopleDetail(person.id,person)} size='small' >
                        <ArrowForwardIosIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={10}
            rowsPerPage={20}
            page={0}
            onPageChange={() => { }}
            onRowsPerPageChange={() => { }}
          /> */}
        </TableContainer>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default CompanyPeopleTab