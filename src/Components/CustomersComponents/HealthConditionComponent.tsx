import { Autocomplete, Box, Chip, MenuItem, Select, TextField, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../../Utils/Constants'
import { attributeDataType, getMetricDataType, getMetricOptions, healthOperators, healthScoreMetrics } from '../../Utils/ConditionConstants';
import { textFieldStyle } from '../../Styles/InputStyles';

const CssTextField = styled(TextField)({ ...textFieldStyle, background: 'white' });

type propsType = {
    type: 'metric' | 'non-metric',
    disabled: boolean,
    metric: string,
    operator: any,
    value: any,
    onMetricChange: any,
    onOperatorChange: any,
    onValueChange: any,
}

function HealthConditionComponent({ type, disabled, metric, operator, value, onMetricChange, onOperatorChange, onValueChange }: propsType) {

    const [selectedMetric, setSelectedMetric] = useState(metric);
    const [selectedOperator, setSelectedOperator] = useState(operator);
    const [selectedValue, setSelectedValue] = useState(value);

    function handleMetricChange(val: any) {
        setSelectedMetric(val);
        onMetricChange(val);
    }

    function handleOperatorChange(val: any) {
        setSelectedOperator(val);
        onOperatorChange(val);
    }

    function handleValueChange(val: any) {
        setSelectedValue(val);
        onValueChange(val);
    }

    return (
        <Box padding={'25px'} >
            {type === 'metric' && <Field change={handleMetricChange} val={selectedMetric} disabled={disabled} />}
            {type === 'non-metric' && <Operator change={handleOperatorChange} val={selectedOperator} disabled={disabled} metric={selectedMetric} />}
            {type === 'non-metric' && <Value change={handleValueChange} val={selectedValue} disabled={disabled} operator={selectedOperator} metric={metric} />}
        </Box>
    )
}

export default HealthConditionComponent

function Field({ disabled, val, change }: { disabled: boolean, val: any, change: any }) {

    return (
        <Box>
            <Select
                onChange={(e) => change(e.target.value)}
                value={val}
                disabled={disabled}
                sx={{ background: 'white' }}
                fullWidth size='small'
                placeholder='Select field'
            >
                {
                    healthScoreMetrics.map(metric =>
                        <MenuItem value={metric.value} >{metric.label}</MenuItem>
                    )
                }
            </Select>
        </Box>
    )
}

function Operator({ disabled, val, change, metric }: { disabled: boolean, val: any, change: any, metric: string }) {
    return (
        <Box marginTop={'10px'}>
            <label style={{ color: colorPalette.fsGray }} >Operation</label>
            <Select
                value={val}
                disabled={disabled}
                sx={{ background: 'white' }}
                fullWidth size='small'
                placeholder='Select Operator'
                onChange={(e) => change(e.target.value)}
            >
                {
                    Object.values(healthOperators(metric)).map(op =>
                        <MenuItem value={op} >{op}</MenuItem>
                    )
                }
            </Select>
        </Box>
    )
}

function Value({ disabled, val, change, operator, metric }: { disabled: boolean, val: any, change: any, operator: any, metric: string }) {

    const commonInputProps: any = {
        disabled: disabled,
        fullWidth: true,
        size: 'small',
        placeholder: 'Enter value',
        onChange: (e: any) => change(e.target.value)
    };

    function InputField(type: 'text' | 'number' | 'date') {
        return (
            <CssTextField type={type} {...commonInputProps} value={val} />
        )
    }

    const handleAutoCompleteSave = (e: any) => {
        let value = e.target.value;
        if(val.length > 0){
            value = val + `,${value}`;
        }else{
            value = val + `${value}`;
        }
        change(value);
    }

    function handleChipDelete(value :any){
        const valStr :any[]  =  val.split(',');
        const newStr :string[] = [];
        valStr.forEach(v => {
            if(v !== value){newStr.push(v);}
        });
        change(newStr.join(','));
    }

    function ListSelector() {
        return (

            <>
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={[]}
                    value={val?.length > 0 ? val?.split(',') : ''}
                    freeSolo
                    disabled={disabled}
                    onChange={(e: any) => handleAutoCompleteSave(e)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                onDelete={(e) => handleChipDelete(option)}
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
                <Typography
                    textAlign={'start'}
                    width={'70%'}
                    marginTop={'5px'}
                    fontSize={'12px'}
                    color={'#808080'}
                >
                    Tip: After typing your tag, press 'Enter' to register it.
                </Typography></>
        )
    }

    const [inputComponent, setInputComponent] = useState(<></>);

    function updateValueInput() {
        const dataType: attributeDataType = getMetricDataType(metric);
        const obj = healthOperators('');
        switch (dataType) {
            case 'options':
                switch (operator) {
                    case obj.EQUALS:
                    case obj.NOT_EQUALS:
                        setInputComponent(
                            <Select value={val} sx={{ background: 'white' }} {...commonInputProps} >
                                {getMetricOptions(metric).map(opt =>
                                    <MenuItem value={opt.value} >{opt.label}</MenuItem>
                                )}
                            </Select>
                        );
                        break;
                    case obj.IN_LIST:
                    case obj.NOT_IN_LIST:
                        setInputComponent(ListSelector());
                        break;
                    case obj.IS_EMPTY:
                    case obj.IS_NOT_EMPTY:
                        setInputComponent(<></>)
                        break;
                    default:
                        setInputComponent(InputField('text'))
                }
                break;
            case 'date':
                switch (operator) {
                    case obj.IS_EMPTY:
                    case obj.IS_NOT_EMPTY:
                        setInputComponent(<></>)
                        break;
                    default:
                        setInputComponent(InputField('number'))
                        break;
                }
                break;
            case 'number':
                switch (operator) {
                    case obj.IN_LIST:
                    case obj.NOT_IN_LIST:
                        setInputComponent(ListSelector());
                        break;
                    case obj.IS_EMPTY:
                    case obj.IS_NOT_EMPTY:
                        setInputComponent(<></>)
                        break;
                    default:
                        setInputComponent(InputField('number'));
                        break;
                }
                break;
            default:
                setInputComponent(InputField('text'));
                break;
        }
    }

    useEffect(() => {
        updateValueInput();
    }, [operator, val, disabled, metric]);

    return (
        <Box marginTop={'10px'} >
            <label style={{ color: colorPalette.fsGray }} >Value</label>
            {inputComponent}
        </Box>
    )
}