import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle'
import { colorPalette } from '../../Utils/Constants'
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { createNoteURL } from '../../Utils/Endpoints';
import axios from 'axios';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateNotesModal(props: any) {

    const users = useSelector((state: any) => state.users);
    const companiesOptions = useSelector((state: any) => state.companies);
    const peopleOptions = useSelector((state: any) => state.people);
    const [userOptions, setUserOptions] = useState<{ label: any, value: any }[]>([]);

    const snackbarRef: any = useRef(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [person, setPerson] = useState(props.personId);
    const [company, setCompany] = useState('');
    const [owner, setOwner] = useState('');
    const [id, setId] = useState<string | null>(null);
    const [visibility, setVisibility] = useState('public');

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
        if (init === false) {
            if (props.data != null) {
                populateTaskData(props.data);
            }
            init = true;
        }
    }, [props.data]);

    function populateTaskData(note: any) {
        setTitle(note.title);
        setDesc(note.description);
        setPerson(note?.person?.id);
        setCompany(note?.company?.id);
        setOwner(note?.owner?.id);
        setId(note?.id);
    }

    const handleClose = () => {
        props.close({ refresh: false });
    }

    function getCompanyId():string{
        let compId = '';
        if(props.companyId != null && props.companyId.length > 0){
            compId = props.companyId;
        }else{
            peopleOptions.forEach((p : any) => {
                if(p?.id === props.personId){
                    compId = p.company.id;
                    return;
                }
            })
        }
        return compId;
    }

    async function handleCreateNote() {
        const payload = {
            title: title,
            desc: desc,
            owner: owner,
            visibility: visibility,
            person:  person,
            company: getCompanyId(),
            id: id
        }
        if (
            title == null || title.length < 1 ||
            owner == null || owner.length < 1 ||
            visibility == null || visibility.length < 1
        ) {
            snackbarRef?.current?.show('Please fill all required values', 'warning');
            return;
        }
        try {
            setLoading(true);
            await axios.post(createNoteURL(), payload, { withCredentials: true });
            props.close({ refresh: true });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(colorPalette.background)}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                {props.data != null ? 'Update' : 'Create'} Note
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Title*</Typography>
                        <CssTextField
                            size='small'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ input: { color: colorPalette.darkBackground } }}
                            fullWidth
                        />

                    </Box>
                    <Box marginTop={'20px'} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Description</Typography>
                        <CssTextField
                            size='small'
                            multiline
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            sx={{ input: { color: colorPalette.darkBackground } }}
                            fullWidth
                        />
                    </Box>

                    <Box marginTop={'20px'} >
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

                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Person</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='plan'
                                    fullWidth
                                    disabled={props.personId != null}
                                    value={person}
                                    onChange={(e) => setPerson(e.target.value as string)}
                                >
                                    {
                                        peopleOptions?.map((people: any) =>
                                            <MenuItem value={people.id} >{`${people.firstName} ${people.lastName}`}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Company</Typography>
                                <CustomSelect
                                    disabled={true}
                                    size='small'
                                    placeholder='plan'
                                    value={props.companyId}
                                    onChange={(e) => setCompany(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        companiesOptions?.map((company: any) =>
                                            <MenuItem value={company.id} >{company.name}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Box>
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
                            onClick={handleCreateNote}
                        >
                            {props.data != null ? 'Update' : 'Create'}
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateNotesModal