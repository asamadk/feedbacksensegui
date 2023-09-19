import { Box } from '@mui/material';
import SurveyDisplays from '../../SurveyEngine/Core/SurveyDisplays';

function TemplateDetailRightPanel({
  template
}: { template: any }) {

  return (
    <Box sx={{position : 'relative'}} >
      <SurveyDisplays source='template' mode='test' templateId={template?.id} />
    </Box>
  )
}

export default TemplateDetailRightPanel