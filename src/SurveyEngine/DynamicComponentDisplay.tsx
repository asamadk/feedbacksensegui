import React, { useEffect, useState } from 'react'
import PoweredBy from '../Components/PoweredBy';
import { getCurrentSurveyDesign } from '../Utils/FeedbackUtils';
import ContactDisplay from './ContactDisplay';
import DateSelectorDisplay from './DateSelectorDisplay';
import NPSDisplay from './NPSDisplay';
import RatingScaleDisplay from './RatingScaleDisplay';
import SingleAnswerSelectionDisplay from './SingleAnswerSelectionDisplay'
import SmileyScaleDisplay from './SmileyScaleDisplay';
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
            {props.compId === 6 && <SmileyScaleDisplay data={props.data} />}
            {props.compId === 7 && <RatingScaleDisplay data={props.data} />}
            {props.compId === 8 && <NPSDisplay data={props.data} />}
            {props.compId === 11 && <ContactDisplay data={props.data} />}
            {props.compId === 13 && <DateSelectorDisplay data={props.data} />}
            <PoweredBy/>
        </>
    )
}

export default DynamicComponentDisplay