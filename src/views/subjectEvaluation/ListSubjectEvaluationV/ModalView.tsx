import { FC } from 'react'
import { ISubjectEvaluationInResponse } from '@/domain/subject/subjectEvaluation'
import { IEvaluationQuestionItem } from '@/domain/subject/subjectEvaluationQuestion'
import { Modal } from 'antd'
import {
  EVALUATION_NAME,
  EVALUATION_QUALITY,
} from '@/constants/subjectEvaluation'

interface ModalViewProps {
  open: boolean
  onClose: () => void
  data?: ISubjectEvaluationInResponse
  questions: IEvaluationQuestionItem[]
}

const ModalView: FC<ModalViewProps> = ({ open, onClose, data, questions }) => {
  if (!data) return null

  return (
    <Modal
      title='Chi tiết lượng giá'
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-medium'>MSHV:</p>
            <p>
              {String(
                data.student.seasons_info[data.student.seasons_info.length - 1]
                  .numerical_order
              ).padStart(3, '0')}
            </p>
          </div>
          <div>
            <p className='font-medium'>Nhóm:</p>
            <p>
              {
                data.student.seasons_info[data.student.seasons_info.length - 1]
                  .group
              }
            </p>
          </div>
          <div>
            <p className='font-medium'>Họ tên:</p>
            <p>
              {data.student.holy_name} {data.student.full_name}
            </p>
          </div>
          <div>
            <p className='font-medium'>Email:</p>
            <p>{data.student.email}</p>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>
            1. {EVALUATION_NAME.get('feedback_admin')}:
          </p>
          <p>{data.feedback_admin}</p>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>
            2. {EVALUATION_NAME.get('most_resonated')}:
          </p>
          <p>{data.most_resonated}</p>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>3. {EVALUATION_NAME.get('invited')}:</p>
          <p>{data.invited}</p>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>
            4. {EVALUATION_NAME.get('feedback_lecturer')}:
          </p>
          <p>{data.feedback_lecturer}</p>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>5. {EVALUATION_NAME.get('satisfied')}:</p>
          <p>{data.satisfied}</p>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>6. {EVALUATION_NAME.get('quality')}:</p>
          <div className='grid grid-cols-2 gap-4'>
            {EVALUATION_QUALITY.map((item) => (
              <div key={item.key}>
                <p className='font-medium'>{item.label}:</p>
                <p>{data.quality[item.key]}</p>
              </div>
            ))}
          </div>
        </div>

        {questions.length && (
          <div className='space-y-2'>
            {questions.map((item, index) => (
              <div key={index} className='space-y-1'>
                <p className='font-medium'>
                  {index + 7}. {item.title}
                </p>
                <p>
                  {Array.isArray(data?.answers?.[index])
                    ? data?.answers?.[index].join(', ')
                    : data?.answers?.[index]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalView
