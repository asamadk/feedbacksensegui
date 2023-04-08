import React, { useEffect, useState } from 'react'
import { getCurrentSurveyDesign } from '../Utils/FeedbackUtils';
import SingleAnswerSelectionDisplay from './SingleAnswerSelectionDisplay'
import TextAnswerDisplay from './TextAnswerDisplay'
import WelcomeDisplay from './WelcomeDisplay'

function DynamicComponentDisplay(props: any) {

    const [surveyColors , setSurveyColors] = useState<any>();

    useEffect(() => {
        populateSurveyDesign();
    },[]);

    const populateSurveyDesign = () => {
        const surveyColorsObj = getCurrentSurveyDesign();
        setSurveyColors(surveyColorsObj);
    }

    return (
        <>
            {props.compId === 1 && <WelcomeDisplay data={props.data} />}
            {props.compId === 3 && <SingleAnswerSelectionDisplay data={props.data} type={'single'}/>}
            {props.compId === 4 && <SingleAnswerSelectionDisplay type={'multiple'} data={props.data} />}
            {props.compId === 5 && <TextAnswerDisplay data={props.data} />}
        </>
    )
}

export default DynamicComponentDisplay