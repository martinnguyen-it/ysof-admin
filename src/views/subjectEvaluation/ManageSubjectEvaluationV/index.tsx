import { Divider, Spin } from 'antd'

import { FC, useState } from 'react'
import { EManageFormStatus, EManageFormType } from '@domain/manageForm'
import { EManageFormStatusDetail } from '@constants/manageForm'
import ModalClose from './ModalClose'
import InfoSubjectEvaluation from './InfoSubjectEvaluation'
import { useGetManageForm } from '@src/apis/manageForm/useQueryManageForm'
import { useGetSubjectDetail } from '@src/apis/subject/useQuerySubject'
import FormSubjectEvaluationQuestion from './FormSubjectEvaluationQuestion'

const ManageSubjectEvaluationV: FC = () => {
  const [openClose, setOpenClose] = useState(false)

  const { data: infoForm, isLoading: isLoadingForm, isFetched } = useGetManageForm(EManageFormType.SUBJECT_EVALUATION)
  const { data: currentSubject, isLoading: isLoadingSubject } = useGetSubjectDetail({
    id: infoForm?.data?.subject_id,
    enabled: isFetched && !!infoForm?.data?.subject_id,
  })

  const onOpenClose = () => {
    setOpenClose(true)
  }

  return (
    <div className='m-6 min-h-[calc(100vh-96px)]'>
      {isLoadingForm || isLoadingSubject ? (
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
              <>
                <InfoSubjectEvaluation subject={currentSubject} />
                <Divider />
                <FormSubjectEvaluationQuestion subject={currentSubject} infoForm={infoForm} onOpenClose={onOpenClose} />
              </>
            ) : null}
          </div>
        </>
      )}
      <ModalClose open={openClose} setOpen={setOpenClose} />
    </div>
  )
}

export default ManageSubjectEvaluationV
