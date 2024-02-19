import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect } from 'react'
import { colorPalette } from '../Utils/Constants';

interface StyledTabProps {
    label: string;
}

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function CustomTabSet(props: any) {

    const StyledTabs = styled((localProps: StyledTabsProps) => (
        <Tabs
            orientation={props?.orientation === 'vertical' ? 'vertical' : 'horizontal'}
            {...localProps}
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 50,
            width: '100%',
            backgroundColor: colorPalette.primary,
            // backgroundColor: 'transparent',
        }
    });

    const StyledTab = styled((props: StyledTabProps) => (
        <Tab disableRipple {...props} />
    ))(({ theme }) => ({
        textTransform: 'none',
        marginRight: theme.spacing(1),
        color: colorPalette.darkBackground,
        '&.Mui-selected': {
            color: colorPalette.primary,
            fontWeight : 600,
            // background : '#ddd5e6',
            borderRadius : '7px'
        },
        '&.Mui-focusVisible': {
            backgroundColor: colorPalette.secondary,
        },
        fontWeight : 550
    }));

    const [tabSetList, setTabsetList] = React.useState<any[]>(props.tabsetList)
    const [value, setValue] = React.useState(parseInt(props.index));

    useEffect(() => {
        setValue(props.index);
    },[props.index]);

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