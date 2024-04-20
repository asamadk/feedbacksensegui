import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import { colorPalette } from "../Utils/Constants";

export const tableContainerStyle :SxProps<Theme> = {
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    // border: 'none',
    backgroundColor: colorPalette.background,
    borderRadius : '10px',
    border : `1px ${colorPalette.textSecondary} solid`,
}

export const paginationStyle :SxProps<Theme> = {

}

export const tableCellStyle :SxProps<Theme> = {
    border : 'none'
}

export const tableBodyText :SxProps<Theme> = {
    // fontWeight : 600,
    fontSize : '14px',
}