import React from 'react'
import WelcomeChart from './OverAllCharts/WelcomeChart'
import SingleAnswerChart from './OverAllCharts/SingleAnswerChart'
import TextAnswerChart from './OverAllCharts/TextAnswerChart'
import SmileyScaleCharts from './OverAllCharts/SmileyScaleCharts'
import RatingScaleCharts from './OverAllCharts/RatingScaleCharts'
import NPSCharts from './OverAllCharts/NPSCharts'
import ContactFormCharts from './OverAllCharts/ContactFormCharts'
import DateCharts from './OverAllCharts/DateCharts'

type propsType = {
  id : number,
  data : any
}

function DynamicOverallCharts(props : propsType) {
  return (
    <>
      {props.id === 1 && <WelcomeChart id={props.id} data={props.data} />}
      {props.id === 3 && <SingleAnswerChart id={props.id} data={props.data}/>}
      {props.id === 4 && <SingleAnswerChart id={props.id} data={props.data}/>}
      {props.id === 5 && <TextAnswerChart id={props.id} data={props.data}/>}
      {props.id === 6 && <SmileyScaleCharts id={props.id} data={props.data}/>}
      {props.id === 7 && <RatingScaleCharts id={props.id} data={props.data}/>}
      {props.id === 8 && <NPSCharts id={props.id} data={props.data}/>}
      {props.id === 9 && <WelcomeChart id={props.id} data={props.data} />}
      {props.id === 10 && <WelcomeChart id={props.id} data={props.data} />}
      {props.id === 11 && <ContactFormCharts id={props.id} data={props.data}/>}
      {props.id === 12 && <WelcomeChart id={props.id} data={props.data}/>}
      {props.id === 13 && <DateCharts id={props.id} data={props.data}/>}
    </>
  )
}

export default DynamicOverallCharts