import React from 'react'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SquareIcon from '@mui/icons-material/Square';
import GridViewIcon from '@mui/icons-material/GridView';
import CreateIcon from '@mui/icons-material/Create';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SubjectIcon from '@mui/icons-material/Subject';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import AppsIcon from '@mui/icons-material/Apps';
import CallIcon from '@mui/icons-material/Call';
import StarsIcon from '@mui/icons-material/Stars';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function DynamicComponentIcon(props : any) {
  return (
    <>
        {props.id === 1 && <PlayCircleFilledIcon sx={{ color: props.bgColor }} />}
        {props.id === 2 && <ThumbUpIcon sx={{ color: props.bgColor }} />}
        {props.id === 3 && <SquareIcon sx={{ color: props.bgColor }} />}
        {props.id === 4 && <GridViewIcon sx={{ color: props.bgColor }} />}
        {props.id === 5 && <CreateIcon sx={{ color: props.bgColor }} />}
        {props.id === 6 && <InsertEmoticonIcon sx={{ color: props.bgColor }} />}
        {props.id === 7 && <SubjectIcon sx={{ color: props.bgColor }} />}
        {props.id === 8 && <AvTimerIcon sx={{ color: props.bgColor }} />}
        {props.id === 9 && <ArrowDropDownCircleIcon sx={{ color: props.bgColor }} />}
        {props.id === 10 && <AppsIcon sx={{ color: props.bgColor }} />}
        {props.id === 11 && <CallIcon sx={{ color: props.bgColor }} />}
        {props.id === 12 && <StarsIcon sx={{ color: props.bgColor }} />}
        {props.id === 13 && <CalendarMonthIcon sx={{ color: props.bgColor }} />}
    </>
  );
}

export default DynamicComponentIcon