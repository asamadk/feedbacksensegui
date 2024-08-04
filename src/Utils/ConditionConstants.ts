import store from "../Redux/store";
import { industryOptions } from "./CompanyConstant";

export const healthScoreMetrics = [
    { label: 'Contract Status', value: 'contractStatus', type: 'options', table: 'company', relation: false, path: '' },
    // { label: 'Status', value: 'status', type: 'options', table: 'company', relation: false, path: '' },
    { label: 'Next Renewal Date', value: 'nextRenewalDate', type: 'date', table: 'company', relation: false, path: '' },
    { label: 'Start Date', value: 'startDate', type: 'date', table: 'company', relation: false, path: '' },
    { label: 'Last Activity Date', value: 'lastActivityDate', type: 'date', table: 'company', relation: false, path: '' },
    // { label: 'License Count', value: 'licenseCount', type: 'number', table: 'company', relation: false, path: '' },
    { label: 'NPS Score', value: 'npsScore', type: 'number', table: 'company', relation: false, path: '' },
    { label: 'CSAT Score', value: 'csatScore', type: 'number', table: 'company', relation: false, path: '' },
    { label: 'Usage Frequency', value: 'usageFrequency', type: 'options', table: 'company', relation: false, path: '' },
    { label: 'Last Contact Date', value: 'lastContactDate', type: 'date', table: 'company', relation: false, path: '' },
    { label: 'Journey Stage', value: 'stage', type: 'options', table: 'company', relation: true, path: 'stage.id' },
    { label: 'Onboarding Stage', value: 'onboardingStage', type: 'options', table: 'company', relation: true, path: 'onboardingStage.id' },
    { label: 'Risk Stage', value: 'riskStage', type: 'options', table: 'company', relation: true, path: 'riskStage.id' },
    // { label: 'Login Frequency', value: 'loginFrequency', type: 'options', table: 'usageEvent', relation: false, path: '' },
    // { label: 'Number of Login', value: 'eventName', type: 'number', table: 'usageEvent', relation: false, path: '' },
    // { label: 'Total Usage / day (hrs)', value: 'totalUsage', type: 'number', table: 'usageSession', relation: false, path: '' },
    // { label: 'Session Duration / day (in hrs)', value: 'sessionDuration', type: 'number', table: 'usageSession', relation: false, path: '' },
];

export function getMetricOptions(metric: string) {
    const res = [];
    if (metric === 'contractStatus') {
        res.push({ label: 'Paying', value: 'Paying' });
        res.push({ label: 'Free', value: 'Free' });
        res.push({ label: 'Churned', value: 'Churned' });
    }
    // else if (metric === 'status') {
    //     res.push({ label: 'Active', value: 'Active' });
    //     res.push({ label: 'Inactive', value: 'Inactive' });
    //     res.push({ label: 'Verified', value: 'Verified' });
    //     res.push({ label: 'Compliant', value: 'Compliant' });
    //     res.push({ label: 'Non-Compliant', value: 'Non-Compliant' });
    //     res.push({ label: 'Good Standing', value: 'Good Standing' });
    //     res.push({ label: 'Delinquent', value: 'Delinquent' });
    // } 
    else if (metric === 'usageFrequency') {
        res.push({ label: 'Daily', value: 'Daily' });
        res.push({ label: 'Monthly', value: 'Monthly' });
    } else if (metric === 'stage') {
        const state = store.getState();
        const data: any[] = state.stage;
        data.forEach(d => {
            res.push({ label: d.name, value: d.id });
        });
    } else if (metric === 'onboardingStage') {
        const state = store.getState();
        const data: any[] = state.subStage;
        data.forEach(d => {
            res.push({ label: d.name, value: d.id });
        });
    } else if (metric === 'riskStage') {
        const state = store.getState();
        const data: any[] = state.riskStage;
        data.forEach(d => {
            res.push({ label: d.name, value: d.id });
        });
    } else if (metric === 'loginFrequency') {
        res.push({ label: 'Daily', value: 'daily' });
        res.push({ label: 'Monthly', value: 'monthly' });
    }
    return res;
}

export type attributeDataType = 'options' | 'date' | 'number' | 'str';

export function getMetricDataType(val: string): attributeDataType {
    let type: attributeDataType = 'options';
    healthScoreMetrics.forEach(metric => {
        if (metric.value === val) {
            type = metric.type as any;
            return;
        }
    });
    return type;
}

