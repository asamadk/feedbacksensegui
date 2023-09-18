import React, { useEffect, useState } from 'react'
import { logicType } from '../../Utils/types';
import { modalLogicStyle } from '../../Styles/ModalStyle';
import { Autocomplete, Box, Chip, Divider, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { muiSelectStyle } from '../../Styles/InputStyles';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { v4 as uuidv4 } from "uuid";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import styled from '@emotion/styled';
import { dateAnswerOperators, multipleAnswerOperators, singleAnswerOperators, textAnswerOperators } from '../../Utils/Constants';
import { answerNotNeededSet } from '../../Utils/FeedbackUtils';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const logicSelectContainer = {
    padding: '20px',
    marginTop: '20px',
    border: '0.5px dashed #454545',
    borderRadius: '6px',
}

const logicListContainer = {
    padding: '10px',
    marginTop: '20px',
    border: '0.5px solid #454545',
    borderRadius: '6px',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer'
}

const logicIconsContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor : '#323533',
    padding: '5px',
    marginBottom: '10px',
    borderRadius: '10px'
}

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

type propType = {
    type: number,
    values: string[] | number[],
    data: logicType[],
    open?: boolean
}

function CreateLogic(props: propType, ref: any) {

    const [logicList, setLogicList] = useState<logicType[]>([]);
    const [operators, setOperators] = useState<string[]>([]);

    //display variables
    const [showAnswerList, setShowAnswerList] = useState(false);
    const [showAutoComplete, setShowAutoComplete] = useState(false);

    useEffect(() => {
        populateOperator();
        populateData();
        populateDisplayFlags();
    }, [props.data]);

    const populateDisplayFlags = () => {
        setShowAnswerList(false);
        setShowAutoComplete(false);
        if (props?.values?.length > 0) {
            setShowAnswerList(true);
        }

        if (props.type === 5) {
            setShowAutoComplete(true);
        }

    }

    const populateData = () => {
        if (props.data != null && props.data?.length > 0) {
            setLogicList(props.data);
        } else {
            setLogicList([]);
        }
    }

    const populateOperator = () => {
        if (props.type === 3 || props.type === 7 || props.type === 6 || props.type === 8) {
            setOperators(singleAnswerOperators);
        } else if (props.type === 4) {
            setOperators(multipleAnswerOperators);
        } else if (props.type === 5) {
            setOperators(textAnswerOperators);
        } else if (props.type === 13) {
            setOperators(dateAnswerOperators);
        }
    }

    const handleAddNewLogic = () => {
        const tempLogicType = [...logicList];
        tempLogicType.push({
            id: uuidv4(),
            operator: '',
            path: '',
            value: '',
            showValue: true
        });
        setLogicList(tempLogicType);
    }

    const handleRemoveLogic = (logicId: string) => {
        const tempLogicType: logicType[] = [];
        logicList.forEach(logic => {
            if (logic.id !== logicId) {
                tempLogicType.push(logic);
            }
        });
        setLogicList(tempLogicType);
    }

    const fetchData = () => {
        return logicList;
    }

    React.useImperativeHandle(ref, () => ({
        fetchData: fetchData
    }));

    const handleOperatorChange = (e: any, logicId: string) => {
        const value = e.target.value;
        const tempLogics: logicType[] = JSON.parse(JSON.stringify(logicList));
        tempLogics.forEach(logic => {
            if (logic.id === logicId) {
                logic.operator = value;
            }
            if (answerNotNeededSet.has(logic.operator)) {
                logic.showValue = false;
                if (logic.id === logicId) {
                    logic.value = '';
                }
            } else {
                if (logic.id === logicId) {
                    logic.value = '';
                }
                logic.showValue = true;
            }
        });
        setLogicList(tempLogics);
    }

    const handleValueChange = (e: any, logicId: string) => {
        const value = e.target.value;
        const tempLogics: logicType[] = JSON.parse(JSON.stringify(logicList));
        tempLogics.forEach(logic => {
            if (logic.id === logicId) {
                logic.value = value;
                return;
            }
        });
        setLogicList(tempLogics);
    }

    const handlePathNameChange = (e: any, logicId: string) => {
        const value = e.target.value;
        const tempLogics: logicType[] = JSON.parse(JSON.stringify(logicList));
        tempLogics.forEach(logic => {
            if (logic.id === logicId) {
                logic.path = value;
                return;
            }
        });
        setLogicList(tempLogics);
    }

    const handleAutoCompleteSave = (e: any, logicId: string) => {
        const value = e.target.value;
        const tempLogics: logicType[] = JSON.parse(JSON.stringify(logicList));
        tempLogics.forEach(logic => {
            if (logic.id === logicId) {
                logic.value += `,${value}`;
                return;
            }
        });
        setLogicList(tempLogics);
    }

    const handleChipDelete = (deletedValue: string, logicId: string) => {
        const tempLogics: logicType[] = JSON.parse(JSON.stringify(logicList));
        tempLogics.forEach(logic => {
            if (logic.id === logicId) {
                const chipData = logic.value.split(',');
                const tempChip: string[] = [];
                chipData.forEach(chip => {
                    if (chip !== deletedValue) {
                        tempChip.push(chip);
                    }
                });
                logic.value = tempChip.join(',');
            }
        });
        setLogicList(tempLogics);
    }

    const moveItem = (fromIndex: number, toIndex: number) => {
        const updatedList = [...logicList];
        const [movedItem] = updatedList.splice(fromIndex, 1);
        updatedList.splice(toIndex, 0, movedItem);
        setLogicList(updatedList);
    };

    return (
        <>
            {
                props.open === true &&
                <Box sx={modalLogicStyle} >
                    <Typography>Add logic</Typography>
                    <Typography
                        marginBottom={'10px'}
                        color={'#808080'}
                    >Wondering how survey logic works?
                        <span
                            style={{ marginTop: '10px', textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }} >
                            Learn more here.
                        </span>
                    </Typography>
                    <Divider />
                    <DndProvider backend={HTML5Backend}>
                        {
                            logicList?.map((logic, index) => {
                                return (
                                    <DraggableLogicItem
                                        key={logic.id}
                                        logic={logic}
                                        index={index}
                                        moveLogic={moveItem}
                                        handleRemoveLogic={handleRemoveLogic}
                                        handleOperatorChange={handleOperatorChange}
                                        operators={operators}
                                        showAnswerList={showAnswerList}
                                        handleValueChange={handleValueChange}
                                        values={props.values}
                                        showAutoComplete={showAutoComplete}
                                        handleAutoCompleteSave={handleAutoCompleteSave}
                                        handleChipDelete={handleChipDelete}
                                        handlePathNameChange={handlePathNameChange}
                                    />
                                )
                            })
                        }
                    </DndProvider>
                    <Box sx={logicSelectContainer}>
                        <Typography
                            onClick={handleAddNewLogic}
                            sx={{ cursor: 'pointer', textAlign: 'center' }} color={'#006dff'}
                        >+ Add new logic</Typography>
                    </Box>
                </Box>
            }
        </>
    )
}

