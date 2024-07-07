import React, { useEffect } from 'react'
import ContactFormModal from '../FlowModals/ContactFormModal'
import DateSelectorModal from '../FlowModals/DateSelectorModal'
import NPSModal from '../FlowModals/NPSModal'
import RatingScaleModal from '../FlowModals/RatingScaleModal'
import SingleAnswerSelectionModal from '../FlowModals/SingleAnswerSelectionModal'
import SmileyScaleModal from '../FlowModals/SmileyScaleModal'
import TextAnswerModal from '../FlowModals/TextAnswerModal'
import WelcomModal from '../FlowModals/WelcomModal'
import CSATModal from '../FlowModals/CSATModal'
import InsertRecordModal from '../FlowModals/InsertRecordModal'
import WaitForModal from '../FlowModals/WaitForModal'
import SegmentModal from '../FlowModals/SegmentModal'
import NewTaskModal from '../FlowModals/NewTaskModal'
import SendEmailModal from '../FlowModals/SendEmailModal'
import AssignOwnerModal from '../FlowModals/AssignOwner'
import UpdateRecordModal from '../FlowModals/UpdateRecord'
import SendSurveyModal from '../FlowModals/SendSurveyModal'

function DynamicComponentModal(props: any) {
  return (
    <>
      {props.compId === 1 && <WelcomModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Welcome message'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 3 && <SingleAnswerSelectionModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        type={'single'}
        header={'Single answer selection'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 4 && <SingleAnswerSelectionModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        type={'multiple'}
        header={'Multiple answer selection'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 5 && <TextAnswerModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Text answer'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 6 && <SmileyScaleModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Smiley scale'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 7 && <RatingScaleModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Rating scale'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 8 && <NPSModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'NPS'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 9 && <CSATModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'CSAT'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 11 && <ContactFormModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Contact form'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {props.compId === 13 && <DateSelectorModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Date'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
      />}

      {
        props.compId === 15 && <InsertRecordModal
          compId={props.compId}
          data={props.data}
          uiId={props.uiId}
          header={'Insert'}
          save={props.save}
          open={props.open}
          close={props.close}
          theme={props.theme}
          isPublished={props.isPublished}
          recordType={props.recordType}
        />}

      {
        props.compId === 16 && <InsertRecordModal
          compId={props.compId}
          data={props.data}
          uiId={props.uiId}
          header={'Update'}
          save={props.save}
          open={props.open}
          close={props.close}
          theme={props.theme}
          isPublished={props.isPublished}
          recordType={props.recordType}
        />}

      {props.compId === 17 && <SegmentModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Segment'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 18 && <WaitForModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Wait For/Until'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 19 && <NewTaskModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'New Task'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 20 && <SendEmailModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Send Email'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 21 && <AssignOwnerModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Assign User'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 22 && <UpdateRecordModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Set Attribute value'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

      {props.compId === 24 && <SendSurveyModal
        compId={props.compId}
        data={props.data}
        uiId={props.uiId}
        header={'Send Survey'}
        save={props.save}
        open={props.open}
        close={props.close}
        theme={props.theme}
        isPublished={props.isPublished}
        recordType={props.recordType}
      />}

    </>
  )
}

export default DynamicComponentModal