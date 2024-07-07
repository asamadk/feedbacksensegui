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
import { getIconColorById } from '../Utils/FeedbackUtils';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UpdateIcon from '@mui/icons-material/Update';
import SegmentIcon from '@mui/icons-material/Segment';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import MoodIcon from '@mui/icons-material/Mood';

function DynamicComponentIcon(props : any) {
  return (
    <>
        {props.id === 1 && <PlayCircleFilledIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 2 && <ThumbUpIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 3 && <SquareIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 4 && <GridViewIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 5 && <CreateIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 6 && <InsertEmoticonIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 7 && <SubjectIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 8 && <AvTimerIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 9 && <ThumbsUpDownIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 10 && <AppsIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 11 && <CallIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 12 && <StarsIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 13 && <CalendarMonthIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 15 && <AddBoxIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 16 && <UpdateIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 17 && <SegmentIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 18 && <HourglassBottomIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 19 && <FormatListBulletedIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 20 && <NotificationsIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 21 && <AssignmentIndIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 22 && <EditAttributesIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 23 && <NoteAltIcon sx={{ color: getIconColorById(props?.id) }} />}
        {props.id === 24 && <MoodIcon sx={{ color: getIconColorById(props?.id) }} />}
    </>
  );
}

export default DynamicComponentIcon