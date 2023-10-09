export const settingLayoutStyle = {
    height: 'calc(100vh - 158px)',
    padding: '50px 70px',
    overflowY : 'scroll'
}

export const settingsHeaderTextStyle = {
    fontSize: '26px',
    color: '#f1f1f1',
    textAlighn: 'start'
}

export const globalSettingSubContainers = (bgColor : string) => {
    return {
        borderRadius: '5px',
        backgroundColor: bgColor,
        border: '1px #454545 solid',
        padding: '20px',
        marginTop: '20px'
    }
}

export const localSurveyNavbar = {
    display : 'flex',
    justifyContent : 'space-between',
    borderBottom: '1px #454545 solid',
    paddingBottom: '10px',
    textAlign: 'end',
    paddingRight: '10px'
}