import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon'
import { getEmojiFromId, getIconColorById } from '../Utils/FeedbackUtils'
import { useSelector } from 'react-redux'

type propsType = {
    data: any
}

const containerStyle = {
    padding: '10px',
    margin: '10px',
    textAlign: 'start',
    overflowY: 'scroll'
}

function AnonymousResponseDetail(props: propsType) {

    useEffect(() => {
        processResponse(props.data);
    }, [props]);

    const [responseList, setResponseList] = useState<any>([]);

    const processResponse = (selectedResponse: any) => {
        if (selectedResponse == null || selectedResponse?.response == null || selectedResponse?.response?.length < 1) {
            return;
        }
        const responseList = JSON.parse(selectedResponse?.response);
        setResponseList(responseList);
    }

    return (
        <Box >
            {responseList?.map((res: any) => {
                return (
                    <Box sx={containerStyle} key={res.id} >
                        <DynamicComponentSingleResponse data={res} id={res.id} />
                    </Box>
                )
            })}

        </Box>
    )
}

export default AnonymousResponseDetail

const answerContainer = (bgColor : string) => {
    return {
        padding: '10px',
        margin: '10px',
        textAlign: 'start',
        cursor: 'pointer',
        borderRadius: '6px',
        backgroundColor: bgColor,
        color: '#ffffff'
    }
}

const questionStyle = {
    marginLeft: '20px',
    color: '#ffffff',
    fontWeight : '900'
}

function DynamicComponentSingleResponse({ id, data }: any) {
    
    const defaultColor = useSelector((state: any) => state.colorReducer);

    return (
        <Box >
            {id === 1 && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.welcomeText}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{`Action performed : ${data?.data?.click}`}</Typography>
                </Box>
            </>}
            {(id === 3) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{`${data?.data?.selectedVal}`}</Typography>
                </Box>
            </>}
            {(id === 4) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    {data?.data?.selectedVal?.map((val: string) => {
                        return (<Box>
                            <Typography>{val}</Typography>
                        </Box>)
                    })}
                </Box>
            </>}
            {(id === 5) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{`${data?.data?.answer}`}</Typography>
                </Box>
            </>}
            {(id === 6) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{getEmojiFromId(data?.data?.emojiId)}</Typography>
                </Box>
            </>}
            {(id === 7) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{`${data?.data?.value}`}</Typography>
                </Box>
            </>}
            {(id === 8) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{`${data?.data?.value}`}</Typography>
                </Box>
            </>}
            {(id === 11) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    {data?.compData?.answerList?.map((val: string) => {
                        return (<Box>
                            <Typography>{`${val} : ${data.data[val]}`}</Typography>
                        </Box>)
                    })}
                </Box>
            </>}
            {(id === 13) && <>
                <Box display={'flex'} >
                    <DynamicComponentIcon
                        id={id}
                        bgColor={getIconColorById(id)}
                    />
                    <Box sx={questionStyle} >
                        <Typography>{data?.compData?.question}</Typography>
                    </Box>
                </Box>
                <Box sx={answerContainer(defaultColor?.primaryColor)} >
                    <Typography>Answer</Typography>
                    <Divider sx={{ margin: '5px', background: '#454545' }} />
                    <Typography>{new Date(data?.data?.value)?.toLocaleDateString()}</Typography>
                </Box>
            </>}
        </Box>
    )
}