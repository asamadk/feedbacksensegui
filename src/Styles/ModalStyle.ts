import { colorPalette } from "../Utils/Constants";

export const modalStyle = (bgColor: string) => {
    return {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: bgColor,
        boxShadow: 30,
        color: colorPalette.textPrimary,
        borderRadius: '5px',
        p: 4,
    }
};

export const verticalModalStyle = (bgColor: string) => {
    return {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: bgColor,
        boxShadow: 30,
        color: colorPalette.textPrimary,
        borderRadius: '5px',
        p: 4,
        width : '35%',
        maxHeight : 'calc(100vh - 120px)',
        overflow : 'scroll'
    }
};

export const modalStyleComponents = (bgColor: string) => {
    return {
        height: '100%',
        bgcolor: bgColor,
        boxShadow: 24,
        color: colorPalette.textPrimary,
        borderRadius: '5px',
        p: 4,
        display: 'flex'
    }
};

export const workflowLiveWarning = {
    backgroundColor: '#cc3300',
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '5px',
    marginTop: '5px',
    color : colorPalette.secondary
}

export const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between'
}

export const modalButtonContainerStyle = {
    textAlign: 'end',
    marginTop: '10px'
}

export const modalBodyContainerStyle = {
    marginTop: '30px',
    marginBottom: '10px',
    // maxHeight : '600px',
    maxHeight: 'calc(100vh - 220px)',
    overflowY: 'scroll',
    color : colorPalette.darkBackground
}

export const modalLogicStyle = {
    marginTop: '30px',
    marginBottom: '10px',
    maxHeight: 'calc(100vh - 230px)',
    overflowY: 'scroll'
}