import React, { useEffect, useRef, useState } from 'react'
import { validateSurveyDisplay } from '../Utils/FeedbackUtils';
import Notification from '../Utils/Notification';
import ContactDisplay from './ContactDisplay';
import DateSelectorDisplay from './DateSelectorDisplay';
import NPSDisplay from './NPSDisplay';
import RatingScaleDisplay from './RatingScaleDisplay';
import SingleAnswerSelectionDisplay from './SingleAnswerSelectionDisplay'
import SmileyScaleDisplay from './SmileyScaleDisplay';
import TextAnswerDisplay from './TextAnswerDisplay'
import WelcomeDisplay from './WelcomeDisplay'
import { TEMPLATE_KEY, colorPalette } from '../Utils/Constants';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

import '../Styles/CSS/Backgrounds.css'
import CSATDisplay from './CSATDisplay';

function DynamicComponentDisplay(props: any) {

    //props.surveyId if null that mean we are in edit mode else we are live
    const snackbarRef: any = useRef(null);
    const [surveyColors, setSurveyColors] = useState<any>();
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        populateTheme();
        setShowComponent(true); // Show the component when it mounts
    }, [props]);

    const populateTheme = (): void => {
        if (props.theme == null || props.theme?.length < 1) {
            const theme = {
                id: 1,
                header: 'Default',
                text: 'Default',
                color: ['#f1f1f1', colorPalette.primary],
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
        if (props.surveyId !== TEMPLATE_KEY && props.mode !== 'test') {
            const isValidated = validateSurveyDisplay(data, props.compId);
            if (isValidated != null) {
                snackbarRef?.current?.show(isValidated, 'error');
                return;
            }
        }
        props.next(data);
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
                        key={props.uiId}
                        data={props.data}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}
                    {props.compId === 3 && <SingleAnswerSelectionDisplay
                        key={props.uiId}
                        data={props.data}
                        type={'single'}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}
                    {props.compId === 4 && <SingleAnswerSelectionDisplay
                        key={props.uiId}
                        type={'multiple'}
                        data={props.data}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}
                    {props.compId === 5 && <TextAnswerDisplay
                        key={props.uiId}
                        data={props.data}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}
                    {props.compId === 6 && <SmileyScaleDisplay
                        key={props.uiId}
                        data={props.data}
                        surveyId={props.surveyId}
                        theme={surveyColors}
                        next={next}
                    />}
                    {props.compId === 7 && <RatingScaleDisplay
                        key={props.uiId}
                        data={props.data}
                        surveyId={props.surveyId}
                        next={next}
                        theme={surveyColors}
                    />}
                    {props.compId === 8 && <NPSDisplay
                        key={props.uiId}
                        data={props.data}
                        surveyId={props.surveyId}
                        next={next}
                        theme={surveyColors}
                    />}
                    {props.compId === 9 && <CSATDisplay
                        key={props.uiId}
                        data={props.data}
                        surveyId={props.surveyId}
                        next={next}
                        theme={surveyColors}
                    />}
                    {props.compId === 11 && <ContactDisplay
                        key={props.uiId}
                        data={props.data}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}
                    {props.compId === 13 && <DateSelectorDisplay
                        key={props.uiId}
                        data={props.data}
                        theme={surveyColors}
                        surveyId={props.surveyId}
                        next={next}
                    />}

                <Notification ref={snackbarRef} />
            </ThemeProvider>
        </>
    )
}

export default DynamicComponentDisplay