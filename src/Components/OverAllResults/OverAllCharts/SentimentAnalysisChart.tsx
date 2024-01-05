import { Box, Typography } from '@mui/material'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer,Tooltip } from 'recharts'
import FSTooltip from '../../FSTooltip';
import CustomTooltip from '../../CustomTooltip';

function SentimentAnalysisChart(props : any) {
console.log("🚀 ~ file: SentimentAnalysisChart.tsx:7 ~ SentimentAnalysisChart ~ props:", props)

    const COLORS = [
        '#08b502',
        '#006dff',
        '#db2b39',
    ];

    return (
        <>
            <Box width={'100%'} textAlign={'start'} padding={'20px'}>
                <Box display={'flex'} >
                    <Typography color={'#f1f1f1'} variant='h6' sx={{textDecoration : 'underline'}} >Sentiment Analysis</Typography>
                    <Box marginTop={'8px'} marginLeft={'2px'}>
                        <CustomTooltip
                            text='Unlock Emotional Insights with Sentiment Analysis: 
                            This tool evaluates the tone of responses, categorizing them into positive,
                            negative, or neutral sentiments, helping you understand how your audience truly feels about your topics'
                        />
                    </Box>
                </Box>
                <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
                    <ResponsiveContainer>
                        <PieChart>
                            <Legend />
                            <Tooltip
                                cursor={{ fill: 'none' }}
                                content={<FSTooltip percent={false} />}
                            />
                            <Pie
                                data={props?.data}
                                innerRadius={60}
                                outerRadius={90}
                                stroke='#808080'
                                fill="#808080"
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {props?.data?.map((entry : any, index : number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    )
}

export default SentimentAnalysisChart