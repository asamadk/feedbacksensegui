import { Box, Button, Chip, MenuItem, Modal, Select, Tooltip, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle'
import { useSelector } from 'react-redux';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../Utils/Notification';
import { FilterCondition } from '../Utils/types';
import CustomTooltip from '../Components/CustomTooltip';
import QuestionFilter from '../Components/OverAllResults/QuestionFilter';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

function AnalysisFiltersModal(props: any) {

    const snackbarRef: any = useRef(null);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [filterData, setFilterData] = useState<FilterCondition[]>(props?.data);
    const [loading, setLoading] = React.useState(false);

    const handleClose = () => {
        props.close();
    }
    const handleApply = () => {
        props.update(filterData);
        handleClose();
    }

    const handleAddFilter = (questionTextId: string, questionText: string, operator: string, value: string) => {
        const newFilterData: FilterCondition = {
            id: filterData.length + 1 + '',
            questionId: questionTextId,
            question: questionText,
            operator: operator,
            value: value,
            logicOperator: 'or'
        }
        const tmpFilterData: FilterCondition[] = JSON.parse(JSON.stringify(filterData));
        tmpFilterData.push(newFilterData);
        setFilterData(tmpFilterData);
    }

    const handleDelete = (idToDelete: string) => {
        const updatedFilters = filterData.filter(filter => filter.id !== idToDelete);
        setFilterData(updatedFilters);
    }

    const handleOperatorChange = (idToToggle: string) => {
        const updatedFilters: any = filterData.map((filter: FilterCondition) => {
            if (filter.id === idToToggle) {
                const newLogicOperator = filter?.logicOperator === 'and' ? 'or' : 'and';
                return { ...filter, logicOperator: newLogicOperator };
            }
            return filter;
        });
        setFilterData(updatedFilters);
    }

    const FilterChipDisplay = () => {
        return (
            <>
                {
                    filterData != null && filterData.length > 0 &&
                    filterData.map((data, index) => (
                        <React.Fragment key={data.id}>
                            <Tooltip title={`${data.question} ${data.operator} ${data.value}`} >
                                <Chip
                                    style={{ marginTop: '5px', marginBottom: '10px', maxWidth: '300px', borderRadius: '5px' }}
                                    variant="outlined"
                                    onDelete={() => handleDelete(data.id)}
                                    label={
                                        <>
                                            <span ><b>{data.question + '  '}</b></span>
                                            <span>{data.operator + '  '}</span>
                                            <span ><b>{data.value}</b></span>
                                        </>
                                    }
                                />
                            </Tooltip>
                            {index < filterData.length - 1 && (
                                <span
                                    style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px', marginRight: '5px' }}
                                    onClick={() => handleOperatorChange(data.id)}
                                >
                                    {data.logicOperator ?? 'or'}
                                </span>
                            )}
                        </React.Fragment>
                    ))
                }

            </>
        )
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Apply Filters
                            <CustomTooltip
                                text='Filter out you survey analysis on one or more condition(s).'
                            />
                        </Typography>
                    </Box>
                    <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }} >
                        <Box display={'flex'} padding={'10px'} justifyContent={'space-between'} >
                            <Box marginTop={'20px'} width={'35%'}>
                                <QuestionFilter
                                    handleAddFilter={handleAddFilter}
                                    surveyId={props.surveyId}
                                />
                            </Box>
                            <Box marginTop={'10px'} width={'65%'} padding={'10px'} >
                                {FilterChipDisplay()}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={handleClose}
                            variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={handleApply} >
                            Apply
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default AnalysisFiltersModal