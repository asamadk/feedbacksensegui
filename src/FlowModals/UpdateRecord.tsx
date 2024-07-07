import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCompConfigFromUiId } from '../Utils/FeedbackUtils';
import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import { flowModalStyleComponents, modalButtonContainerStyle, modalHeaderStyle, modalBodyContainerStyle, automationModalHeaderStyle } from '../Styles/ModalStyle';
import { colorPalette, componentName } from '../Utils/Constants';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { userRoleType } from '../Utils/types';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { muiSelectStyle, textFieldStyle } from '../Styles/InputStyles';
import { dateLiteralsOptions, fieldInputTypes, fieldOptions, selectOptions } from '../Utils/ConditionConstants';
import { showNotification } from '../Redux/Reducers/NotificationReducer';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function UpdateRecordModal(props: any) {

    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const [desc, setDesc] = useState('');
    const [fields, setFields] = useState([{ field: '', value: '' }]);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const dispatch = useDispatch();

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.fields) {
            setFields(compConfig?.fields);
        } else {
            setFields([{field : '',value : ''}]);
        }
    }

    const handleSave = () => {
        let obj = {
            desc: desc,
            fields : fields
        }
        props.save(JSON.stringify(obj));
    }

    const renderValueInput = (field :string,value : string,index :number) => {
        const inputType = fieldInputTypes[props.recordType][field];

        switch (inputType) {
            case 'select':
                return (
                    <Select
                        fullWidth
                        size='small'
                        value={value}
                        onChange={(e) => changeValue(e.target.value,index)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Value</MenuItem>
                        {selectOptions[props.recordType][field].map((option: any) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                );
            case 'date':
                return (
                    <Select
                        fullWidth
                        size='small'
                        value={value}
                        onChange={(e) => changeValue(e.target.value,index)}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select Value</MenuItem>
                        <MenuItem value={'today'}>Today</MenuItem>
                        <MenuItem value={'yesterday'}>Yesterday</MenuItem>
                        <MenuItem value={'tomorrow'}>Tomorrow</MenuItem>
                    </Select>
                );
            case 'number':
                return (
                    <CssTextField
                        fullWidth
                        size='small'
                        type="number"
                        value={value}
                        onChange={(e) => changeValue(e.target.value,index)}
                        placeholder="Value"
                    />
                );
            default:
                return (
                    <CssTextField
                        fullWidth
                        size='small'
                        value={value}
                        onChange={(e) => changeValue(e.target.value,index)}
                        placeholder="Value"
                    />
                );
        }
    };

    function changeField(field : string,index :number){
        const tmp : {
            field: string;
            value: string;
        }[] = JSON.parse(JSON.stringify(fields));
        tmp[index].field = field;
        setFields(tmp);
    }

    function changeValue(value : string,index :number){
        const tmp : {
            field: string;
            value: string;
        }[] = JSON.parse(JSON.stringify(fields));
        tmp[index].value = value;
        setFields(tmp);
    }

    function addField() {
        const tmp: any[] = JSON.parse(JSON.stringify(fields));
        tmp.push({
            field: '',
            value: ''
        });
        setFields(tmp);
    }

    function removeField(index: number) {
        const tmp: any[] = JSON.parse(JSON.stringify(fields));
        tmp.splice(index, 1);
        setFields(tmp);
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={flowModalStyleComponents(colorPalette.background)}>
                    <Box width={'100%'}>
                        <Box sx={automationModalHeaderStyle} >
                            <Box></Box>
                            <Typography margin={'5px'} id="modal-modal-title" fontSize={'18px'} component="h2">
                                {props.header}
                            </Typography>
                            <IconButton  >
                                <CloseIcon sx={{ color: 'white' }} onClick={props.close} />
                            </IconButton>
                        </Box>

                        <Box height={'calc(100vh - 330px)'} sx={{ overflowY: 'scroll' }}>
                            <Box padding={'10px'} >
                                <ModalSnippets text={'To make changes, please un-publish the workflow'} published={props.isPublished} />
                                <ModalSnippets
                                    text={'Guest cannot edit the surveys'}
                                    published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
                                />
                            </Box>
                            <Box sx={{ ...modalBodyContainerStyle, marginTop: '0px', padding: '20px' }} >
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Description'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />
                                {
                                    fields?.map((f, index) =>
                                        <Box display={'flex'} margin={'20px'} justifyContent={'space-between'} >
                                            <Box width={'48%'} >
                                                <label style={{ color: 'gray' }} >Record Field</label>
                                                <CustomSelect
                                                    value={f.field}
                                                    onChange={(e) => changeField(e.target.value as string,index)}
                                                    fullWidth size='small'
                                                >
                                                    {
                                                        fieldOptions[props.recordType]?.map((field: any) => <MenuItem value={field.value} >{field.label}</MenuItem>)
                                                    }
                                                </CustomSelect>
                                            </Box>
                                            <Box width={'48%'} >
                                                <label style={{ color: 'gray' }} >Record value</label>
                                                <Box>
                                                    {renderValueInput(f.field,f.value,index)}
                                                </Box>
                                            </Box>
                                            <Box width={'2%'} >
                                                <IconButton onClick={() => removeField(index)} sx={{ marginTop: '20px', marginLeft: '10px' }}>
                                                    <CloseIcon sx={{ color: colorPalette.primary }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    )
                                }
                                <Box margin={'20px'} >
                                    <Button onClick={addField} sx={{ ...outlinedButton, width: '80px' }} size='small' >Add Field</Button>
                                </Box>
                            </Box>

                        </Box>
                        <Box sx={modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default UpdateRecordModal