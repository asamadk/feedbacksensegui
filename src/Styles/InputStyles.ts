import { colorPalette } from "../Utils/Constants";

export const muiSelectStyle = {
    color: colorPalette.textPrimary,
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: colorPalette.textPrimary,
        border : `1px ${colorPalette.primary} solid`,
    },
    '& .MuiSvgIcon-root': {
        color: colorPalette.primary
    }
}

export const textFieldStyle = {
    '& label.Mui-focused': {
        color: colorPalette.primary,
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: colorPalette.primary,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: colorPalette.fsGray,
        },
        '&:hover fieldset': {
            borderColor: colorPalette.primary,
        },
        '&.Mui-focused fieldset': {
            borderColor: colorPalette.primary,
        },
    },
    color: 'white'
}