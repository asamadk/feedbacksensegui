import React from 'react'
import SurveyListPage from '../Components/SurveyListPage';

function MainBody() {
    return (
        <div style={{
            backgroundColor: '#1E1E1E',
            height : 'calc(100vh - 58px)'
        }} >
            <SurveyListPage />
        </div>
    )
}

export default MainBody