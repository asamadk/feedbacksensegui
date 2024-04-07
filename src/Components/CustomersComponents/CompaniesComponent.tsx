import { Box, Button, Checkbox, IconButton, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import { colorPalette } from '../../Utils/Constants'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle'
import { textFieldStyle } from '../../Styles/InputStyles';
import { useNavigate } from 'react-router';
import CreateCompanyModal from '../../Modals/ContactModals/CreateCompanyModal';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { getCompanyListURL } from '../../Utils/Endpoints';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { setCompanyList } from '../../Redux/Reducers/companyReducer';

const CssTextField = styled(TextField)(textFieldStyle);

const headerContainer = {
  borderBottom: `1px ${colorPalette.textSecondary} solid`,
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0px 20px'
}

const getHealthScoreStyle = (count: number) => {
  const obj: any = {
    padding: '5px 10px',
    width: 'fit-content',
    borderRadius: '6px',
    color: '#ffffff',
    margin: 'auto'
  }
  if (count < 25) {
    obj.background = '#F1584E';
  } else if (count <= 60) {
    obj.background = '#F9C329';
  } else {
    obj.background = '#7ACB36';
  }
  return obj;
}

function CompaniesComponent() {

  const navigate = useNavigate();

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const col: string[] = ['Name', 'Plan', 'Lifecycle Stage', 'Health Score', 'Website', 'Action'];

  const [companies, setCompanies] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(0);
  const [searchStr, setSearchStr] = useState('');

  let init = false;

  useEffect(() => {
    if (init === false) {
      fetchCompanies();
      init = true;
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [page])

  async function fetchCompanies() {
    try {
      setLoading(true);
      const { data } = await axios.get(getCompanyListURL(page, 20, searchStr), { withCredentials: true });
      if (data.data) {
        const res = data.data;
        setTotalCount(res.count);
        setCompanies(res.list);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  const handleCompanyDetailOpen = (id: any) => {
    let selectedCompany;
    companies.forEach(com => {
      if (com.id === id) {
        selectedCompany = com;
      }
    })
    navigate(`/contacts/companies/detail/${id}`, { state: selectedCompany });
  }

  function handleCreateModalClose(data: any) {
    setShowCreateModal(false);
    if (data.refresh === true) {
      fetchCompanies();
    }
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
    const subContainer = document.getElementById('company-table-container');
    if (subContainer) {
      subContainer.scrollTop = 0;
    }
  };

  function handleSearch(e: any) {
    const key = e.key
    if (key === 'Enter') {
      fetchCompanies();
    }
  }

  return (
    <Box>
      <Box sx={headerContainer} >
        <Box>
          {/* <Button
            className='create-new-survey-button'
            sx={outlinedButton}
            style={{ width: 'fit-content', marginBottom: '15px', textTransform: 'none' }}
            startIcon={<AddIcon />}
            variant='outlined'
          >
            Add Filter
          </Button> */}
        </Box>
        <Box>
          <CssTextField
            size='small'
            sx={{ input: { color: colorPalette.darkBackground }, marginTop: '10px' }}
            placeholder={`Search companies`}
            onChange={(e) => setSearchStr(e.target.value)}
            onKeyDown={handleSearch}
            value={searchStr}
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: colorPalette.darkBackground, paddingLeft: '5px' }} />
            }}
          />
          <Button
            className='create-new-survey-button'
            sx={containedButton}
            style={{ width: 'fit-content', textTransform: 'none', marginLeft: '10px' }}
            startIcon={<BusinessIcon />}
            variant='contained'
            onClick={() => setShowCreateModal(true)}
          >
            Create Company
          </Button>
        </Box>
      </Box>
      <Box sx={{ padding: '10px 20px' }} >
        <TableContainer id='company-table-container' sx={{ backgroundColor: colorPalette.textSecondary, border: 'none', height: 'calc(100vh - 95px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ fontWeight: '600', textAlign: column === 'checkbox' || column === 'Name' ? 'start' : 'center' }} key={column}>
                    {
                      column !== 'Name' ? column :
                        <>
                          <Checkbox color='secondary' />{column}
                        </>
                    }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                companies?.map(company => (
                  <TableRow key={company.id} >
                    <TableCell >
                      <Checkbox checked={company?.checked} color='secondary' />
                      <b style={{ color: colorPalette.darkBackground }} >{company.name}</b>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }} >
                      {company.subscriptionPlan || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }} >
                      {company.lifecycleStage}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }} >
                      <Box sx={getHealthScoreStyle(company.healthScore || 'N/A')} >
                        {company.healthScore || 'N/A'}
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                      <Rating defaultValue={company.csmRating} precision={1} />
                    </TableCell> */}
                    <TableCell sx={{ textAlign: 'center' }} >
                      {company.website}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }} >
                      <IconButton onClick={() => handleCompanyDetailOpen(company.id)} size='small' >
                        <ArrowForwardIosIcon fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          {
            companies.length > 0 &&
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
        <CreateCompanyModal
          type='companies'
          open={showCreateModal}
          close={handleCreateModalClose}
        />
      }
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default CompaniesComponent