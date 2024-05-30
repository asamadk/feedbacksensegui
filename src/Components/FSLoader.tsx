import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'

function FSLoader(props: {show : boolean}) {
  return (
    <>
      {props.show && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.show}
        >
          <CircularProgress
            size={34}
            sx={{
              color: colorPalette.primary,
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        </Backdrop>
      )}
    </>
  )
}

export default FSLoader