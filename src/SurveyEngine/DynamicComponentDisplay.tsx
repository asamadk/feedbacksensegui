import React, { useEffect, useRef, useState } from 'react'
import PoweredBy from '../Components/PoweredBy';
import { getSurveyUserInformation, validateSurveyDisplay } from '../Utils/FeedbackUtils';
import Notification from '../Utils/Notification';
import ContactDisplay from './ContactDisplay';
import DateSelectorDisplay from './DateSelectorDisplay';
import NPSDisplay from './NPSDisplay';
import RatingScaleDisplay from './RatingScaleDisplay';
import SingleAnswerSelectionDisplay from './SingleAnswerSelectionDisplay'
import SmileyScaleDisplay from './SmileyScaleDisplay';
import TextAnswerDisplay from './TextAnswerDisplay'
import WelcomeDisplay from './WelcomeDisplay'
import axios from 'axios';
import { saveSurveyResponseDb } from '../Utils/Endpoints';
import { LIVE_SURVEY_USER_ID } from '../Utils/Constants';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

function DynamicComponentDisplay(props: any) {
    //props.surveyId if null that mean we are in edit mode else we are live
    const snackbarRef: any = useRef(null);
    const [surveyColors, setSurveyColors] = useState<any>();

    useEffect(() => {
        populateTheme();
    }, [props]);

    const populateTheme = (): void => {
        if (props.theme == null || props.theme?.length < 1) {
            const theme = {
                id: 1,
                header: 'Default',
                text: 'Default',
                color: ['#f1f1f1', '#D81159'],
                textColor: '#808089'
            };
            setSurveyColors(theme);
        } else if (typeof props.theme === 'string') {
            const customTheme = JSON.parse(props.theme);
            setSurveyColors(customTheme?.theme);
        } else {
            setSurveyColors(props.theme);
        }
    }

    const next = (data: any) => {
        if (props.surveyId == null) {
            return;
        }
        const isValidated = validateSurveyDisplay(data, props.compId);
        if (isValidated != null) {
            snackbarRef?.current?.show(isValidated, 'error');
            return;
        }
        saveSurveyResponse(data);
        props.next();
    }

    const saveSurveyResponse = (data: any): void => {
        try {
            const userDetails = getSurveyUserInformation();
            let tempResponse = {
                id: props.compId,
                data: data,
                compData: props.data,
            }
            axios.post(saveSurveyResponseDb(props.surveyId), {
                data: tempResponse,
                info: userDetails,
                anUserId: localStorage.getItem(`${props.surveyId}_${LIVE_SURVEY_USER_ID}`)
            }, { withCredentials: true });
        } catch (error: any) {
            console.warn("🚀 ~ file: IndividualResponse.tsx:81 ~ fetchSurveyResponseList ~ error:", error)
        }
    }

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
        typography: {
            fontFamily: 'Apercu Pro, sans-serif'
        }
    });

    return (
        <>
            <ThemeProvider theme={lightTheme} >
                {props.compId === 1 && <WelcomeDisplay
                    data={props.data}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 3 && <SingleAnswerSelectionDisplay
                    data={props.data}
                    type={'single'}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 4 && <SingleAnswerSelectionDisplay
                    type={'multiple'}
                    data={props.data}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 5 && <TextAnswerDisplay
                    data={props.data}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 6 && <SmileyScaleDisplay
                    data={props.data}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 7 && <RatingScaleDisplay
                    data={props.data}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 8 && <NPSDisplay
                    data={props.data}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 11 && <ContactDisplay
                    data={props.data}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}
                {props.compId === 13 && <DateSelectorDisplay
                    data={props.data}
                    theme={surveyColors}
                    surveyId={props.surveyId}
                    next={next}
                />}

                <PoweredBy />
                <Notification ref={snackbarRef} />
            </ThemeProvider>
        </>
    )
}

export default DynamicComponentDisplay