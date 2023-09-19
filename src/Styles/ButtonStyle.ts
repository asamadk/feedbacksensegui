export const containedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#004cb3"
    },
    // backgroundColor: '#D81159',
    backgroundColor : '#006DFF',
    width : '100%',
    marginTop: '10px',
    color : '#ffffff',
    // color : '#1E1E1E',
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
        bgcolor: "#1E1E1E",
        border : '1px #004cb3 solid',
    },
    backgroundColor: '#1E1E1E',
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
    backgroundColor: '#1E1E1E',
    color : '#ffffff',
    border : '1px #1E1E1E solid',
    textTransform : 'none'
}

export const simpleOutlinedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        // border : '1px #D81159 solid',
        border : '1px #006DFF solid',
    },
    backgroundColor: '#1E1E1E',
    // color : '#D81159',
    color : '#006DFF',
    border : '1px #006DFF solid',
    textTransform : 'none',
    width : '100%'
}

export const outlinedBlackButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        // border : '1px #D81159 solid',
        border : '1px #006DFF solid',
    },
    backgroundColor: '#1E1E1E',
    // color : '#f1f1f1',
    color : '#1E1E1E',
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