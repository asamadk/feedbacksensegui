import React from 'react'
import SingleAnswerSelectionModal from '../FlowModals/SingleAnswerSelectionModal'
import WelcomModal from '../FlowModals/WelcomModal'

function DynamicComponentModal(props : any) {
  return (
    <>
        {props.compId === 1 && <WelcomModal header={'Welcome message'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 3 && <SingleAnswerSelectionModal type={'single'} header={'Single answer selection'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 4 && <SingleAnswerSelectionModal type={'multiple'} header={'Multiple answer selection'} save={props.save} open={props.open} close={props.close} />}
    </>
  )
}

export default DynamicComponentModal