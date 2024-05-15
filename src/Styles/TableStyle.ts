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
    fontSize : '14px',
}

export function stageContainer(index: number) :SxProps<Theme>{
    return {
        borderRadius: '6px',
        padding: '2px 10px',
        background: getLineChartColor(index),
        color: '#ffffff',
        width : '85px',
        maxHeight : '20px',
        textAlign : 'center',
        textOverflow : 'ellipsis'
    };
}

export const getHealthScoreStyle = (count: number) => {
    const obj: any = {
      padding: '2px 10px',
      width: '50px',
      borderRadius: '6px',
      color: '#000000',
      margin: 'auto',
      fontWeight : '600'
    }
    if (count === 0) {
      obj.background = '#ffb3b3';
      obj.color = '#800000';
    } else if (count === 50) {
      obj.background = '#ffe4b3';
      obj.color = '#e69500';
    } else {
      obj.background = '#CBF0CB';
      obj.color = '#008000'
    }
    return obj;
  }