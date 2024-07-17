import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box, Button, Chip, IconButton, MenuItem, Select, TextField, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { modalContainerStyle } from '../Styles/ModalStyle';
import { colorPalette, dateLiterals } from '../Utils/Constants';
import { dateLiteralsOptions, fieldInputTypes, fieldOptions, selectOptions } from '../Utils/ConditionConstants';
import { DatePicker } from '@mui/lab';
import { textFieldStyle } from '../Styles/InputStyles';
import { parseDataType } from '../Utils/FeedbackUtils';

const conditionGroupContainer = {
  ...modalContainerStyle,
  marginTop: '10px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
}

const CssTextField = styled(TextField)(textFieldStyle);

interface ConditionBuilderProps {
  recordType: string;
  data: any
}

export interface ConditionBuilderRef {
  getState: () => any;
}



const ConditionBuilder = forwardRef<ConditionBuilderRef, ConditionBuilderProps>(({ recordType, data }, ref) => {

  const [conditions, setConditions] = useState<any[][]>([[]]);

  const operators = ['Equal', 'Not Equals', 'Less Than', 'Greater That', 'Less Than or Equal', 'Greater Than or Equal', 'Contains'];

  useImperativeHandle(ref, () => ({
    getState: () => conditions,
  }));

  useEffect(() => {
    if (data) {
      setConditions(data || [[]]);
    }
  }, [data]);

  function addGroupCondition() {
    const tmp = JSON.parse(JSON.stringify(conditions));
    tmp.push([]);
    setConditions(tmp);
  }

  function addCondition(index: number) {
    const tmp: any[][] = JSON.parse(JSON.stringify(conditions));
    tmp[index].push({});
    setConditions(tmp);
  }

  function removeCondition(index: number) {
    const tmp: any[][] = JSON.parse(JSON.stringify(conditions));
    tmp.splice(index, 1);
    setConditions(tmp);
  }

  function removeSingleCondition(indexMain: number, indexSub: number) {
    const tmp: any[][] = JSON.parse(JSON.stringify(conditions));
    tmp[indexMain].splice(indexSub, 1);
    setConditions(tmp);
  }

  function addData(indexMain: number, indexSub: number, data: any, type: 'field' | 'operator' | 'value') {
    const tmp: any[][] = JSON.parse(JSON.stringify(conditions));
    tmp[indexMain][indexSub][type] = parseDataType(data);
    if (tmp[indexMain][indexSub]['where'] == null) {
      tmp[indexMain][indexSub]['where'] = 'AND'
    }
    setConditions(tmp);
  }

  function changeWhere(indexMain: number, indexSub: number) {
    const tmp: any[][] = JSON.parse(JSON.stringify(conditions));
    if (tmp[indexMain][indexSub]['where'] == 'AND') {
      tmp[indexMain][indexSub]['where'] = 'OR';
    } else {
      tmp[indexMain][indexSub]['where'] = 'AND';
    }
    setConditions(tmp);
  }

  const renderValueInput = (indexMain: number, indexSub: number) => {
    const inputType = fieldInputTypes[recordType][conditions[indexMain][indexSub]['field']];

    switch (inputType) {
      case 'select':
        return (
          <Select
            sx={{ width: '30%' }}
            size='small'
            value={conditions[indexMain][indexSub]['value']}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'value')}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Value</MenuItem>
            {selectOptions[recordType][conditions[indexMain][indexSub]['field']].map((option: any) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        );
      case 'date':
        return (
          <Select
            sx={{ width: '30%' }}
            size='small'
            value={conditions[indexMain][indexSub]['value']}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'value')}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Value</MenuItem>
            {dateLiteralsOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        );
      case 'number':
        return (
          <CssTextField
            sx={{ width: '30%' }}
            size='small'
            type="number"
            value={conditions[indexMain][indexSub]['value']}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'value')}
            placeholder="Value"
          />
        );
      default:
        return (
          <CssTextField
            size='small'
            value={conditions[indexMain][indexSub]['value']}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'value')}
            placeholder="Value"
          />
        );
    }
  };

  function Condition(showChip: boolean, indexMain: number, indexSub: number, onRemove: any) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '10px', justifyContent: 'space-evenly' }}>
          <Select
            sx={{ width: '30%' }}
            size='small'
            value={conditions[indexMain][indexSub]['field'] || ''}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'field')}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Field</MenuItem>
            {fieldOptions[recordType].map((option: any) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>

          <Select
            sx={{ width: '20%' }}
            size='small'
            value={conditions[indexMain][indexSub]['operator'] || ''}
            onChange={(e) => addData(indexMain, indexSub, e.target.value, 'operator')}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Operator</MenuItem>
            {operators.map((op) => (
              <MenuItem key={op} value={op}>{op}</MenuItem>
            ))}
          </Select>
          {renderValueInput(indexMain, indexSub)}
          <IconButton onClick={() => onRemove()}><DeleteIcon /></IconButton>
        </Box>
        {showChip &&
          <WhereClause
            change={() => changeWhere(indexMain, indexSub)}
            type={conditions[indexMain][indexSub]['where'] || 'AND'}
          />
        }
      </>
    )
  }

  return (
    <Box color={'black'} className="container">
      <Box>
        {
          conditions?.map((condition, index) => <>
            <Box sx={conditionGroupContainer} >
              {
                condition.map((singleCondition, pos) => <Box>
                  {Condition(
                    pos < condition.length - 1,
                    index,
                    pos,
                    () => removeSingleCondition(index, pos),
                  )}
                </Box>)
              }
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Button
                  onClick={() => addCondition(index)}
                  size='small'
                  sx={{ ...outlinedButton, width: 'fit-content' }}
                >
                  Add Condition
                </Button>
                {/* <Button
                  onClick={() => removeCondition(index)}
                  size='small'
                  sx={{ ...outlinedButton, width: 'fit-content' }}
                >
                  Remove
                </Button> */}
              </Box>
            </Box>
            {/* {
              index < conditions.length - 1 &&
              <WhereClause change={() => changeWhere(index,pos)} type='AND' />
            } */}
          </>)
        }
      </Box>
      {/* <Box justifyContent={'center'} display={'flex'} >
        <Button onClick={addGroupCondition} size='small' sx={{ ...containedButton, width: 'fit-content' }} >Add Group Condition</Button>
      </Box> */}
    </Box>
  );
});

export default ConditionBuilder;

function WhereClause(props: { type: 'AND' | 'OR', change: any }) {
  return (
    <Box sx={{ padding: '5px', width: 'fit-content', margin: 'auto', marginTop: '5px',marginBottom : '5px' }} >
      <Chip 
        onClick={props.change} 
        sx={{ cursor: 'pointer' }} 
        size='small' 
        color='secondary' 
        variant='filled' 
        label={props.type} 
      />
    </Box>
  )
}