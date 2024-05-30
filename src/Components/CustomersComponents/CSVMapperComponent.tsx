import { Box, Button, Grid, MenuItem, Select, Typography, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { muiSelectStyle } from "../../Styles/InputStyles";
import { getAPIErrorMessage, handleUnAuth } from "../../Utils/FeedbackUtils";
import FSLoader from "../FSLoader";
import Notification from "../../Utils/Notification";
import axios from "axios";
import { getCompanyColumnURL, uploadBulkCompanyURL } from "../../Utils/Endpoints";
import { modalButtonContainerStyle } from "../../Styles/ModalStyle";
import { containedButton, outlinedButton } from "../../Styles/ButtonStyle";
import { LoadingButton } from "@mui/lab";

const CustomSelect = styled(Select)(muiSelectStyle);

function CSVMapperComponent(props: { columns: string[], close: any,csv : string }) {

    const snackbarRef: any = useRef(null);

    const [selectFsField, setSelectedFsField] = useState<string[]>([]);
    const [selectCsvField, setSelectedCsvField] = useState<string[]>([]);
    const [fsFields, setFsFields] = useState<string[]>([])
    const [loading, setLoading] = useState(false);
    // const [selected]

    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchColumnData();
            populateSelectFields();
            init = true;
        }
    }, []);

    function populateSelectFields() {
        const col: string[] = [];
        props.columns.forEach(c => {
            col.push('');
        });
        setSelectedCsvField(col);
        setSelectedFsField(col);
    }

    async function fetchColumnData() {
        try {
            setLoading(true);
            const { data } = await axios.get(getCompanyColumnURL(), { withCredentials: true });
            if (data.data) {
                const tmp = data.data;
                setFsFields(tmp);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    function handleFSFieldSelect(event: any, index: number) {
        const val = event.target.value;
        const tmp = JSON.parse(JSON.stringify(selectFsField));
        tmp[index] = val;
        setSelectedFsField(tmp);
    }

    function handleCSVFieldSelect(event: any, index: number) {
        const val = event.target.value;
        const tmp = JSON.parse(JSON.stringify(selectCsvField));
        tmp[index] = val;
        setSelectedCsvField(tmp);
    }

    async function handleBulkUpload(){
        const fsSet = new Set<string>();
        const csvSet = new Set<string>();

        const fsFields :string[] = [];
        const csvFields :string[] = [];

        selectFsField.forEach(f => {
            if(f.length > 0){
                fsSet.add(f);
                fsFields.push(f);
            }
        });

        selectCsvField.forEach(f => {
            if(f.length > 0){
                csvSet.add(f);
                csvFields.push(f);
            }
        });

        if(csvFields.length  !== fsFields.length){
            snackbarRef?.current?.show('Please map the fields correctly.','warning');
            return;
        }

        if(fsSet.size !== fsFields.length || csvSet.size !== csvFields.length){
            snackbarRef?.current?.show('Duplicate fields selected.','warning');
            return;
        }

        if(!fsSet.has('name') || !fsSet.has('website')){
            snackbarRef?.current?.show('"Name" & "Website" fields are mandatory.','error');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('csvFile', props.csv);
            formData.append('fsFields', selectFsField as any);
            formData.append('csvField', selectCsvField as any);
            const { data } = await axios.post(uploadBulkCompanyURL(),formData,{withCredentials : true});
            snackbarRef?.current.show('File uploaded.','success');
            setLoading(false);
            props.close(true);
        } catch (error) {
            snackbarRef?.current?.show(getAPIErrorMessage(error),'error');
            setLoading(false);
            handleUnAuth(error);
        }
        
    }


    return (
        <>
            <Grid container rowSpacing={1} sx={{ textAlign: 'center' }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Typography fontWeight={600} >FeedbackSense Company's Field</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography fontWeight={600} >CSV Fields</Typography>
                </Grid>
                {
                    props.columns.map((col, index) =>
                        <>
                            <Grid item xs={6}>
                                <CustomSelect
                                    size='small'
                                    fullWidth
                                    value={selectFsField[index]}
                                    placeholder="FeedbackSense Field"
                                    onChange={(e) => handleFSFieldSelect(e, index)}
                                >
                                    {
                                        fsFields.map(f =>
                                            <MenuItem value={f} >{f}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Grid>
                            <Grid item xs={6}>
                                <CustomSelect
                                    size='small'
                                    fullWidth
                                    placeholder="CSV Field"
                                    value={selectCsvField[index]}
                                    onChange={(e) => handleCSVFieldSelect(e, index)}
                                >
                                    {
                                        props.columns.map(col =>
                                            <MenuItem value={col} >{col}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Grid>
                        </>
                    )
                }
            </Grid>
            <Box sx={modalButtonContainerStyle} >
                <Button
                    style={{ width: 'fit-content', marginRight: '15px' }}
                    sx={outlinedButton}
                    onClick={props.close}
                    variant="contained"
                >Cancel</Button>
                <LoadingButton
                    style={{ width: 'fit-content' }}
                    sx={containedButton}
                    variant="contained"
                    loading={loading}
                    onClick={handleBulkUpload}
                >
                    Create
                </LoadingButton>
            </Box>
            <Notification ref={snackbarRef} />
        </>
    );
}

export default CSVMapperComponent;
