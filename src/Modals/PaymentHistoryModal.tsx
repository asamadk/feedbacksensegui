import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { DataGrid } from '@mui/x-data-grid';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { handleLogout } from '../Utils/FeedbackUtils';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import axios from 'axios';
import { getSubscriptionPaymentHistory } from '../Utils/Endpoints';
import { setPaymentHistoryRedux } from '../Redux/Reducers/paymentHistoryReducer';
import { useDispatch } from 'react-redux';

function PaymentHistoryModal(props: any) {

    const snackbarRef: any = useRef(null);

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const paymentHistory = useSelector((state: any) => state.paymentHistory);

    const dispatch = useDispatch<any>();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    // const [columns, setColumns] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'orderId', headerName: 'OrderId', width: 200 },
        { field: 'amount', headerName: 'Amount', width: 100 },
        { field: 'status', headerName: 'Status', width: 100 },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            renderCell: (cellValues : any) => {
                return (
                    <Button
                        variant="contained"
                        sx={{...containedButton,marginTop : '0px'}}
                        color="primary"
                        size='small'
                        onClick={() => {
                            window.open(cellValues?.row?.action,'__blank')
                        }}
                    >
                        View More
                    </Button>
                );
            },
            width: 150,
        },
    ];

    let init = false;

    useEffect(() => {
        if (init === false) {
            fetchPaymentHistory();
            init = true;
        }
    }, []);

    async function fetchPaymentHistory() {
        try {
            if (paymentHistory != null) {
                setRows(paymentHistory?.rows);
                // setColumns(paymentHistory?.columns);
            } else {
                setLoading(true);
                const { data } = await axios.get(getSubscriptionPaymentHistory(), { withCredentials: true });
                setLoading(false);
                const resData = data.data;
                dispatch(setPaymentHistoryRedux(resData));
                setRows(resData?.rows);
                // setColumns(resData?.columns);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
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
                <Box sx={{ ...modalStyle(defaultColor?.secondaryColor), width: '70%', height: 'calc(100vh - 250px)' }}>
                    <Box sx={modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Payment History
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box height={'80%'} >
                        <DataGrid
                            sx={{
                                backgroundColor: defaultColor?.primaryColor,
                                mt: '10px'
                            }}
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={props.close}
                            variant="contained"
                        >Cancel</Button>
                    </Box>
                </Box>
            </Modal>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default PaymentHistoryModal