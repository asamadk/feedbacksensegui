import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect } from 'react'

interface StyledTabProps {
    label: string;
}

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#f3d503',
    },
});

const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: 'none',
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: '#fff',
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));

function CustomTabSet(props: any) {

    const [tabSetList, setTabsetList] = React.useState<any[]>(props.tabsetList)
    const [value, setValue] = React.useState(parseInt(props.index));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        props.change(newValue);
    };

    return (
        <StyledTabs
            sx={{ position: 'relative', right: '20px' }}
            value={value}
            onChange={handleChange}
            aria-label="styled tabs example">
            {tabSetList?.map((tab: any) => {
                return <StyledTab key={tab.id} label={tab.name} />
            })}
        </StyledTabs>
    );
}

export default CustomTabSet