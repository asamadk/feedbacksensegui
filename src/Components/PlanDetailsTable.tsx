import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import { featureList } from '../Utils/PricingConstants'
import { colorPalette } from '../Utils/Constants';

function PlanDetailsTable() {
    return (
        <TableContainer style={{ backgroundColor: colorPalette.textSecondary }} component={Paper}>
            <Table aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell>Pricing</TableCell>
                        <TableCell>Starter</TableCell>
                        <TableCell>Plus</TableCell>
                        <TableCell>Ultimate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        featureList.map((feature, index) => {
                            return (
                                <TableRow sx={{ backgroundColor: index % 2 !== 0 ? colorPalette.textSecondary : colorPalette.background }} key={feature.name} >
                                    <TableCell>{feature.name}</TableCell>
                                    <TableCell>
                                        {feature.starter === 'yes' && <CheckIcon sx={{ color: colorPalette.primary }} />}
                                        {feature.starter === 'no' && <RemoveIcon />}
                                        {feature.starter !== 'yes' && feature.starter !== 'no' && feature.starter}
                                    </TableCell>
                                    <TableCell>
                                        {feature.plus === 'yes' && <CheckIcon sx={{ color: colorPalette.primary }} />}
                                        {feature.plus === 'no' && <RemoveIcon />}
                                        {feature.plus !== 'yes' && feature.plus !== 'no' && feature.plus}
                                    </TableCell>
                                    <TableCell>
                                        {feature.business === 'yes' && <CheckIcon sx={{ color: colorPalette.primary }} />}
                                        {feature.business === 'no' && <RemoveIcon />}
                                        {feature.business !== 'yes' && feature.business !== 'no' && feature.business}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PlanDetailsTable