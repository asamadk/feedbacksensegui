import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface Condition {
  id: number;
  field: string;
  operator: string;
  value: string | number | boolean | Date;
  logic: 'AND' | 'OR';
}

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'website', label: 'Website', type: 'text' },
  { name: 'industry', label: 'Industry', type: 'text' },
  {
    name: 'contractStatus',
    label: 'Contract Status',
    type: 'select',
    options: ['Paying', 'Free']
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      'Active', 'Inactive', 'Verified', 'Unverified', 
      'Compliant', 'Non-Compliant', 'Good Standing', 'Delinquent'
    ]
  },
  { name: 'startDate', label: 'Start Date', type: 'date' },
  { name: 'nextRenewalDate', label: 'Next Renewal Date', type: 'date' },
  { name: 'totalContractAmount', label: 'Total Contract Amount', type: 'number' },
  { name: 'lastActivityDate', label: 'Last Activity Date', type: 'date' },
  { name: 'licenseCount', label: 'License Count', type: 'number' },
  { name: 'subscriptionPlan', label: 'Subscription Plan', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'healthScore', label: 'Health Score', type: 'number' },
  { name: 'attributeHealthScore', label: 'Attribute Health Score', type: 'text' },
  { name: 'npsScore', label: 'NPS Score', type: 'number' },
  { name: 'csatScore', label: 'CSAT Score', type: 'number' },
  { name: 'avgNpsScore', label: 'Avg NPS Score', type: 'number' },
  { name: 'avgCsatScore', label: 'Avg CSAT Score', type: 'number' },
  { name: 'churnRiskLevel', label: 'Churn Risk Level', type: 'text' },
  { name: 'usageFrequency', label: 'Usage Frequency', type: 'text' },
  { name: 'lastContactDate', label: 'Last Contact Date', type: 'date' },
  { name: 'onboardingCompletionStatus', label: 'Onboarding Completion Status', type: 'text' }
];

const operators :any = {
  text: ['equals', 'not equals', 'contains', 'does not contain'],
  number: ['equals', 'not equals', 'greater than', 'less than'],
  date: ['equals', 'not equals', 'before', 'after'],
  select: ['equals', 'not equals']
};

const QueryBuilder: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: Date.now(), field: '', operator: '', value: '', logic: 'AND' }
  ]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: Date.now(), field: '', operator: '', value: '', logic: 'AND' }
    ]);
  };

  const removeCondition = (id: number) => {
    setConditions(conditions.filter(cond => cond.id !== id));
  };

  const updateCondition = (id: number, key: string, value: any) => {
    setConditions(conditions.map(cond =>
      cond.id === id ? { ...cond, [key]: value } : cond
    ));
  };

  const handleApplyConditions = () => {
    console.log('Conditions:', conditions);
    // Here, you would typically send the conditions to your backend
  };

  return (
    <Box className="container">
      {conditions.map((cond, index) => (
        <Grid container spacing={2} alignItems="center" key={cond.id}>
          <Grid item xs={2}>
            <Select
              fullWidth
              value={cond.field}
              onChange={e => updateCondition(cond.id, 'field', e.target.value)}
            >
              {fields.map(field => (
                <MenuItem key={field.name} value={field.name}>
                  {field.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={2}>
            <Select
              fullWidth
              value={cond.operator}
              onChange={e => updateCondition(cond.id, 'operator', e.target.value)}
            >
              {(operators[fields.find(field => field.name === cond.field)?.type || 'text'] || []).map((op :any) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={3}>
            {fields.find(field => field.name === cond.field)?.type === 'select' ? (
              <Select
                fullWidth
                value={cond.value}
                onChange={e => updateCondition(cond.id, 'value', e.target.value)}
              >
                {(fields.find(field => field.name === cond.field)?.options || []).map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                fullWidth
                type={fields.find(field => field.name === cond.field)?.type || 'text'}
                value={cond.value}
                onChange={e => updateCondition(cond.id, 'value', e.target.value)}
              />
            )}
          </Grid>
          {index > 0 && (
            <Grid item xs={1}>
              <Select
                fullWidth
                value={cond.logic}
                onChange={e => updateCondition(cond.id, 'logic', e.target.value)}
              >
                <MenuItem value="AND">AND</MenuItem>
                <MenuItem value="OR">OR</MenuItem>
              </Select>
            </Grid>
          )}
          <Grid item xs={1}>
            <IconButton
              color="secondary"
              onClick={() => removeCondition(cond.id)}
            >
              <RemoveIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Box mt={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addCondition}
        >
          Add Condition
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 16 }}
          onClick={handleApplyConditions}
        >
          Apply Conditions
        </Button>
      </Box>
    </Box>
  );
};

export default QueryBuilder;
