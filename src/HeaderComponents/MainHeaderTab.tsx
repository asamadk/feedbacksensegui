import { Box } from '@mui/material'
import React from 'react'
import CustomTabSet from '../Components/CustomTabSet'
import { useNavigate } from 'react-router';

const tabSetList = [
    { id: 0, name: 'Workspaces' },
    { id: 1, name: 'Templates' },
    { id: 2, name: 'Integrations' },
];

function MainHeaderTab() {

    const navigate = useNavigate();
    const [tabset, setTabset] = React.useState(0);

    const handleTabChange = (value : number) =>  {
        setTabset(value);
        if(value === 0){
            navigate('/');
        }else if(value === 1){
            navigate('/template')
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }} >
            <CustomTabSet
                tabsetList={tabSetList}
                change={(value: number) => handleTabChange(value)}
                index={tabset}
            />
        </Box>
    )
}

export default MainHeaderTab