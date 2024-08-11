import React, { useEffect, useRef, useState } from 'react'
import Notification from '../../Utils/Notification'
import Papa from 'papaparse';
import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { useSelector } from 'react-redux';
import BusinessIcon from '@mui/icons-material/Business';
import { colorPalette } from '../../Utils/Constants';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { communicationPrefOptions, companyStatusOptions, industryOptions, lifecycleStageOptions } from '../../Utils/CompanyConstant';
import axios from 'axios';
import { addCompanyURL, addPersonURL } from '../../Utils/Endpoints';
import CSVMapperComponent from '../../Components/CustomersComponents/CSVMapperComponent';
import { getMetricOptions } from '../../Utils/ConditionConstants';
import { getAPIErrorMessage, handleUnAuth } from '../../Utils/FeedbackUtils';
import { useDispatch } from 'react-redux';
import { setCompanyList } from '../../Redux/Reducers/companyReducer';
import { setPeopleOptions } from '../../Redux/Reducers/peopleOptionReducer';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateCompanyModal(props: { open: boolean, close: any, type: 'people' | 'companies', data: any }) {

    const dispatch = useDispatch();
    const snackbarRef: any = useRef(null);
    const companiesState = useSelector((state: any) => state.companies);
    const peopleState = useSelector((state: any) => state.people);
    const users = useSelector((state: any) => state.users);

    const [loading, setLoading] = useState(false);
    const [addBulk, setAddBulk] = useState(false);
    const [userOptions, setUserOptions] = useState<{ label: any, value: any }[]>([]);
    const [columnNames, setColumnNames] = useState([]);
    const [csvData, setCSVData] = useState('');

    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState('');
    const [lStage, setLStage] = useState('');
    const [owner, setOwner] = useState('');
    const [status, setStatus] = useState('');
    const [plan, setPlan] = useState('');
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState<number>();
    const [recordId, setRecordId] = useState<string | null>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [commPref, setComPref] = useState('');

    useEffect(() => {
        const tmp: any[] = [];
        users?.forEach((usr: any) => {
            tmp.push({
                label: usr.name,
                value: usr.id
            })
        });
        setUserOptions(tmp);
    }, [users]);

    let init = false;
    useEffect(() => {
        if (props.data != null && init === false) {
            if (props.type === 'companies') {
                populateCompany(props.data);
            } else {
                populatePerson(props.data);
            }
            init = true;
        }
    }, [props.data]);

    function populatePerson(record: any) {
        console.log("🚀 ~ populateData ~ record:", record)
    }

    function populateCompany(record: any) {
        setName(record.name);
        setWebsite(record.website);
        setIndustry(record.industry);
        setLStage(record.lifecycleStage);
        setOwner(record?.owner?.id);
        setStatus(record?.status);
        // setPlan(record?.)
        setAddress(record?.address);
        setAmount(record.totalContractAmount);
        setRecordId(record?.id);
    }

    const handleClose = (refresh: any) => {
        props.close({ refresh: refresh });
    }

    async function handleCreateIndividualPerson() {
        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            title: title,
            company: company,
            role: role,
            commPref: commPref
        }

        if (
            firstName == null || firstName.length < 1 ||
            lastName == null || lastName.length < 1 ||
            email == null || email.length < 1 ||
            company == null || company.length < 1
        ) {
            snackbarRef?.current?.show(`Please fill all the required values`, 'warning');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(addPersonURL(), payload, { withCredentials: true });
            if(data.data){
                const singlePerson = data.data;
                console.log("🚀 ~ handleCreateIndividualPerson ~ singlePerson:", singlePerson)
                const tmp = {
                    id : singlePerson.id,
                    firstName : singlePerson.firstName,
                    lastName : singlePerson.lastName,
                    company : {
                        id : singlePerson.company
                    }
                }
                dispatch(setPeopleOptions([...peopleState,tmp]));
            }
            snackbarRef?.current?.show(data?.message, 'success');
            setLoading(false);
            props.close({ refresh: true });
        } catch (err) {
            setLoading(false);
        }

    }

    async function handleCreateIndividualCompany() {
        const payload = {
            name: name,
            website: website,
            industry: industry,
            lStage: lStage,
            owner: owner,
            status: status,
            plan: plan,
            address: address,
            amount: amount,
            id: recordId
        }

        if (
            name == null || name.length < 1 ||
            website == null || website.length < 1 ||
            owner == null || owner.length < 1
        ) {
            snackbarRef?.current?.show(`Please fill all the required values`, 'warning');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post(addCompanyURL(), payload, { withCredentials: true });
            snackbarRef?.current?.show(data?.message, 'success');
            if(data.data){
                const singleCompany = data.data;
                const tmp = {
                    id : singleCompany.id,
                    name : singleCompany.name
                }
                dispatch(setCompanyList([...companiesState,tmp]))
                
            }
            setLoading(false);
            props.close({ refresh: true });
        } catch (err) {
            snackbarRef?.current?.show(getAPIErrorMessage(err),'error');
            handleUnAuth(err);
            setLoading(false);
        }
    }

    const IndividualPersonAdd = () => {
        if (addBulk === true) { return <></> }
        return (
            <Box sx={modalStyle(colorPalette.background)}>
                <Box sx={modalHeaderStyle} >
                    <Box>
                        <Typography id="modal-modal-title" variant="h5" component="h2" >
                            <BusinessIcon /> Create Person
                        </Typography>
                    </Box>
                    <IconButton sx={{ color: colorPalette.darkBackground }} >
                        <CloseIcon onClick={handleClose} />
                    </IconButton>
                </Box>

                <Box marginTop={'20px'} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >First Name*</Typography>
                            <CssTextField
                                size='small'
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Last Name*</Typography>
                            <CssTextField
                                size='small'
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Email*</Typography>
                                <CssTextField
                                    size='small'
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Phone</Typography>
                                <CssTextField
                                    size='small'
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Communication Preference</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='plan'
                                    value={commPref}
                                    onChange={(e) => setComPref(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        communicationPrefOptions.map(pref => (
                                            <MenuItem value={pref} >{pref}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Title</Typography>
                                <CssTextField
                                    size='small'
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Company*</Typography>
                        <CustomSelect
                            size='small'
                            placeholder='plan'
                            value={company}
                            onChange={(e) => setCompany(e.target.value as string)}
                            fullWidth
                        >
                            {
                                companiesState?.map((com: any) => (
                                    <MenuItem value={com.id} >{com.name}</MenuItem>
                                ))
                            }
                        </CustomSelect>
                    </Box>
                    {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} >
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Role*</Typography>
                            <CssTextField
                                size='small'
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Communication Preference</Typography>
                            <CustomSelect
                                size='small'
                                placeholder='plan'
                                value={commPref}
                                onChange={(e) => setComPref(e.target.value as string)}
                                fullWidth
                            >
                                {
                                    communicationPrefOptions.map(pref => (
                                        <MenuItem value={pref} >{pref}</MenuItem>
                                    ))
                                }
                            </CustomSelect>
                        </Box>
                    </Box> */}
                </Box>

                <Box sx={modalButtonContainerStyle} >
                    <Button
                        style={{ width: 'fit-content', marginRight: '15px' }}
                        sx={outlinedButton}
                        onClick={handleClose}
                        variant="contained"
                    >Cancel</Button>
                    <LoadingButton
                        style={{ width: 'fit-content' }}
                        sx={containedButton}
                        variant="contained"
                        loading={loading}
                        onClick={handleCreateIndividualPerson}
                    >
                        Create
                    </LoadingButton>
                </Box>
            </Box>
        )
    }

    const IndividualAdd = () => {
        if (addBulk === true) { return <></> }
        return (
            <Box sx={modalStyle(colorPalette.background)}>
                <Box sx={modalHeaderStyle} >
                    <Box>
                        <Typography id="modal-modal-title" variant="h5" component="h2" >
                            <BusinessIcon /> {props.data != null ? 'Update' : 'Create'} Company
                        </Typography>
                        {
                            props.data == null &&
                            <Typography
                                onClick={() => setAddBulk(true)}
                                sx={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Want to add bulk {props.type}? Click here
                            </Typography>
                        }
                    </Box>
                    <IconButton sx={{ color: colorPalette.darkBackground }} >
                        <CloseIcon onClick={handleClose} />
                    </IconButton>
                </Box>

                <Box marginTop={'20px'} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Name*</Typography>
                            <CssTextField
                                size='small'
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ width: '49%' }} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Website*</Typography>
                            <CssTextField
                                size='small'
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                placeholder="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Industry</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='Industry'
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        industryOptions.map(ind => (
                                            <MenuItem value={ind.value} >{ind.label}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Owner*</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='Owner'
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        userOptions.map(usr => (
                                            <MenuItem value={usr.value} >{usr.label}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Contract Amount</Typography>
                                <CssTextField
                                    size='small'
                                    placeholder='Amount'
                                    type='number'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value as any)}
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Contract Status</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='status'
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        getMetricOptions('contractStatus').map(status => (
                                            <MenuItem value={status.value} >{status.label}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ marginTop: '20px' }} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Address</Typography>
                        <CssTextField
                            placeholder='Address'
                            multiline
                            size='small'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            sx={{ input: { color: colorPalette.darkBackground } }}
                            fullWidth
                        />
                    </Box>
                </Box>

                <Box sx={modalButtonContainerStyle} >
                    <Button
                        style={{ width: 'fit-content', marginRight: '15px' }}
                        sx={outlinedButton}
                        onClick={handleClose}
                        variant="contained"
                    >Cancel</Button>
                    <LoadingButton
                        style={{ width: 'fit-content' }}
                        sx={containedButton}
                        variant="contained"
                        loading={loading}
                        onClick={handleCreateIndividualCompany}
                    >
                        {props.data != null ? 'Update' : 'Create'}
                    </LoadingButton>
                </Box>
            </Box>
        )
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData: any = e?.target?.result;
                parseCSV(csvData);
            };
            reader.readAsText(file);
        }
    };

    const parseCSV = (csvData: string) => {
        const Papa = require('papaparse');
        setCSVData(csvData);
        Papa.parse(csvData, {
            complete: (results: any) => {
                const headers = results.data[0];
                setColumnNames(headers);
            }
        });
    };

    const BulkAddComp = () => {
        if (addBulk === false) { return <></> }
        return (
            <Box sx={modalStyle(colorPalette.background)}>
                <Box sx={modalHeaderStyle} >
                    <Box>
                        <Typography id="modal-modal-title" variant="h5" component="h2" >
                            <BusinessIcon /> Add {props.type}
                        </Typography>
                    </Box>
                    <IconButton sx={{ color: colorPalette.darkBackground }} >
                        <CloseIcon onClick={handleClose} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }} marginTop={'20px'} >
                    {
                        columnNames.length > 0 ?
                            <Box>
                                <CSVMapperComponent
                                    csv={csvData}
                                    close={handleClose}
                                    columns={columnNames}
                                />
                            </Box> :
                            <Box  >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Upload a CSV file*</Typography>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    sx={{ ...containedButton, width: 'fit-content' }}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload CSV
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept='.csv'
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </Box>
                    }
                </Box>

                <Box sx={modalButtonContainerStyle} ></Box>
            </Box>
        )
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    {props.type === 'companies' ? IndividualAdd() : IndividualPersonAdd()}
                    {BulkAddComp()}
                </>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateCompanyModal