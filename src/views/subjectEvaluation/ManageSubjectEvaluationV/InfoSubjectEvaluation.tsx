import { ESubjectStatusDetail } from '@constants/subject'
import { ESubjectStatus, ISubjectInResponse } from '@domain/subject'
import dayjs from 'dayjs'
import { FC } from 'react'

interface IProps {
  subject: ISubjectInResponse
}

const InfoSubjectEvaluation: FC<IProps> = ({ subject }) => {
  return (
    <div className='leading-8'>
      <p>
        <span className='font-semibold'>Trạng thái môn học:</span>{' '}
        <span
          className={`rounded-md px-2 py-1 ${
            subject.status === ESubjectStatus.INIT
              ? 'bg-green-100 text-green-700'
              : subject.status === ESubjectStatus.SENT_NOTIFICATION
              ? 'bg-blue-100 text-blue-700'
              : subject.status === ESubjectStatus.SENT_EVALUATION
              ? 'text-bg-teal-700 bg-teal-100'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {ESubjectStatusDetail[subject.status]}
        </span>
      </p>
      <p>
        Chủ đề:{' '}
        <span className='font-medium'>
          {subject.code} {subject.title}
        </span>
      </p>
      <p>
        Giảng Viên: {subject.lecturer?.title ? subject.lecturer.title + ' ' : ''}
        {subject.lecturer?.holy_name ? subject.lecturer.holy_name + ' ' : ''}
        {subject.lecturer.full_name}
      </p>
      <p>Ngày học: {dayjs(subject.start_at).format('DD/MM/YYYY')}</p>
      <p>Hạn nộp: 23h59 - Thứ hai, ngày {dayjs(subject.start_at).add(2, 'day').format('DD/MM/YYYY')}</p>
    </div>
  )
}

export default InfoSubjectEvaluation
