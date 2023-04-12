import { CircularProgress } from '@mui/material'
import React from 'react'

function FSLoader(props : any) {
  return (
    <>
    {props.show && (
        <CircularProgress
        size={34}
        sx={{
          color: 'rgb(255, 165, 0)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-12px',
          marginLeft: '-12px',
        }}
        />)}
    </>
  )
}

export default FSLoader