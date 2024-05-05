import store from "../Redux/store";

export const healthScoreMetrics = [
    {label : 'Contract Status',value : 'contractStatus',type : 'options'},
    {label : 'Status',value : 'status',type : 'options'},
    {label : 'Next Renewal Date',value : 'nextRenewalDate',type : 'date'},
    {label : 'Start Date',value : 'startDate',type : 'date'},
    {label : 'Last Activity Date',value : 'lastActivityDate',type : 'date'},
    {label : 'License Count',value : 'licenseCount',type : 'number'},
    {label : 'NPS Score',value : 'npsScore',type : 'number'},
    {label : 'CSAT Score',value : 'csatScore',type : 'number'},
    {label : 'Usage Frequency',value : 'usageFrequency',type : 'options'},
    {label : 'Last Contact Date',value : 'lastContactDate',type : 'date'},
    {label : 'Journey Stage',value : 'stage',type : 'options'},
    {label : 'Onboarding Stage',value : 'subStage',type : 'options'},
    {label : 'Login Frequency',value : 'loginFrequency',type : 'options'},
    {label : 'Number of Login',value : 'nEvents',type : 'number'},
    {label : 'Total Usage / day (hrs)',value : 'totalUsage',type : 'number'},
    {label : 'Session Duration / day (in hrs)',value : 'sessionDuration',type : 'number'},
];

export function getMetricOptions(metric : string){
    const res = [];
    if(metric === 'contractStatus'){
        res.push({label : 'Paying',value : 'Paying'});
        res.push({label : 'Free',value : 'Free'});
    }else if(metric === 'status'){
        res.push({label : 'Active',value : 'Active'});
        res.push({label : 'Inactive',value : 'Inactive'});
        res.push({label : 'Verified',value : 'Verified'});
        res.push({label : 'Compliant',value : 'Compliant'});
        res.push({label : 'Non-Compliant',value : 'Non-Compliant'});
        res.push({label : 'Good Standing',value : 'Good Standing'});
        res.push({label : 'Delinquent',value : 'Delinquent'});
    }else if(metric === 'usageFrequency'){
        res.push({label : 'Daily',value : 'Daily'});
        res.push({label : 'Monthly',value : 'Monthly'});
    }else if(metric === 'stage'){
        const state = store.getState();
        const data :any[] = state.stage;
        data.forEach(d => {
            res.push({label : d.name,value : d.id});
        });
    }else if(metric === 'subStage'){
        const state = store.getState();
        const data :any[] = state.subStage;
        data.forEach(d => {
            res.push({label : d.name,value : d.id});
        });
    }else if(metric === 'loginFrequency'){
        res.push({label : 'Daily',value : 'daily'});
        res.push({label : 'Monthly',value : 'monthly'});
    }
    return res;
}

export type attributeDataType = 'options' | 'date' | 'number' | 'str';

export function getMetricDataType(val : string) :attributeDataType{
    let type :attributeDataType = 'options';
    healthScoreMetrics.forEach(metric => {
        if(metric.value === val){
            type = metric.type as any;
            return;
        }
    });
    return type;
}

export function healthOperators(val : string){
    let type = getMetricDataType(val);
    if(type === 'options'){
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
    }else if(type === 'date'){
        return {
            IS_EMPTY: 'Is Empty',
            IS_NOT_EMPTY: 'Is Not Empty',
            // IS_CHANGED : 'Is Changed',
            OLDER_THAN_X_DAYS: 'Older than X Days',
            NEWER_THAN_X_DAYS: 'Newer than X Days'
        }
    }else if(type === 'number'){
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
    }else{
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
