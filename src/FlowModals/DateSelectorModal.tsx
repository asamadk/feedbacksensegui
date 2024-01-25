import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, Select, Slider, styled, TextField, Typography } from '@mui/material';
import { getColorsFromTheme, getCompConfigFromUiId, modalTabList } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import CustomTabSet from '../Components/CustomTabSet';
import CreateLogic from '../Components/Logic/CreateLogic';
import { logicType, userRoleType } from '../Utils/types';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { useSelector } from 'react-redux';
import { colorPalette, componentName } from '../Utils/Constants';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { textFieldStyle } from '../Styles/InputStyles';

const CssTextField = styled(TextField)(textFieldStyle);

function DateSelectorModal(props: any) {

  const createLogicRef = useRef<any>(null); // Create a ref for the child component
  const defaultColor = useSelector((state: any) => state.colorReducer);
  const userRole: userRoleType = useSelector((state: any) => state.userRole);

  useEffect(() => {
    populateCompConfig();
  }, [props.open]);

  const [background, setBackground] = useState<any>();
  const [question, setQuestion] = useState('');
  const [value, setValue] = React.useState(0);
  const [logicData, setLogicData] = useState<logicType[]>([]);

  const populateCompConfig = () => {
    const compConfig = getCompConfigFromUiId(props);
    setQuestion(compConfig?.question || '');
    setLogicData(compConfig?.logic || []);
    if (props.theme != null) {
      const currentTheme = JSON.parse(props.theme);
      setBackground(currentTheme.background);
    }
  }

  const handleSave = () => {
    const logicData = createLogicRef?.current?.fetchData(); // Call fetchData() in child
    let obj = {
      question: question,
      logic: logicData
    }

    if (verifyComponent() === false) {
      return;
    }

    props.save(JSON.stringify(obj));
  }

  const verifyComponent = (): Boolean => {
    return true;
  }

  const handleTabChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyles.modalStyleComponents(colorPalette.textSecondary)}>
          <Box width={'40%'} marginRight={10} >
            <Box sx={ModalStyles.modalHeaderStyle} >
              <Typography id="modal-modal-title" variant="h5" component="h2">
                {props.header}
              </Typography>
              <IconButton sx={{ color: colorPalette.darkBackground }} >
                <CloseIcon onClick={props.close} />
              </IconButton>
            </Box>
            <ModalSnippets text={'To make changes, please unpublish the workflow'} published={props.isPublished} />
            <ModalSnippets
              text={'Guest cannot edit the surveys'}
              published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
            />
            <CustomTabSet
              tabsetList={modalTabList}
              change={(value: number) => handleTabChange(value)}
              index={value}
            ></CustomTabSet>
            {
              value === 0 &&
              <Box sx={ModalStyles.modalBodyContainerStyle} >
                <CssTextField
                  sx={{ input: { color: 'white' }, maxHeight: 'calc(100vh - 250px)' }}
                  id="outlined-basic"
                  placeholder='Enter your question here'
                  variant="outlined"
                  size={'small'}
                  value={question}
                  multiline
                  style={{ width: '100%' }}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </Box>
            }
            <CreateLogic
              type={props.compId}
              open={value === 1}
              values={[]}
              data={logicData}
              ref={createLogicRef}
            />
            <Box sx={ModalStyles.modalButtonContainerStyle} >
              <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
              <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
            </Box>
          </Box>
          <Box className={background?.value} sx={{ backgroundColor: background?.value, width: '55%' }} >
            <DynamicComponentDisplay
              theme={props.theme}
              data={{
                question: question,
              }}
              compId={props.compId}
            />
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default DateSelectorModal