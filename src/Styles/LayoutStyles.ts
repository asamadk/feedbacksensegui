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