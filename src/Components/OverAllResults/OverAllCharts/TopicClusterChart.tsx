import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'
import FSTooltip from '../../FSTooltip';

function TopicClusterChart() {

  const data = [
    {
      name: 'Digital Data Utilization',
      children: [
        { name: 'Data Collection', size: 1 },
        { name: 'Insight Generation', size: 1 },
        { name: 'Actionable Measures', size: 1 },
      ],
    },
    {
      name: 'AI Revolution in Feedback Management',
      children: [
        { name: 'AI Integration', size: 1 },
        { name: 'Data Processing', size: 1 },
        { name: 'Analytical Capabilities', size: 1 },
        { name: 'Actionable Insights', size: 1 },
      ],
    },
    {
      name: 'Custom-Tailored Analysis with AI',
      children: [
        { name: 'Customized Approach', size: 1 },
        { name: 'Sentiment Analysis', size: 1 },
        { name: 'Personalized Feedback Understanding', size: 1 },
      ],
    },
    {
      name: 'Predictive Modeling',
      children: [
        { name: 'Future Trends Anticipation', size: 1 },
        { name: 'Proactive Adaptation', size: 1 },
      ],
    },
    {
      name: 'Insights into Action',
      children: [
        { name: 'Suggesting Actions', size: 1 },
        { name: 'Service Strategy Improvement', size: 1 },
        { name: 'Staff Training', size: 1 },
      ],
    },
    {
      name: 'Seamless Integration',
      children: [
        { name: 'Feedback System Integration', size: 1 },
        { name: 'Strategy Formulation', size: 1 },
        { name: 'Implementation Ease', size: 1 },
      ],
    },
    {
      name: 'Data Privacy',
      children: [
        { name: 'Privacy Norms Adherence', size: 1 },
        { name: 'Metadata Focus', size: 1 },
      ],
    },
    {
      name: 'Conclusion and Invitation',
      children: [
        { name: 'Customer Satisfaction Focus', size: 1 },
        { name: 'Marketplace Competitiveness', size: 1 },
      ]
    }
  ];

  const COLORS = [
    '#006dff', 
    '#9597E4', 
    '#8DC77B', 
    '#ed8128', 
    '#E2CF45', 
    '#b5392d'
  ];

  return (
    <>
      <Box textAlign={'start'} padding={'20px'} >
        <Typography color={'#f1f1f1'} variant='h6' marginBottom={'20px'} sx={{textDecoration : 'underline'}} >Topic Cluster</Typography>
        <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
          <ResponsiveContainer>
            <Treemap
              data={data}
              dataKey="size"
              stroke="#f1f1f1"
              fill="#1A7CFF"
              content={<CustomizedContent colors={COLORS} />}
            />
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  )
}

const CustomizedContent = ({ root, depth, x, y, width, height, index, colors, ...rest }: any) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
          stroke: '#212a2b',
        }}
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      />
      {(depth === 1 || isHovered) && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={depth === 1 ? 12 : 10}
          pointerEvents="none"
        >
          {rest.name}
        </text>
      )}
    </g>
  );
};

export default TopicClusterChart