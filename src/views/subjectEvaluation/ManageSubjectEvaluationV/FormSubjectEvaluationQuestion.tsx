import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { OPTIONS_EVALUATION_QUESTION_TYPES } from '@constants/subjectEvaluationQuestion'
import { EManageFormStatus, EManageFormType, IManageFormInPayload, IManageFormInResponse } from '@domain/manageForm'
import { ESubjectStatus, ISubjectInResponse } from '@domain/subject'
import { EEvaluationQuestionType, IEvaluationQuestionItem } from '@domain/subject/subjectEvaluationQuestion'
import { useUpdateManageForm } from '@src/apis/manageForm/useMutationManageForm'
import { useSubjectSendEvaluation } from '@src/apis/subject/useMutationSubject'
import { useCreateSubjectEvaluationQuestion } from '@src/apis/subjectEvaluationQuestion/useMutationSubjectEvaluationQuestion'
import { useGetSubjectEvaluationQuestions } from '@src/apis/subjectEvaluationQuestion/useQuerySubjectEvaluationQuestion'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Select } from 'antd'
import { findIndex, isObject } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

interface IProps {
  subject: ISubjectInResponse
  infoForm?: IManageFormInResponse
  onOpenClose: () => void
}

const FormSubjectEvaluationQuestion: FC<IProps> = ({ subject, infoForm, onOpenClose }) => {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingUpdateQuestion, setIsLoadingUpdateQuestion] = useState(false)
  const [enableUpdateQuestion, setEnableUpdateQuestion] = useState(false)

  // id for update and delete, block for block update type when submitted
  const [fields, setFields] = useState<(IEvaluationQuestionItem & { id: string; block?: boolean })[]>([{ id: uuidv4(), title: '', type: EEvaluationQuestionType.TEXT }])

  const { data: dataQuestions } = useGetSubjectEvaluationQuestions({
    subjectId: subject.id,
  })

  useEffect(() => {
    if (dataQuestions) {
      const questions = dataQuestions.questions.map((item) => ({ ...item, id: uuidv4(), block: true }))
      setFields(questions)
      const obj: any = {}
      questions.forEach((item) => {
        obj[item.id] = item
      })
      form.setFieldsValue(obj)
    }
  }, [dataQuestions])

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

  const { mutateAsync: mutateAsyncCreateSubjectEvaluationQuestion } = useCreateSubjectEvaluationQuestion()
  const handleCreateQuestion = async (sendRequest?: boolean) => {
    if (!sendRequest) setIsLoadingUpdateQuestion(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      const sortedKeys = Object.keys(data).sort()
      const result = sortedKeys.map((key) => data[key])
      const resCreateQuestion = await mutateAsyncCreateSubjectEvaluationQuestion({ subjectId: subject.id, data: { questions: result } })
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

  const { mutateAsync: mutateAsyncSendEvaluation } = useSubjectSendEvaluation()

  const handleSubmitSend = async () => {
    setIsLoadingSubmit(true)
    try {
      const resCreateQuestion = await handleCreateQuestion(true)
      if (resCreateQuestion) {
        const resSendEvaluation = await mutateAsyncSendEvaluation(subject.id)
        if (!isObject(resSendEvaluation) && resSendEvaluation) {
          toast.success('Gửi thành công')
          queryClient.invalidateQueries({ queryKey: ['getSubjectDetail'] })
          queryClient.invalidateQueries({ queryKey: ['getManageForm'] })
        }
      }
    } catch {
      setIsLoadingSubmit(false)
    }
    setIsLoadingSubmit(false)
  }

  const { mutate, isPending: isPendingManageForm } = useUpdateManageForm(() => {
    toast.success('Mở form thành công')
    queryClient.invalidateQueries({ queryKey: ['getManageForm'] })
  })
  const onOpenForm = () => {
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_EVALUATION,
      status: EManageFormStatus.ACTIVE,
    }
    mutate(payload)
  }
  return (
    <>
      <div className='mb-4 flex justify-center text-2xl font-bold'>CÂU HỎI LƯỢNG GIÁ</div>
      <Form form={form} layout='vertical' disabled={!enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION}>
        {fields.map((field, idx) => (
          <div key={field.id}>
            <div className='font-bold'>
              Câu hỏi {idx + 1}{' '}
              {!field?.block && fields.length > 1 && !(!enableUpdateQuestion && subject.status !== ESubjectStatus.SENT_NOTIFICATION) && (
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
                disabled={field?.block}
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
          <Button disabled={infoForm?.status === EManageFormStatus.ACTIVE} loading={isPendingManageForm} className='mt-2' onClick={onOpenForm} type='primary'>
            Mở form
          </Button>
        )}
      </div>
    </>
  )
}

export default FormSubjectEvaluationQuestion