export default React.forwardRef(CreateLogic)

function DraggableLogicItem({ logic, index, ...otherProps }: any) {

    const [, refDrag] = useDrag({
        type: 'LOGIC_ITEM',
        item: { index },
    });

    const [, refDrop] = useDrop({
        accept: 'LOGIC_ITEM',
        hover: (draggedItem: any) => {
            if (draggedItem.index !== index) {
                otherProps.moveLogic(draggedItem.index, index);
                draggedItem.index = index;
            }
        }
    });

    const combinedRef = (node: any) => refDrag(refDrop(node));

    return (
        <Box ref={combinedRef} key={logic.id} >
            <Box sx={logicListContainer} >
                <Box sx={logicIconsContainer} >
                    <Box textAlign={'end'} >
                        <IconButton sx={{cursor : 'grab'}} >
                            <DragIndicatorIcon sx={{ color: '#ffffff' }} />
                        </IconButton>
                    </Box>
                    <Box textAlign={'end'} >
                        <IconButton
                            onClick={() => otherProps.handleRemoveLogic(logic.id)}
                        ><RemoveCircleIcon sx={{ color: '#ffffff' }} />
                        </IconButton>
                    </Box>
                </Box>
                <Box marginBottom={'20px'} justifyContent={'space-between'} display={'flex'} >
                    <Typography marginTop={'7px'} marginRight={'10px'} >If answer</Typography>
                    <Select
                        sx={muiSelectStyle}
                        style={{ width: '70%' }}
                        size='small'
                        value={logic.operator}
                        onChange={(e) => otherProps.handleOperatorChange(e, logic.id)}
                    >
                        {
                            otherProps.operators?.map((operator: any) => {
                                return (
                                    <MenuItem
                                        key={operator}
                                        value={operator}
                                    >{operator}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </Box>
                {
                    otherProps.showAnswerList && logic.showValue &&
                    <Box marginBottom={'20px'} textAlign={'end'} >
                        <Select
                            sx={muiSelectStyle}
                            style={{ width: '70%', textAlign: 'start' }}
                            size='small'
                            value={logic.value}
                            onChange={(e) => otherProps.handleValueChange(e, logic.id)}
                        >
                            {
                                otherProps.values?.map((value: any, index: number) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            value={value}
                                        >{value}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </Box>
                }
                {
                    otherProps.showAutoComplete && logic.showValue &&
                    <Box marginBottom={'20px'} sx={{ textAlign: '-webkit-right' }}>
                        <Autocomplete
                            style={{ width: '70%' }}
                            multiple
                            id="tags-filled"
                            options={[]}
                            value={logic.value?.split(',')}
                            freeSolo
                            onChange={(e) => otherProps.handleAutoCompleteSave(e, logic.id)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        onDelete={(e) => otherProps.handleChipDelete(option, logic.id)}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <CssTextField
                                    {...params}
                                    size='small'
                                    label="Create options"
                                    placeholder="Tags"
                                />
                            )}
                        />
                    </Box>
                }
                <Box justifyContent={'space-between'} display={'flex'} >
                    <Typography marginTop={'7px'} marginRight={'10px'} >Go to</Typography>
                    <CssTextField
                        sx={{ input: { color: 'white' } }}
                        id="outlined-basic"
                        placeholder='Path Name'
                        variant="outlined"
                        value={logic.path}
                        onChange={(e) => otherProps.handlePathNameChange(e, logic.id)}
                        size={'small'}
                        style={{ width: '70%' }}
                    />
                </Box>
            </Box>
        </Box>
    );
}