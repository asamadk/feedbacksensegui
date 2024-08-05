import { Box, Button, Checkbox, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTaskModal from '../../Modals/ContactModals/CreateTaskModa';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { deleteTaskURL, getTaskURL, updateTaskURL } from '../../Utils/Endpoints';
import GenericModal from '../../Modals/GenericModal';
import { taskStatusStyle } from '../../Styles/LayoutStyles';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanyFieldTable(companyId: { companyId: string }) {

    const [col,setCol] = useState<string[]>(['Field','Values']);
    const [rows,setRows] = useState<any[]>([{
        field  : 'Owner',
        value : 'Abdul Samad Kirmani'
    }]);

    return (
        <Box margin={'20px'} padding={'20px'}>
            <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 335px)' }} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead >
                        <TableRow >
                            {col?.map((column: string) => (
                                <TableCell sx={{ ...tableCellStyle, fontWeight: '600', backgroundColor: colorPalette.secondary }} key={column}>
                                    {column}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows?.map(row => (
                                <TableRow key={row.field} >
                                    <TableCell sx={{borderRight : `1px ${colorPalette.textSecondary} solid`}} >
                                        <b>{row.field}</b>
                                    </TableCell>
                                    <TableCell>
                                        {row.value}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default CompanyFieldTable