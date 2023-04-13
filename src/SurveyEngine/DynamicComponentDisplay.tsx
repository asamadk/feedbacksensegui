import React, { useEffect, useState } from 'react'
import PoweredBy from '../Components/PoweredBy';
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
        populateTheme();
    },[]);

    const populateTheme = () :void => {
        if(props.theme == null || props.theme?.length < 1){
            const theme = {
                id : 1,
                header : 'Default',
                text : 'Default',
                color : ['#f1f1f1','#D81159'],
                textColor : '#808089'
            };
            setSurveyColors(theme);
        }else{
            const customeTheme = JSON.parse(props.theme);
            setSurveyColors(customeTheme?.theme);
        }
    }

    return (
        <>
            {props.compId === 1 && <WelcomeDisplay 
                data={props.data} 
                theme={surveyColors}
            />}
            {props.compId === 3 && <SingleAnswerSelectionDisplay 
                data={props.data} 
                type={'single'}
                theme={surveyColors}
            />}
            {props.compId === 4 && <SingleAnswerSelectionDisplay 
                type={'multiple'} 
                data={props.data} 
                theme={surveyColors}
            />}
            {props.compId === 5 && <TextAnswerDisplay 
                data={props.data} 
                theme={surveyColors}
            />}
            {props.compId === 6 && <SmileyScaleDisplay 
                data={props.data} 
            />}
            {props.compId === 7 && <RatingScaleDisplay 
                data={props.data} 
            />}
            {props.compId === 8 && <NPSDisplay 
                data={props.data} 
            />}
            {props.compId === 11 && <ContactDisplay 
                data={props.data} 
                theme={surveyColors}
            />}
            {props.compId === 13 && <DateSelectorDisplay 
                data={props.data}
                theme={surveyColors}
            />}

            <PoweredBy/>
        </>
    )
}

export default DynamicComponentDisplay