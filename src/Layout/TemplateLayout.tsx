import { Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import TemplateLeftPanel from '../Components/TemplateComponents/TemplateLeftPanel';
import TemplateRightPanel from '../Components/TemplateComponents/TemplateRightPanel';
import Notification from '../Utils/Notification';
import { ALL_TEMPLATE_KEY, USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import FSLoader from '../Components/FSLoader';
import { getTemplatesAPI } from '../Utils/Endpoints';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setTemplatesRedux } from '../Redux/Reducers/templateReducer';

function TemplateLayout() {

    const snackbarRef: any = useRef(null);
    const dispatch = useDispatch();

    const [loading, setLoading] = React.useState(false);
    const [categoryData, setCategoryData] = useState<Map<string, Set<string>>>(new Map<string, Set<string>>());
    const [templates, setTemplates] = useState<any[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [templateOptions, setTemplateOptions] = useState<{ label: string, value: string }[]>([]);
    const templateState = useSelector((state: any) => state.templates);

    let init = false;

    useEffect(() => {
        if(init === false){
            fetchTemplates();
            init = true;
        }
    }, []);

    const fetchTemplates = async () => {
        try {
            if(templateState == null || templateState.length < 1){
                setLoading(true);
                const res = await axios.get(getTemplatesAPI(), { withCredentials: true });
                setLoading(false);
                if (res?.data?.statusCode !== 200) {
                    snackbarRef?.current?.show(res?.data?.message, 'error');
                    return;
                }
                let resData: any = res?.data?.data;
                if (resData == null) {
                    return;
                }
                dispatch(setTemplatesRedux(resData));
                populateTemplateData(resData);
            }else{
                populateTemplateData(templateState);
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const populateTemplateData = (templates: any[]) => {
        setTemplates(templates);
        populateUniqueSurveys(templates);
        setSelectedCategory(ALL_TEMPLATE_KEY);
        setSelectedSubCategory('');
        populateTemplatesStructure(templates);
        populateTemplateOptions(templates);
    }

    const populateTemplatesStructure = (templates: any[]) => {
        const tempCategoryData = new Map<string, Set<string>>();
        tempCategoryData.set(ALL_TEMPLATE_KEY, new Set<string>());
        templates.forEach((template) => {
            let subCategories = tempCategoryData.get(template.category);
            if (subCategories == null) {
                subCategories = new Set<string>();
            }
            subCategories.add(template.subCategory);
            tempCategoryData.set(template.category, subCategories);
        });
        setCategoryData(tempCategoryData);
    }

    const handleFilterTemplates = (category: string, subCategory: string) => {
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);
        if (category === ALL_TEMPLATE_KEY) {
            populateUniqueSurveys(templates);
            return;
        }
        const tempTemplates: any[] = JSON.parse(JSON.stringify(templates));
        const filteredData: any = [];
        tempTemplates.forEach(template => {
            if (template.category === category && template.subCategory === subCategory) {
                filteredData.push(template);
            }
        });
        setFilteredTemplates(filteredData);
    }

    const populateUniqueSurveys = (templateList : any[]) => {
        const allTemplatesList: any[] = [];
        const templateNames = new Set<string>();
        templateList.forEach(template => {
            if(!templateNames.has(template.name)){
                allTemplatesList.push(template);
                templateNames.add(template.name);
            }
        });
        setFilteredTemplates(allTemplatesList);
    }

    const populateTemplateOptions = (templates: any[]) => {
        const options: { label: string, value: string }[] = [];
        const keySet = new Set<string>();
        templates.forEach((template) => {
            if (keySet.has(template.name)) { return; }
            keySet.add(template.name);
            options.push({
                label: template.name,
                value: template.id
            })
        });
        setTemplateOptions(options);
    }

    return (
        <Box height={'100vh'} display={'flex'} padding={'0px'}>
            <Box width={'20%'} >
                <TemplateLeftPanel
                    data={categoryData}
                    filter={handleFilterTemplates}
                    templateOptions={templateOptions}
                    templates={templates}
                />
            </Box>
            <Box width={'80%'} sx={{background : colorPalette.textSecondary}} >
                <TemplateRightPanel
                    header={`${selectedCategory} ${selectedCategory === ALL_TEMPLATE_KEY ? '' : '/'} ${selectedSubCategory}`}
                    templates={filteredTemplates}
                />
            </Box>
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
        </Box>
    )
}

export default TemplateLayout