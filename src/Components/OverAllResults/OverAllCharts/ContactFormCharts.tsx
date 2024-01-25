import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { colorPalette } from '../../../Utils/Constants';

const mainContainer = {
  marginTop: '20px',
  color: colorPalette.darkBackground,
  textAlign: 'start',
  padding: '20px'
};

type PropsType = {
  id: number;
  data: any;
};

function ContactFormCharts(props: PropsType) {
  return (
    <Box sx={mainContainer}>
      <ContactResultTable data={props.data} />
      <Box marginTop={'20px'}>
        <Typography color={colorPalette.darkBackground}>
          Total: <span style={{ color: colorPalette.fsGray }}>{props?.data?.contactInfoRow?.length} response</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default ContactFormCharts;


function ContactResultTable({ data }: any) {
  
  const [page, setPage] = useState(0);
  const defaultColor = useSelector((state: any) => state.colorReducer);
  const [rowsPerPage, setRowsPerPage] = useState( data?.contactInfoRow?.length > 5 ? 5 : data?.contactInfoRow?.length);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(rows?.length < parseInt(event.target.value)){
      return;
    }
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rows = data?.contactInfoRow || [];

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <TableContainer sx={{backgroundColor : colorPalette.textSecondary,border :'none'}} >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow >
            {data?.contactColumn?.map((column: string) => (
              <TableCell sx={{fontWeight : '600'}} key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((contactRow: any[], index: number) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {contactRow.map((row: string, cellIndex: number) => (
                <TableCell key={cellIndex} component="th" scope="row">
                  {row}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {emptyRows > 0 && page === Math.ceil(rows.length / rowsPerPage) - 1 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={data?.contactColumn?.length} />
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{background : colorPalette.textSecondary}}
      />
    </TableContainer>
  );
}