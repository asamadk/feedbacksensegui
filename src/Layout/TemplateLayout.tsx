import { Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import TemplateLeftPanel from '../Components/TemplateComponents/TemplateLeftPanel';
import TemplateRightPanel from '../Components/TemplateComponents/TemplateRightPanel';
import Notification from '../Utils/Notification';
import { ALL_TEMPLATE_KEY, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import FSLoader from '../Components/FSLoader';
import { getTemplatesAPI } from '../Utils/Endpoints';
import axios from 'axios';

function TemplateLayout() {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [categoryData, setCategoryData] = useState<Map<string, Set<string>>>(new Map<string, Set<string>>());
    const [templates, setTemplates] = useState<any[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [templateOptions, setTemplateOptions] = useState<{ label: string, value: string }[]>([]);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
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
            setTemplates(resData);
            setFilteredTemplates(resData);
            setSelectedCategory(ALL_TEMPLATE_KEY);
            setSelectedSubCategory('');
            populateTemplatesStructure(resData);
            populateTemplateOptions(resData);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
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
            setFilteredTemplates(templates);
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
        <Box height={'calc(100vh - 58px)'} display={'flex'} padding={'0px'}>
            <Box width={'25%'} >
                <TemplateLeftPanel
                    data={categoryData}
                    filter={handleFilterTemplates}
                    templateOptions={templateOptions}
                    templates={templates}
                />
            </Box>
            <Box width={'75%'} >
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