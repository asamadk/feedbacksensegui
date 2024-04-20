import React, { useEffect, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle'
import { Box, Button, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { colorPalette } from '../../Utils/Constants';
import EmailIcon from '@mui/icons-material/Email';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanyCommTab() {
  const col: string[] = ['Message Name', 'Origin', 'From', 'To', 'CC', 'BCC', 'Date Sent', 'Engagement'];
  const [messageMetrics, setMessageMetrics] = useState<any[]>([]);
  const [messageList, setMessageList] = useState<any[]>([]);

  useEffect(() => {
    const tmp = [
      { id: 1, count: 0, label: 'Email Received' },
      { id: 1, count: 133, label: 'Email Sent' },
      { id: 1, count: 1163, label: 'Announcement Posted' }
    ];
    setMessageMetrics(tmp);

    const res = [
      { id: 1, name: 'WEBEX Satisfactory Survey', origin: 'NPS Campaign', from: 'Damon Peueck', to: 'Crystal Betcheck', cc: '', bcc: '', date: '06/2/2022 03:05PM', engagement: '' },
      { id: 2, name: 'WEBEX Satisfactory Survey', origin: 'NPS Campaign', from: 'Damon Peueck', to: 'Crystal Betcheck', cc: '', bcc: '', date: '06/2/2022 03:05PM', engagement: '' },
      { id: 3, name: 'WEBEX Satisfactory Survey', origin: 'NPS Campaign', from: 'Damon Peueck', to: 'Crystal Betcheck', cc: '', bcc: '', date: '06/2/2022 03:05PM', engagement: '' },
    ];
    setMessageList(res);
  }, []);

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Messages</Typography>
        <Box>
          <Button sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }}>Compose</Button>
          <Button sx={{ ...outlinedButton, width: 'fit-content', marginTop: '0', marginLeft: '10px' }}>Run Account Play</Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }} >
        {
          messageMetrics?.map(message => (
            <Box>
              <Typography variant='h2' sx={{ color: colorPalette.primary }} >{message.count}</Typography>
              <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{message.label}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 335px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle,fontWeight: '600',background : colorPalette.secondary }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                messageList?.map(message => (
                  <TableRow key={message.id} >
                    <TableCell sx={tableCellStyle} >
                      {message.name}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.origin}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.from}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.to}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.cc}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.bcc}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.date}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {message.engagement}
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

export default CompanyCommTab