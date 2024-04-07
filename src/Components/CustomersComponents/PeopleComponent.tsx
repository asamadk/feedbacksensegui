import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { textFieldStyle } from '../../Styles/InputStyles';
import { colorPalette } from '../../Utils/Constants';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { useNavigate } from 'react-router';
import CreateCompanyModal from '../../Modals/ContactModals/CreateCompanyModal';
import axios from 'axios';
import { getPersonListURL } from '../../Utils/Endpoints';

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
    const [loading, setLoading] = React.useState(false);
    const [peopleList, setPeopleList] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [searchStr,setSearchStr] = useState('');


    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchPeople();
            init = true;
        }
    }, []);

    useEffect(() => {
        fetchPeople();
    },[page]);

    async function fetchPeople() {
        try {
            setLoading(true);
            const { data } = await axios.get(getPersonListURL(page,20,searchStr), { withCredentials: true });
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

    const handleSelectAll = (event: any) => {
        const isChecked = event.target.checked;
        const tmp: any[] = JSON.parse(JSON.stringify(peopleList));
        tmp.forEach(t => {
            t.checked = isChecked;
        });
        setPeopleList(tmp);
    }

    function handleOpenPeopleDetail(personId: any) {
        navigate(`/contacts/person/detail/${personId}`);
    }

    function handleCreateModalClose(data: any) {
        setShowCreateModal(false);
        if (data.refresh === true) {
            fetchPeople();
        }
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
        const subContainer = document.getElementById('person-table-container');
        if (subContainer) {
            subContainer.scrollTop = 0;
        }
    };

    function handleSearch(e : any){
        const key = e.key
        if(key === 'Enter'){
          fetchPeople();
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
                    sx={{ backgroundColor: colorPalette.textSecondary, border: 'none', height: 'calc(100vh - 95px)' }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow >
                                {col?.map((column: string) => (
                                    <TableCell sx={{ fontWeight: '600' }} key={column}>
                                        {
                                            column !== 'checkbox' ? column :
                                                <Checkbox onClick={handleSelectAll} color='secondary' />
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                peopleList?.map(person => (
                                    <TableRow key={person.id} >
                                        <TableCell>
                                            <Checkbox checked={person?.checked} color='secondary' />
                                        </TableCell>
                                        <TableCell>
                                            {person.firstName + person.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {person.email}
                                        </TableCell>
                                        <TableCell>
                                            <b style={{ color: colorPalette.primary, cursor: 'pointer' }} >{person.company.name}</b>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(person.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
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
                        sx={{ background: colorPalette.textSecondary }}
                    />
                </TableContainer>
            </Box>
            {
                showCreateModal &&
                <CreateCompanyModal
                    type='people'
                    open={showCreateModal}
                    close={handleCreateModalClose}
                />
            }
        </Box>
    )
}

export default PeopleComponent