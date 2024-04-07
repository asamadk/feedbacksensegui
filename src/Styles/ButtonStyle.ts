import { colorPalette } from "../Utils/Constants"

export const backgroundColorMode = '#ffffff'

export const containedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: colorPalette.darkBackground
    },
    // backgroundColor: '#D81159',
    backgroundColor: colorPalette.primary,
    width: '100%',
    marginTop: '10px',
    color: '#ffffff',
    fontWeight: 500,
    textTransform: 'none'
}

export const textButton = {
    width: '100%',
    marginTop: '10px',
    color: colorPalette.primary,
    fontWeight: 500,
    textTransform: 'none',
}

export const outlinedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: backgroundColorMode,
        border: `1px ${colorPalette.primary} solid`,
    },
    backgroundColor: backgroundColorMode,
    color: colorPalette.primary,
    border: `1px ${colorPalette.secondary} solid`,
    width: '100%',
    marginTop: '10px',
    textTransform: 'none'
}

export const getOutlinedButtonBG = (bgColor : string) => {
    return {
        "&.MuiButtonBase-root:hover": {
            bgcolor: bgColor,
            border: `1px ${colorPalette.secondary} solid`,
        },
        backgroundColor: bgColor,
        color: colorPalette.primary,
        border: `1px ${colorPalette.primary} solid`,
        width: '100%',
        marginTop: '10px',
        textTransform: 'none'
    }
}

export const outlinedButtonNoBorder = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "transparent",
        color: colorPalette.primary,
        border: `1px ${colorPalette.primary} solid`
    },
    backgroundColor: backgroundColorMode,
    color: '#ffffff',
    border: `1px ${backgroundColorMode} solid`,
    textTransform: 'none'
}

export const simpleOutlinedButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        border: `1px ${colorPalette.primary} solid`,
    },
    backgroundColor: backgroundColorMode,
    color: colorPalette.primary,
    border: `1px ${colorPalette.primary} solid`,
    textTransform: 'none',
    width: '100%'
}

export const outlinedBlackButton = {
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#121212",
        border: `1px ${colorPalette.primary} solid`,
    },
    backgroundColor: backgroundColorMode,
    color: backgroundColorMode,
    borderRadius: '5px',
    border: '1px #454545 solid',
    width: '100%',
    marginTop: '10px',
    textTransform: 'none'
}

export const transparentButton = {
    textTransform: 'none',
    width: '100%',
    display: 'flex',
    justifyContent: 'start',
    marginBottom: '10px',
    color: colorPalette.primary
}

export const transparentBlueTextButton = {
    textTransform: 'none',
    width: '100%',
    display: 'flex',
    justifyContent: 'start',
    marginBottom: '10px',
    color: colorPalette.primary
}