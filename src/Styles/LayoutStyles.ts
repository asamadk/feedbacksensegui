import { colorPalette } from "../Utils/Constants"

export const settingLayoutStyle = {
    height: 'calc(100vh - 158px)',
    padding: '50px 70px',
    overflowY: 'scroll'
}

export const settingsHeaderTextStyle = {
    fontSize: '26px',
    color: colorPalette.darkBackground,
    textAlighn: 'start'
}

export const globalSettingSubContainers = (bgColor: string) => {
    return {
        borderRadius: '5px',
        backgroundColor: bgColor,
        padding: '20px',
        // marginTop: '20px',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }
}

export const localSurveyNavbar = {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `0.5px ${colorPalette.fsGray} solid`,
    background : colorPalette.textSecondary,
    paddingBottom: '10px',
    textAlign: 'end',
    paddingRight: '10px'
}

export const taskStatusStyle = (status: 'Open' | 'InProgress' | 'Completed' | 'Cancelled') => {

    let bgColor = colorPalette.secondary;
    let color = colorPalette.primary;
    if (status === 'Completed') {
      bgColor = '#CBF0CB';
      color = '#008000';
    } else if (status === 'Cancelled') {
      bgColor = '#ffe6e6';
      color = '#ff0000';
    }
  
    return {
      background: bgColor,
      color: color,
      padding: '5px',
      borderRadius: '6px',
      fontWeight: '600',
      width: 'fit-content',
      cursor: 'pointer'
    }
  }

 export const listStyleBlock = {
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    border: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '40px',
    background: colorPalette.background,
    borderRadius: '6px',
    marginTop : '20px'
}