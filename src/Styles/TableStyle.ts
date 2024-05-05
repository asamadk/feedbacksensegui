import { SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import { colorPalette } from "../Utils/Constants";
import { getLineChartColor } from "../Utils/FeedbackUtils";

export const tableContainerStyle :SxProps<Theme> = {
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    // border: 'none',
    backgroundColor: colorPalette.background,
    borderRadius : '10px',
    border : `1px ${colorPalette.textSecondary} solid`,
}

export const paginationStyle :SxProps<Theme> = {

}

export const tableVerticalBorder :SxProps<Theme> = {
    borderRight : `1px solid rgba(224, 224, 224, 1)`
}

export const tableCellStyle :SxProps<Theme> = {
    border : 'none'
}

export const tableBodyText :SxProps<Theme> = {
    // fontWeight : 600,
    fontSize : '14px',
}

export function stageContainer(index: number) {
    return {
        borderRadius: '50px',
        padding: '8px 20px',
        background: getLineChartColor(index + 3),
        color: '#ffffff',
    };
}