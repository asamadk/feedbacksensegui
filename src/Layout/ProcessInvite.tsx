import { Box, Button, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import * as LayoutStyles from '../Styles/LayoutStyles'
import axios from 'axios';
import { acceptCleanInviteAPI, processInviteAPI } from '../Utils/Endpoints';
import { modalButtonContainerStyle } from '../Styles/ModalStyle';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#006DFF',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#006DFF',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#006DFF',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#006DFF',
        },
    },
    color: 'white'
});

function ProcessInvite() {

    let init = { status: false };

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const code = searchParams.get("code");

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [inviteResponse, setInviteResponse] = useState<number>(0);
    const [inviteMessage, setInviteMessage] = useState<string>('');

    useEffect(() => {
        if (init.status === true) { return; }
        validateInviteCode();
        init.status = true;
    }, []);

    const validateInviteCode = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(processInviteAPI(code as string), { withCredentials: true });
            setInviteResponse(data?.statusCode);
            setInviteMessage(data?.message);
            setLoading(false);
        } catch (error: any) {
            setInviteResponse(error?.response?.data?.statusCode);
            setInviteMessage(error?.response?.data?.message);
            setLoading(false);
        }
    }

    const GetInviteResponseUI = () => {
        return (
            <>
                {inviteResponse === 0 && <Box></Box>}
                {inviteResponse === 200 && <SuccessDisplay
                    defaultColor={defaultColor}
                    next={() => handleAcceptInvite(false)}
                    reject={handleReject}
                    message={inviteMessage}
                />}
                {inviteResponse === 500 && <Box>
                    <Typography variant='h6' color={'white'} >
                        {inviteMessage}
                    </Typography>
                </Box>}
                {inviteResponse === 409 && <ConfirmationDisplay
                    defaultColor={defaultColor}
                    next={() => handleAcceptInvite(true)}
                    reject={handleReject}
                />}
            </>
        )
    }

    const handleAcceptInvite = async(deleteUser : boolean) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                acceptCleanInviteAPI(code as string),
                { deleteUser : deleteUser }, 
                { withCredentials: true });
            snackbarRef?.current?.show(data?.message, 'success');
            setTimeout(() => {
                navigate('/login')
            },1000);
            setLoading(false);
        } catch (error : any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
        }
    }

    const handleReject = () => {
        window.close();
    }

    return (
        <>
            <Box
                sx={{ backgroundColor: defaultColor?.backgroundColor, textAlign: 'center' }}
                height={'calc(100vh - 57px)'}
            >
                <Box padding={'10%'}>
                    {GetInviteResponseUI()}
                </Box>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default ProcessInvite

function SuccessDisplay({ defaultColor, next, reject, message }: any) {
    return (
        <Box sx={{ ...LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor), marginTop: 0, textAlign: 'start' }} >
            <Typography
                variant='h6'
                color={'white'}
                marginBottom={'20px'}
            >{message}</Typography>
            <Typography
                color={'#006dff'}
            >
                Click the button below to join
            </Typography>
            <Box sx={{ textAlign: 'start', marginTop: '10px' }} >
                <Button
                    style={{ width: 'fit-content', marginRight: '15px' }}
                    sx={containedButton}
                    variant="contained"
                    onClick={next}
                >
                    Join
                </Button>
                <Button
                    style={{ width: 'fit-content' }}
                    sx={{ ...outlinedButton, backgroundColor: defaultColor?.primaryColor }}
                    variant="contained"
                    onClick={reject}
                >
                    Reject
                </Button>
            </Box>
        </Box>
    )
}

function ConfirmationDisplay({ defaultColor, next, reject }: any) {

    const [validVal, setValidVal] = useState('');
    const [proceed, setProceed] = useState(false);

    useMemo(() => {
        if (validVal === 'continue') {
            setProceed(true);
        } else {
            setProceed(false);
        }
    }, [validVal]);

    return (
        <Box sx={{ ...LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor), marginTop: 0, textAlign: 'start' }} >
            <Typography
                variant='h4'
                color={'white'}
                marginBottom={'20px'}
            >You are about to join a team</Typography>
            <Typography
                variant='h6'
                color={'white'}
                marginBottom={'10px'}
            >
                Removing resources
            </Typography>
            <Typography
                color={'#006dff'}
            >
                By joining a new team, you will loose all of your current data
            </Typography>
            <CssTextField
                sx={{ input: { color: 'white' }, marginTop: '10px' }}
                id="outlined-basic"
                placeholder='Type "continue" to proceed'
                variant="outlined"
                size={'small'}
                style={{ width: '100%' }}
                value={validVal}
                onChange={(e) => setValidVal(e.target.value)}
            />
            <Box sx={{ textAlign: 'start', marginTop: '10px' }} >
                <Button
                    style={{ width: 'fit-content', marginRight: '15px' }}
                    sx={containedButton}
                    variant="contained"
                    disabled={!proceed}
                    onClick={next}
                >
                    Accept
                </Button>
                <Button
                    style={{ width: 'fit-content' }}
                    sx={{ ...outlinedButton, backgroundColor: defaultColor?.primaryColor }}
                    variant="contained"
                    onClick={reject}
                >
                    Reject
                </Button>
            </Box>
        </Box>
    )
}