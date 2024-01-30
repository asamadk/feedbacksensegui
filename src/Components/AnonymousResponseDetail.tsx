import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon'
import { getEmojiFromId, getIconColorById } from '../Utils/FeedbackUtils'
import { useSelector } from 'react-redux'
import { colorPalette } from '../Utils/Constants'

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
        // color: colorPalette.darkBackground,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }
}

const questionStyle = {
    marginLeft: '20px',
    color: colorPalette.darkBackground,
    fontWeight : '900'
}

function DynamicComponentSingleResponse({ id, data }: any) {
    
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
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
                <Box sx={answerContainer(colorPalette.secondary)} >
                    <Typography>{new Date(data?.data?.value)?.toLocaleDateString()}</Typography>
                </Box>
            </>}
        </Box>
    )
}