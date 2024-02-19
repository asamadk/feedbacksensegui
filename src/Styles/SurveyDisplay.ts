export const getSurveyDisplayContainerStyle = (position : string,isTemplate : boolean) => {
    return {
        position: position,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isTemplate === true ? '75%' : '80%',
        marginLeft : isTemplate === true ? '12%' : '',
    }
}

export const fsBadge = () => {
    return {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '199px'
    }
}