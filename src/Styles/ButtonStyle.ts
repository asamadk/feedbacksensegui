export const backgroundColorMode = '#081213'

export const containedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#004cb3"
    },
    // backgroundColor: '#D81159',
    backgroundColor : '#006DFF',
    width : '100%',
    marginTop: '10px',
    color : '#ffffff',
    fontWeight : 500,
    textTransform : 'none'
}

export const textButton = {
    width : '100%',
    marginTop: '10px',
    color : '#006DFF',
    fontWeight : 500,
    textTransform : 'none',
}

export const outlinedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: backgroundColorMode,
        border : '1px #004cb3 solid',
    },
    backgroundColor: backgroundColorMode,
    color : '#006DFF',
    border : '1px #006DFF solid',
    width : '100%',
    marginTop: '10px',
    textTransform : 'none'
}

export const outlinedButtonNoBorder = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "transparent",
        color : '#006dff',
        border : '1px #006dff solid'
    },
    backgroundColor: backgroundColorMode,
    color : '#ffffff',
    border : `1px ${backgroundColorMode} solid`,
    textTransform : 'none'
}

export const simpleOutlinedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        border : '1px #006DFF solid',
    },
    backgroundColor: backgroundColorMode,
    // color : '#D81159',
    color : '#006DFF',
    border : '1px #006DFF solid',
    textTransform : 'none',
    width : '100%'
}

export const outlinedBlackButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        border : '1px #006DFF solid',
    },
    backgroundColor: backgroundColorMode,
    color : backgroundColorMode,
    borderRadius : '5px',
    border : '1px #454545 solid',
    width : '100%',
    marginTop: '10px',
    textTransform : 'none'
}

export const transparentButton = { 
    textTransform: 'none', 
    width: '100%', 
    display: 'flex', 
    justifyContent: 'start', 
    marginBottom: '10px', 
    color: 'white' 
}

export const transparentBlueTextButton = { 
    textTransform: 'none', 
    width: '100%', 
    display: 'flex', 
    justifyContent: 'start', 
    marginBottom: '10px', 
    color: '#006dff' 
}