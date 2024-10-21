import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ESubjectStatusDetail } from '@constants/subject'
import { OPTIONS_EVALUATION_QUESTION_TYPES } from '@constants/subjectEvaluationQuestion'
import { EManageFormStatus, EManageFormType, IManageFormInPayload, IManageFormInResponse } from '@domain/manageForm'
import { ESubjectStatus, ISubjectInResponse } from '@domain/subject'
import { EEvaluationQuestionType, IEvaluationQuestionItem } from '@domain/subject/subjectEvaluationQuestion'
import { updateManageForm } from '@src/services/manageForm'
import { subjectSendEvaluation } from '@src/services/subject'
import { createSubjectEvaluation } from '@src/services/subjectEvaluationQuestion'
import { Button, Divider, Form, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { findIndex, isEmpty, isObject } from 'lodash'
import { DispatchWithoutAction, FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

interface IProps {
  subject: ISubjectInResponse
  infoForm?: IManageFormInResponse
  onOpenClose: () => void
  setReloadData: DispatchWithoutAction
  questions:
    | (IEvaluationQuestionItem & {
        id: string
      })[]
    | undefined
}

const InfoSubjectEvaluation: FC<IProps> = ({ subject, infoForm, onOpenClose, setReloadData, questions }) => {
  const [form] = Form.useForm()
  const [fields, setFields] = useState<(IEvaluationQuestionItem & { id: string })[]>([{ id: uuidv4(), title: '', type: EEvaluationQuestionType.TEXT }])
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingUpdateQuestion, setIsLoadingUpdateQuestion] = useState(false)
  const [enableUpdateQuestion, setEnableUpdateQuestion] = useState(false)

  useEffect(() => {
    if (questions) {
      setFields(questions)
      const obj: any = {}
      questions.forEach((item) => {
        obj[item.id] = item
      })
      form.setFieldsValue(obj)
    }
  }, [questions])

  const handleAddField = () => {
    const newField = { id: uuidv4(), title: '', type: EEvaluationQuestionType.TEXT }
    setFields([...fields, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields((prev) => {
      prev = prev.slice()
      const index = findIndex(prev, (item) => item.id === id)
      if (index !== -1) prev.splice(index, 1)
      return prev
    })
  }

  const handleCreateQuestion = async (sendRequest?: boolean) => {
    if (!sendRequest) setIsLoadingUpdateQuestion(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      const sortedKeys = Object.keys(data).sort()
      const result = sortedKeys.map((key) => data[key])
      const resCreateQuestion = await createSubjectEvaluation(subject.id, { questions: result })
      if (resCreateQuestion) return true
    } catch (error) {
      return false
    }
  }

  const handleUpdateQuestion = async () => {
    setIsLoadingUpdateQuestion(true)
    const resCreateQuestion = await handleCreateQuestion(true)
    if (resCreateQuestion) {
      toast.success('Sửa thành công')
      setEnableUpdateQuestion(false)
    }
    setIsLoadingUpdateQuestion(false)
  }

  const handleSubmitSend = async () => {
    setIsLoadingSubmit(true)
    try {
      const resCreateQuestion = await handleCreateQuestion(true)
      if (resCreateQuestion) {
        const resSendEvaluation = await subjectSendEvaluation(subject.id)
        if (!isObject(resSendEvaluation) && resSendEvaluation) {
          toast.success('Gửi thành công')
          setReloadData()
        }
      }
    } catch (error) {
      setIsLoadingSubmit(false)
    }
    setIsLoadingSubmit(false)
  }

  const onOpenForm = async () => {
    setIsLoadingSubmit(true)
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_EVALUATION,
      status: EManageFormStatus.ACTIVE,
    }
    const res = await updateManageForm(payload)
    if (!isEmpty(res)) {
      toast.success('Mở form thành công')
      setReloadData()
    }
    setIsLoadingSubmit(false)
  }

  return (
    <>
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

      <Divider />
      <div className='mb-4 flex justify-center text-2xl font-bold'>CÂU HỎI LƯỢNG GIÁ</div>

      <Form form={form} layout='vertical' disabled={!enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION}>
        {fields.map((field, idx) => (
          <div key={field.id}>
            <div className='font-bold'>
              Câu hỏi {idx + 1}{' '}
              {fields.length > 1 && !(!enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION) && (
                <MinusCircleOutlined onClick={() => handleRemoveField(field.id)} />
              )}
            </div>
            <Form.Item name={[field.id, 'title']} label='Câu hỏi' rules={[{ required: true, message: 'Vui lòng điền câu hỏi' }]}>
              <Input.TextArea
                value={field.title}
                onChange={(e) => {
                  const value = e.target.value
                  setFields(fields.map((item) => (item.id === field.id ? { ...item, title: value } : item)))
                }}
              />
            </Form.Item>
            <Form.Item className='min-w-[170px]' name={[field.id, 'type']} label='Loại' rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}>
              <Select
                value={field.type}
                onChange={(value) => {
                  setFields(fields.map((item) => (item.id === field.id ? { ...item, type: value } : item)))
                }}
                options={OPTIONS_EVALUATION_QUESTION_TYPES}
              />
            </Form.Item>
            {field.type !== 'text' && (
              <Form.Item className='min-w-[400px]' name={[field.id, 'answers']} label='Đáp án' rules={[{ required: true, message: 'Vui lòng điền đáp án' }]}>
                <Select
                  mode='tags'
                  value={field.answers}
                  onChange={(val) => {
                    setFields(fields.map((item) => (item.id === field.id ? { ...item, answers: val } : item)))
                  }}
                />
              </Form.Item>
            )}
          </div>
        ))}
        <Form.Item>
          <Button type='dashed' onClick={handleAddField} icon={<PlusOutlined />}>
            Thêm câu hỏi
          </Button>
        </Form.Item>
      </Form>

      <div className='flex justify-end gap-3'>
        {!enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION ? (
          <Button
            className='mt-2 bg-yellow-400 hover:!bg-yellow-400/80'
            onClick={() => {
              setEnableUpdateQuestion(true)
            }}
            type='primary'
          >
            Mở sửa câu hỏi
          </Button>
        ) : enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION ? (
          <Button className='mt-2 bg-green-500 hover:!bg-green-500/80' loading={isLoadingUpdateQuestion} onClick={handleUpdateQuestion} type='primary'>
            Sửa câu hỏi
          </Button>
        ) : (
          <div></div>
        )}
        {infoForm?.status === EManageFormStatus.ACTIVE && (
          <Button className='mt-2 bg-red-500 hover:!bg-red-500/80' onClick={onOpenClose} type='primary'>
            Tạm đóng form
          </Button>
        )}
        {subject.status === ESubjectStatus.SENT_NOTIFICATION ? (
          <Button disabled={infoForm?.status === EManageFormStatus.ACTIVE} loading={isLoadingSubmit} className='mt-2' onClick={handleSubmitSend} type='primary'>
            Gửi email lượng giá
          </Button>
        ) : (
          <Button disabled={infoForm?.status === EManageFormStatus.ACTIVE} loading={isLoadingSubmit} className='mt-2' onClick={onOpenForm} type='primary'>
            Mở form
          </Button>
        )}
      </div>
    </>
  )
}

export default InfoSubjectEvaluation