export function healthOperators(val: string) {
    let type = getMetricDataType(val);
    if (type === 'options') {
        return {
            EQUALS: 'equals',
            NOT_EQUALS: 'not equals',
            IN_LIST: 'in list',
            NOT_IN_LIST: 'not in list',
            CONTAINS: 'contains',
            DOES_NOT_CONTAIN: 'Does not contain',
            IS_EMPTY: 'Is Empty',
            IS_NOT_EMPTY: 'Is Not Empty',
            // IS_CHANGED : 'Is Changed',
        }
    } else if (type === 'date') {
        return {
            IS_EMPTY: 'Is Empty',
            IS_NOT_EMPTY: 'Is Not Empty',
            // IS_CHANGED : 'Is Changed',
            OLDER_THAN_X_DAYS: 'Older than X Days',
            NEWER_THAN_X_DAYS: 'Newer than X Days'
        }
    } else if (type === 'number') {
        return {
            EQUALS: 'equals',
            NOT_EQUALS: 'not equals',
            GREATER_THAN: 'greater than',
            LESS_THAN: 'less than',
            GREATER_THAN_OR_EQUAL: 'greater than or equal',
            LESS_THAN_OR_EQUAL: 'less than or equal',
            // BETWEEN: 'between',
            IN_LIST: 'in list',
            NOT_IN_LIST: 'not in list',
            IS_EMPTY: 'Is Empty',
            IS_NOT_EMPTY: 'Is Not Empty',
            // IS_CHANGED : 'Is Changed',
            // OLDER_THAN_X_DAYS: 'Older than X Days',
            // NEWER_THAN_X_DAYS: 'Newer than X Days'
        }
    } else {
        return {
            EQUALS: 'equals',
            NOT_EQUALS: 'not equals',
            GREATER_THAN: 'greater than',
            LESS_THAN: 'less than',
            GREATER_THAN_OR_EQUAL: 'greater than or equal',
            LESS_THAN_OR_EQUAL: 'less than or equal',
            // BETWEEN: 'between',
            IN_LIST: 'in list',
            NOT_IN_LIST: 'not in list',
            CONTAINS: 'contains',
            DOES_NOT_CONTAIN: 'Does not contain',
            IS_EMPTY: 'Is Empty',
            IS_NOT_EMPTY: 'Is Not Empty',
            // IS_CHANGED : 'Is Changed',
            OLDER_THAN_X_DAYS: 'Older than X Days',
            NEWER_THAN_X_DAYS: 'Newer than X Days'
        }
    }
};


export const fieldOptions: any = {
    company: [
        { label: 'Name', value: 'name' },
        { label: 'Website', value: 'website' },
        { label: 'Industry', value: 'industry' },
        { label: 'Contract Status', value: 'contractStatus' },
        { label: 'Status', value: 'status' },
        { label: 'Next renewal date', value: 'nextRenewalDate' },
        { label: 'Amount', value: 'totalContractAmount' },
        { label: 'Address', value: 'address' },
        { label: 'Health Score', value: 'healthScore' },
        { label: 'NPS Score', value: 'npsScore' },
        { label: 'CSAT Score', value: 'csatScore' },
        { label: 'Average NPS Score', value: 'avgNpsScore' },
        { label: 'Average CSAT Score', value: 'avgCsatScore' },
        { label: 'Usage Frequency', value: 'usageFrequency' },
        { label: 'Last Contacted Date', value: 'lastContactDate' },
    ],
    task: [
        { label: 'Title', value: 'title' },
        { label: 'Description', value: 'description' },
        { label: 'Priority', value: 'priority' },
        { label: 'Due Date', value: 'dueDate' },
        { label: 'Status', value: 'status' },
    ],
    person: [
        { label: 'First Name', value: 'firstName' },
        { label: 'Last Name', value: 'lastName' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Title', value: 'title' },
        { label: 'Role', value: 'role' },
        { label: 'Communication Preference', value: 'communicationPreferences' },
        { label: 'Last contacted date', value: 'lastContactedDate' },
        { label: 'Training Completed', value: 'trainingCompleted' },
    ]
};

export const fieldInputTypes: any = {
    company: {
        contractStatus: 'select',
        nextRenewalDate: 'date',
        totalContractAmount: 'number',
        healthScore: 'select',
        npsScore: 'number',
        csatScore: 'number',
        avgNpsScore: 'number',
        avgCsatScore: 'number',
        lastContactDate: 'date',
        usageFrequency: 'select',
        status: 'select',
        industry: 'select'
    },
    task: {
        dueDate: 'date',
        priority: 'select',
        status: 'select'
    },
    person: {
        lastContactedDate: 'date',
        trainingCompleted: 'select'
    }
};

export const selectOptions: any = {
    company: {
        contractStatus: [
            { label: 'Paying', value: 'Paying' },
            { label: 'Free', value: 'Free' },
            { label: 'Churned', value: 'Churned' },
        ],
        status: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
        ],
        usageFrequency: [
            { label: 'Daily', value: 'Daily' },
            { label: 'Weekly', value: 'Weekly' },
            { label: 'BiWeekly', value: 'BiWeekly' },
            { label: 'Monthly', value: 'Monthly' }
        ],
        healthScore: [
            { label: 'Good', value: '100' },
            { label: 'Poor', value: '0' },
            { label: 'Average', value: '50' },
        ],
        industry: industryOptions.map(i => { return { label: i.value, value: i.value } })
    },
    task: {
        priority: ['Low', 'Medium', 'High', 'Urgent'],
        status: ['Open', 'InProgress', 'Completed', 'Cancelled']
    },
    person: {
        trainingCompleted: ['true', 'false']
    }
};

export const dateLiteralsOptions = [
    { label: 'Last 12 Months', value: 'last_12_months' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Last 6 Months', value: 'last_6_months' },
    { label: 'Last 60 Days', value: 'last_60_days' },
    { label: 'Last 90 Days', value: 'last_90_days' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last Week', value: 'last_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    // {label : 'Last 12 Months',value : 'last_12_months'},
    // {label : 'Last 12 Months',value : 'last_12_months'},
]