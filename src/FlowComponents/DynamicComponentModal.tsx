import React from 'react'
import ContactFormModal from '../FlowModals/ContactFormModal'
import DateSelectorModal from '../FlowModals/DateSelectorModal'
import NPSModal from '../FlowModals/NPSModal'
import RatingScaleModal from '../FlowModals/RatingScaleModal'
import SingleAnswerSelectionModal from '../FlowModals/SingleAnswerSelectionModal'
import SmileyScaleModal from '../FlowModals/SmileyScaleModal'
import TextAnswerModal from '../FlowModals/TextAnswerModal'
import WelcomModal from '../FlowModals/WelcomModal'

function DynamicComponentModal(props : any) {
  return (
    <>
        {props.compId === 1 && <WelcomModal header={'Welcome message'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 3 && <SingleAnswerSelectionModal type={'single'} header={'Single answer selection'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 4 && <SingleAnswerSelectionModal type={'multiple'} header={'Multiple answer selection'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 5 && <TextAnswerModal header={'Text answer'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 6 && <SmileyScaleModal header={'Smiley scale'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 7 && <RatingScaleModal header={'Rating scale'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 8 && <NPSModal header={'NPS'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 11 && <ContactFormModal header={'Contact form'} save={props.save} open={props.open} close={props.close} />}
        {props.compId === 13 && <DateSelectorModal header={'Date'} save={props.save} open={props.open} close={props.close} />}
    </>
  )
}

export default DynamicComponentModal