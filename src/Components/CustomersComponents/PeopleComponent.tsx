import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { textFieldStyle } from '../../Styles/InputStyles';
import { colorPalette } from '../../Utils/Constants';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { useNavigate } from 'react-router';
import CreateCompanyModal from '../../Modals/ContactModals/CreateCompanyModal';
import axios from 'axios';
import { deletePersonURL, getPersonListURL } from '../../Utils/Endpoints';
import { genericModalData } from '../../Utils/types';
import GenericModal from '../../Modals/GenericModal';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { tableBodyText, tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

const CssTextField = styled(TextField)(textFieldStyle);

const headerContainer = {
    borderBottom: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 20px'
}

const col: string[] = ['checkbox', 'Full Name', 'Email', 'Company', 'Created Date', 'Actions'];

function PeopleComponent(props: { type: 'people' | 'companies' }) {

    const navigate = useNavigate();
    const snackbarRef: any = useRef(null);

    const [page, setPage] = useState(0);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [peopleList, setPeopleList] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [searchStr, setSearchStr] = useState('');
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();

    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchPeople();
            init = true;
        }
    }, []);

    useEffect(() => {
        fetchPeople();
    }, [page]);

    useEffect(() => {
        let count = 0;
        peopleList.forEach(p => {
            if (p.checked === true) {
                count++;
            }
        });
        if (count > 0) {
            setShowDeleteButton(true);
        } else {
            setShowDeleteButton(false);
        }
    }, [peopleList]);

    async function fetchPeople() {
        try {
            setLoading(true);
            const { data } = await axios.get(getPersonListURL(page, 20, searchStr), { withCredentials: true });
            if (data.data) {
                const res = data.data;
                setTotalCount(res.count);
                setPeopleList(res.list);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    function handleOpenPeopleDetail(personId: any) {
        let selectedPerson = null;
        peopleList.forEach(person => {
            if(personId === person.id){
                selectedPerson = person;
            }
        })
        navigate(`/contacts/person/detail/${personId}`,{ state:  selectedPerson});
    }

    function handleCreateModalClose(data: any) {
        setShowCreateModal(false);
        if (data.refresh === true) {
            fetchPeople();
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
        }
        setGenericModalObj(genDeleteObj);
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        const subContainer = document.getElementById('person-table-container');
        if (subContainer) {
            subContainer.scrollTop = 0;
        }
    };

    function handleSearch(e: any) {
        const key = e.key
        if (key === 'Enter') {
            fetchPeople();
        }
    }

    function handleCheckboxChange(event: any, companyId: string) {
        const isChecked = event.target.checked;
        let tmp: any[] = [];
        if (companyId === 'all') {
            tmp = peopleList.map(person => {
                person.checked = isChecked
                return person;
            });
        } else {
            tmp = peopleList.map(person => {
                if (person.id === companyId) {
                    person.checked = isChecked
                }
                return person;
            });
        }
        setPeopleList(tmp);
    }

    async function handleSuccessButtonClick() {
        setShowGenericModal(false);
        const deletePeopleList: string[] = [];
        peopleList.forEach(person => {
          if (person.checked === true) {
            deletePeopleList.push(person.id);
          }
        });
        try {
          setLoading(true);
          await axios.post(deletePersonURL(), deletePeopleList, { withCredentials: true });
          snackbarRef?.current?.show('Companies Deleted','success');
          fetchPeople();
          setLoading(false);
        } catch (error) {
          snackbarRef?.current?.show('Something went wrong','error');
          setLoading(false);
          handleUnAuth(error);
        }
      }

    return (
        <Box>
            <Box sx={headerContainer} >
                <Box>
                    <Button
                        disabled={!showDeleteButton}
                        className='create-new-survey-button'
                        sx={outlinedButton}
                        style={{ width: 'fit-content', textTransform: 'none' }}
                        startIcon={<DeleteIcon />}
                        variant='outlined'
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </Box>
                <Box>
                    <CssTextField
                        size='small'
                        sx={{ input: { color: colorPalette.darkBackground }, marginTop: '10px' }}
                        placeholder={`Search ${props.type}`}
                        onChange={(e) => setSearchStr(e.target.value)}
                        onKeyDown={handleSearch}
                        InputProps={{
                            endAdornment: <SearchIcon sx={{ color: colorPalette.darkBackground, paddingLeft: '5px' }} />
                        }}
                    />
                    <Button
                        className='create-new-survey-button'
                        sx={containedButton}
                        style={{ width: 'fit-content', textTransform: 'none', marginLeft: '10px' }}
                        startIcon={<PersonAddIcon />}
                        variant='contained'
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Person
                    </Button>
                </Box>
            </Box>
            <Box sx={{ padding: '20px' }} >
                <TableContainer
                    className='person-table-container'
                    sx={{ ...tableContainerStyle, height: 'calc(100vh - 95px)' }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                {col?.map((column: string) => (
                                    <TableCell sx={{ ...tableCellStyle,fontWeight: '600',background : colorPalette.secondary }} key={column}>
                                        {
                                            column !== 'checkbox' ? column :
                                                <Checkbox
                                                    color='secondary'
                                                    onClick={(e) => handleCheckboxChange(e, 'all')}
                                                />
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {
                                peopleList?.map(person => (
                                    <TableRow key={person.id} >
                                        <TableCell sx={tableCellStyle} >
                                            <Checkbox
                                                onChange={(e) => handleCheckboxChange(e, person.id)}
                                                checked={person?.checked}
                                                color='secondary'
                                            />
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={tableBodyText} >{`${person.firstName} ${person.lastName}`}</Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={tableBodyText} >{person.email}</Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={{...tableBodyText,color : colorPalette.primary,fontWeight : 600}} >
                                                {person.company.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <Typography sx={tableBodyText} >{new Date(person.created_at).toLocaleDateString()}</Typography>
                                        </TableCell>
                                        <TableCell sx={tableCellStyle} >
                                            <IconButton onClick={() => handleOpenPeopleDetail(person.id)} size='small' >
                                                <ArrowForwardIosIcon fontSize='small' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[20]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={20}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={() => { }}
                    />
                </TableContainer>
            </Box>
            {
                showCreateModal &&
                <CreateCompanyModal
                    data={null}
                    type='people'
                    open={showCreateModal}
                    close={handleCreateModalClose}
                />
            }
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </Box>
    )
}

export default PeopleComponent