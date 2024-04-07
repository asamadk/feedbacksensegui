import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CompanyNotesTab() {
  const col: string[] = ['Name', 'Contact', 'Type', 'Note Date', 'Action'];
  const [metrics, setMetrics] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const tmp = [
      {id: 1,count: 2,label: 'Last 7 Days'},
      {id: 1,count: 10,label: 'Last 30 Days'},
      {id: 1,count: 7,label: 'Last 90 Days'}
    ];
    setMetrics(tmp);

    const res = [
      {id : 1,name : 'Call Note',contact : 'Adam Pret', type : 'X', date : '12/02/2020'},
      {id : 2,name : 'Schedule configuration call',contact : 'Brett Quizo', type : 'Sid', date : '07/09/2024'},
      {id : 3,name : 'Onboarding kickoff call',contact : 'Brett Quizo', type : 'Sid', date : '07/09/2024'},
      {id : 3,name : 'Call - no answer',contact : 'Brett Quizo', type : 'Sid', date : '07/09/2024'},
    ];
    setNotes(res);
  }, []);

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Notes</Typography>
        <Button
          sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }}
        >Add a Note</Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }} >
        {
          metrics?.map(metric => (
            <Box>
              <Typography variant='h2' sx={{ color: colorPalette.primary }} >{metric.count}</Typography>
              <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{metric.label}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer sx={{ backgroundColor: colorPalette.textSecondary, border: 'none', height: 'calc(100vh - 335px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ fontWeight: '600' }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                notes?.map(note => (
                  <TableRow key={note.id} >
                    <TableCell>
                      {note.name}
                    </TableCell>
                    <TableCell>
                      {note.contact}
                    </TableCell>
                    <TableCell>
                      {note.type}
                    </TableCell>
                    <TableCell>
                      {note.date}
                    </TableCell>
                    <TableCell>
                      <IconButton size='small' >
                          <EditIcon sx={{color : colorPalette.fsGray}} />
                      </IconButton>
                      <IconButton size='small' >
                          <DeleteIcon sx={{color : colorPalette.fsGray}} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default CompanyNotesTab