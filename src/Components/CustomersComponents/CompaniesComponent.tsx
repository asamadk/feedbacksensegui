import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import { colorPalette } from '../../Utils/Constants';
import DeleteIcon from '@mui/icons-material/Delete';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { textFieldStyle } from '../../Styles/InputStyles';
import { useNavigate } from 'react-router';
import CreateCompanyModal from '../../Modals/ContactModals/CreateCompanyModal';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { deleteCompanyURL, getCompanyListURL } from '../../Utils/Endpoints';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getHealthScoreName, handleUnAuth } from '../../Utils/FeedbackUtils';
import GenericModal from '../../Modals/GenericModal';
import { genericModalData } from '../../Utils/types';
import { getHealthScoreStyle, paginationStyle, tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';
import { taskStatusStyle } from '../../Styles/LayoutStyles';

const CssTextField = styled(TextField)(textFieldStyle);

const headerContainer = {
  borderBottom: `1px ${colorPalette.textSecondary} solid`,
  display: 'flex',
  justifyContent: 'end',
  padding: '0px 20px',
  paddingBottom: '10px'
};

function CompaniesComponent() {

  const navigate = useNavigate();

  const snackbarRef :any = useRef(null);

  const [loading, setLoading] = useState(false);
  const col: string[] = ['Name', 'Website','Contract Status','Owner', 'Health Score', 'Lifecycle Stage', 'Action'];

  const [companies, setCompanies] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(0);
  const [searchStr, setSearchStr] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [genericModalObj, setGenericModalObj] = useState<genericModalData>();
  const [showGenericModal, setShowGenericModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [page, searchStr]);

  useEffect(() => {
    const count = companies.filter(c => c.checked).length;
    setShowDeleteButton(count > 0);
  }, [companies]);

  async function fetchCompanies() {
    try {
      setLoading(true);
      const { data } = await axios.get(getCompanyListURL(page, 20, searchStr), { withCredentials: true });
      if (data.data) {
        const res = data.data;
        setTotalCount(res.count);
        setCompanies(res?.list?.map((company: any) => ({ ...company, checked: false })));  // Ensure 'checked' field is initialized
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  const handleCompanyDetailOpen = (id: any) => {
    const selectedCompany = companies.find(com => com.id === id);
    navigate(`/contacts/companies/detail/${id}`, { state: selectedCompany });
  };

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
    const key = e.key;
    if (key === 'Enter') {
      fetchCompanies();
    }
  }

  function handleCheckboxChange(event: any, companyId: string) {
    const isChecked = event.target.checked;

    if (companyId === 'all') {
      setCompanies(prevCompanies => prevCompanies.map(comp => ({
        ...comp,
        checked: isChecked
      })));
    } else {
      setCompanies(prevCompanies => prevCompanies.map(comp =>
        comp.id === companyId ? { ...comp, checked: isChecked } : comp
      ));
    }
  }

  function handleDeleteClick() {
    setShowGenericModal(true);
    let genDeleteObj: genericModalData = {
      header: 'Delete',
      warning: 'Are you sure you want to delete the selected companies',
      description: 'Warning: There\'s no turning back! I acknowledge that',
      successButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'home'
    };
    setGenericModalObj(genDeleteObj);
  }

  async function handleSuccessButtonClick() {
    setShowGenericModal(false);
    const deleteCompaniesList: string[] = companies.filter(c => c.checked).map(c => c.id);
    try {
      setLoading(true);
      await axios.post(deleteCompanyURL(), deleteCompaniesList, { withCredentials: true });
      snackbarRef?.current?.show('Companies Deleted', 'success');
      fetchCompanies();
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function getColumnAlignment(column : string){
    if(
      column === 'checkbox' || column === 'Name' 
      || column === 'Website' || column === 'Contract Status' || column === 'Owner'
    ){
      return 'start';
    }
    return 'center';
  }

  return (
    <Box>
      <Box sx={headerContainer}>
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
          <IconButton onClick={handleDeleteClick} sx={{marginTop : '10px'}} disabled={!showDeleteButton} >
            <DeleteIcon/>
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ padding: '10px 20px' }} >
        <TableContainer id='company-table-container' sx={{ ...tableContainerStyle, height: 'calc(100vh - 145px)', marginTop: '10px' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {col.map((column: string) => (
                  <TableCell 
                    sx={{ ...tableCellStyle, fontWeight: '600', background: colorPalette.textSecondary, textAlign: getColumnAlignment(column) }} 
                    key={column}
                  >
                    {
                      column !== 'Name' ? column :
                        <>
                          <Checkbox onChange={(e) => handleCheckboxChange(e, 'all')} color='secondary' />{column}
                        </>
                    }
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                companies.map(company => (
                  <TableRow key={company.id} >
                    <TableCell sx={tableCellStyle} >
                      <Checkbox
                        value={company.checked || false}
                        checked={company.checked || false}
                        onChange={(e) => handleCheckboxChange(e, company.id)}
                        color='secondary'
                      />
                      <b>{company.name}</b>
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'start' }}>
                      {company.website}
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'start' }}>
                      {company.contractStatus}
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'start' }}>
                      {company?.owner?.name}
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                      <Box sx={getHealthScoreStyle(company.healthScore >= 0 ? company.healthScore : 'None')}>
                        {getHealthScoreName(company.healthScore)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                      <Box sx={{ ...taskStatusStyle('Open'), margin: 'auto', width: '100px', textOverflow: 'ellipsis' }}>
                        {company?.stage?.name || 'None'}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                      <IconButton onClick={() => handleCompanyDetailOpen(company.id)} size="small">
                        <ArrowForwardIosIcon fontSize="small" />
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
              sx={paginationStyle}
              showFirstButton={true}
              showLastButton={true}
              onPageChange={handleChangePage}
              onRowsPerPageChange={() => { }}
            />
          }
        </TableContainer>
      </Box>
      {
        showCreateModal &&
        <CreateCompanyModal
          data={null}
          type='companies'
          open={showCreateModal}
          close={handleCreateModalClose}
        />
      }
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
      <GenericModal
        payload={genericModalObj}
        close={() => setShowGenericModal(false)}
        open={showGenericModal}
        callback={handleSuccessButtonClick}
      />
    </Box>
  );
}

export default CompaniesComponent;