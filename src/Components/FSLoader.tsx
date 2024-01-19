import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

function FSLoader(props: any) {
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
              color: '#006dff',
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