import { Spin } from 'antd'

import { FC, useEffect, useReducer, useState } from 'react'
import { isEmpty } from 'lodash'
import { ISubjectInResponse } from '@domain/subject'
import { getSubjectDetail } from '@src/services/subject'
import { EManageFormStatus, EManageFormType, IManageFormInResponse } from '@domain/manageForm'
import { getManageForm } from '@src/services/manageForm'
import { EManageFormStatusDetail } from '@constants/manageForm'
import ModalClose from './ModalClose'
import InfoSubjectEvaluation from './InfoSubjectEvaluation'
import { getSubjectEvaluationQuestionsNotHandler } from '@src/services/subjectEvaluationQuestion'
import { IEvaluationQuestionItem } from '@domain/subject/subjectEvaluationQuestion'
import { v4 as uuidv4 } from 'uuid'

const ManageSubjectEvaluationV: FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [infoForm, setInfoForm] = useState<IManageFormInResponse>()
  const [reloadData, setReloadData] = useReducer((prev) => !prev, false)
  const [currentSubject, setCurrentSubject] = useState<ISubjectInResponse>()
  const [openClose, setOpenClose] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const resForm = await getManageForm(EManageFormType.SUBJECT_EVALUATION)
      if (!isEmpty(resForm)) {
        setInfoForm(resForm)
        if (resForm?.data && resForm.data?.subject_id) {
          const resCurrentSubject = await getSubjectDetail(resForm.data.subject_id)
          if (!isEmpty(resCurrentSubject)) setCurrentSubject(resCurrentSubject)
        }
      }
      setIsLoading(false)
    })()
  }, [reloadData])

  const onOpenClose = () => {
    setOpenClose(true)
  }

  const [questions, setQuestions] = useState<(IEvaluationQuestionItem & { id: string })[]>()

  useEffect(() => {
    if (currentSubject) {
      ;(async () => {
        const data = await getSubjectEvaluationQuestionsNotHandler(currentSubject.id)
        if (data) {
          setQuestions(data.questions.map((item) => ({ ...item, id: uuidv4() })))
        }
      })()
    }
  }, [reloadData, currentSubject])

  return (
    <div className='m-6 min-h-[calc(100vh-96px)]'>
      {isLoading ? (
        <div className='mt-20 flex w-full justify-center'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          <div className='rounded-xl bg-white px-10 py-6 shadow-lg'>
            <div className='flex justify-center text-2xl font-bold'>LƯỢNG GIÁ MÔN HỌC</div>
            <div className='mb-4 mt-3'>
              <span className='font-semibold'>Trạng thái form:</span>{' '}
              {infoForm && (
                <span
                  className={`rounded-md px-2 py-1 ${
                    infoForm?.status === EManageFormStatus.ACTIVE
                      ? 'bg-green-100 text-green-700'
                      : infoForm?.status === EManageFormStatus.CLOSED
                      ? 'bg-red-100 text-red-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {EManageFormStatusDetail[infoForm?.status]}
                </span>
              )}
            </div>
            {currentSubject ? (
              <InfoSubjectEvaluation setReloadData={setReloadData} infoForm={infoForm} onOpenClose={onOpenClose} subject={currentSubject} questions={questions} />
            ) : null}
          </div>
        </>
      )}
      <ModalClose open={openClose} setOpen={setOpenClose} setReloadData={setReloadData} />
    </div>
  )
}

export default ManageSubjectEvaluationV
