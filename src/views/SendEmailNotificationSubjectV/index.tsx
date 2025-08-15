import { FC, useEffect, useMemo, useState } from 'react'
import { useGetListDocuments } from '@/apis/document/useQueryDocument'
import { useGenerateQuestionSpreadsheet } from '@/apis/subject/useMutationSubject'
import {
  useGetSubjectLastSentStudentRecent,
  useGetSubjectNextMostRecent,
} from '@/apis/subject/useQuerySubject'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EDocumentType } from '@/domain/document'
import { ESubjectStatus, IGenerateQuestionSpreadsheet } from '@/domain/subject'
import { Button, Divider, Form, Input, Select, Space, Spin } from 'antd'
import dayjs from 'dayjs'
import { isEmpty, size } from 'lodash'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { ESubjectStatusDetail } from '@/constants/subject'
import { useDebounce } from '@/hooks/useDebounce'
import EmailsInput from '@/components/EmailsInput'
import ModalConfirm from './ModalConfirm'
import TableStudent from './TableStudent'

const SendEmailNotificationSubjectV: FC = () => {
  const [form] = Form.useForm()
  const extraEmails = Form.useWatch('extra_emails', form)

  const currentSeason = useRecoilValue(currentSeasonState)
  const [openConfirm, setOpenConfirm] = useState({
    active: false,
    item: undefined,
  })
  const [searchDocuments, setSearchDocuments] = useState('')

  const searchDocDebounce = useDebounce(searchDocuments, 300)

  const { data: documents, isLoading: loadingGetDocuments } =
    useGetListDocuments(
      {
        search: searchDocDebounce,
        season: currentSeason?.season,
        type: EDocumentType.STUDENT,
      },
      {
        enabled: !!currentSeason?.season,
      }
    )

  const {
    data: recentLastSentStudent,
    isLoading: isLoadingLastSentRecent,
    isFetched,
  } = useGetSubjectLastSentStudentRecent()
  const {
    data: recentNextSubject,
    isLoading: isLoadingNextRecent,
    isRefetching: isRefetchingNextRecent,
  } = useGetSubjectNextMostRecent(isFetched)

  useEffect(() => {
    if (!isEmpty(recentNextSubject)) {
      form.setFieldsValue({
        ...recentNextSubject,
        attachments: recentNextSubject?.attachments
          ? recentNextSubject.attachments.map((item) => item.id)
          : [],
        extra_emails: [],
      })
    }
  }, [recentNextSubject, isRefetchingNextRecent])

  const onOpenConfirm = async () => {
    try {
      const data = form.getFieldsValue()
      await form.validateFields()
      setOpenConfirm({ active: true, item: data })
    } catch {
      /* empty */
    }
  }

  const onSearchDocument = (val: string) => {
    setSearchDocuments(val)
  }

  const documentOptions = useMemo(
    () =>
      documents && size(documents?.data)
        ? documents.data.map((item) => ({
            value: item.id,
            label: (
              <span className='flex items-center'>
                <img
                  className='mr-1 size-4 object-cover'
                  src={`https://drive-thirdparty.googleusercontent.com/64/type/${item?.mimeType}`}
                ></img>
                {item.name}
              </span>
            ),
          }))
        : [],
    [documents]
  )

  const {
    mutate: generateQuestionSpreadsheet,
    isPending: isPendingGenerateQuestionSpreadsheet,
  } = useGenerateQuestionSpreadsheet((data: IGenerateQuestionSpreadsheet) => {
    form.setFieldValue('question_url', data.question_url)
    toast.success('Tạo trang tính câu hỏi thành công')
  })

  const extraEmailsSent = useMemo(() => {
    return (
      recentLastSentStudent?.extra_emails ||
      recentNextSubject?.extra_emails ||
      []
    )
  }, [recentLastSentStudent, recentNextSubject])

  return (
    <>
      {isLoadingLastSentRecent || isLoadingNextRecent ? (
        <div className='mt-20 flex w-full justify-center'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          <div className='rounded-xl bg-white px-10 py-6 shadow-lg'>
            <div className='flex justify-center text-2xl font-bold'>
              THÔNG BÁO BUỔI HỌC
            </div>

            <div className='mb-4 mt-3'>
              {!recentLastSentStudent && !recentNextSubject ? (
                <>Không có chủ đề hợp lệ</>
              ) : (
                <>
                  <span className='font-semibold'>Trạng thái:</span>{' '}
                  {recentLastSentStudent ? (
                    <span className='rounded-md bg-green-100 px-2 py-1 text-green-700'>
                      {ESubjectStatusDetail[recentLastSentStudent.status]}
                    </span>
                  ) : recentNextSubject ? (
                    <span className='rounded-md bg-blue-100 px-2 py-1 text-blue-700'>
                      {ESubjectStatusDetail[recentNextSubject.status]}
                    </span>
                  ) : null}
                </>
              )}
            </div>

            {recentLastSentStudent ? (
              <div className='px-2 leading-8'>
                <p>
                  Chủ đề:{' '}
                  <span className='font-medium'>
                    {recentLastSentStudent.code} {recentLastSentStudent.title}
                  </span>
                </p>
                <p>
                  Giảng Viên:{' '}
                  {recentLastSentStudent.lecturer?.title
                    ? recentLastSentStudent.lecturer.title + ' '
                    : ''}
                  {recentLastSentStudent.lecturer?.holy_name
                    ? recentLastSentStudent.lecturer.holy_name + ' '
                    : ''}
                  {recentLastSentStudent.lecturer.full_name}
                </p>
                <p>
                  Ngày học:{' '}
                  {dayjs(recentLastSentStudent.start_at).format('DD/MM/YYYY')}
                </p>
              </div>
            ) : null}

            {!recentLastSentStudent && recentNextSubject ? (
              <div>
                <div className='px-2 leading-8'>
                  <p>
                    Chủ đề:{' '}
                    <span className='font-medium'>
                      {recentNextSubject.code} {recentNextSubject.title}
                    </span>
                  </p>
                  <p>
                    Giảng Viên:{' '}
                    {recentNextSubject.lecturer?.title
                      ? recentNextSubject.lecturer.title + ' '
                      : ''}
                    {recentNextSubject.lecturer?.holy_name
                      ? recentNextSubject.lecturer.holy_name + ' '
                      : ''}
                    {recentNextSubject.lecturer.full_name}
                  </p>
                  <p>
                    Ngày học:{' '}
                    {dayjs(recentNextSubject.start_at).format('DD/MM/YYYY')}
                  </p>
                </div>
                <Divider />
                <Form
                  disabled={
                    ![
                      ESubjectStatus.INIT,
                      ESubjectStatus.SENT_NOTIFICATION,
                    ].includes(recentNextSubject.status)
                  }
                  layout='vertical'
                  form={form}
                  name='form-subject'
                >
                  <div className='grid grid-cols-1 gap-x-3 md:grid-cols-2 lg:grid-cols-3'>
                    <Form.Item
                      name='question_url'
                      label='Link câu hỏi gửi giảng viên'
                      rules={[
                        {
                          required: true,
                          message: 'Trường này không được để trống',
                        },
                      ]}
                    >
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          value={
                            form.getFieldValue('question_url') ||
                            recentNextSubject?.question_url
                          }
                          disabled={
                            recentNextSubject.status !== ESubjectStatus.INIT
                          }
                        />
                        {recentNextSubject.question_url && (
                          <Button
                            type='default'
                            onClick={() => {
                              navigator.clipboard.writeText(
                                form.getFieldValue('question_url')
                              )
                              toast.success('Link đã được sao chép')
                            }}
                            disabled={false}
                          >
                            Sao chép
                          </Button>
                        )}
                        <Button
                          type='primary'
                          loading={isPendingGenerateQuestionSpreadsheet}
                          onClick={() =>
                            generateQuestionSpreadsheet(recentNextSubject.id)
                          }
                          disabled={
                            recentNextSubject.status !== ESubjectStatus.INIT
                          }
                        >
                          {recentNextSubject.question_url ? 'Tạo mới' : 'Tạo'}
                        </Button>
                      </Space.Compact>
                    </Form.Item>
                    <Form.Item name='attachments' label='Tài liệu đính kèm'>
                      <Select
                        placeholder='Chọn tài liệu đính kèm'
                        onSearch={onSearchDocument}
                        filterOption={() => true}
                        mode='multiple'
                        allowClear
                        options={documentOptions}
                        loading={loadingGetDocuments}
                        disabled={
                          recentNextSubject.status !== ESubjectStatus.INIT
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name='documents_url'
                      label='Link tài liệu đính kèm ngoài'
                    >
                      <Select
                        placeholder='Link tài liệu'
                        mode='tags'
                        allowClear
                        disabled={
                          recentNextSubject.status !== ESubjectStatus.INIT
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={['zoom', 'link']}
                      label='Link Zoom'
                      rules={[
                        {
                          required: true,
                          message: 'Trường này không được để trống',
                        },
                      ]}
                    >
                      <Input
                        placeholder='Link zoom'
                        disabled={
                          recentNextSubject.status !== ESubjectStatus.INIT
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={['zoom', 'meeting_id']}
                      label='ID'
                      rules={[
                        {
                          required: true,
                          message: 'Trường này không được để trống',
                        },
                      ]}
                    >
                      <Input
                        placeholder='ID'
                        disabled={
                          recentNextSubject.status !== ESubjectStatus.INIT
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name={['zoom', 'pass_code']}
                      label='Mật khẩu'
                      rules={[
                        {
                          required: true,
                          message: 'Trường này không được để trống',
                        },
                      ]}
                    >
                      <Input
                        placeholder='Mật khẩu'
                        disabled={
                          recentNextSubject.status !== ESubjectStatus.INIT
                        }
                      />
                    </Form.Item>
                  </div>
                  <Form.Item
                    name='extra_emails'
                    label='Email bổ sung (ngoài BTC và HV đã đăng ký)'
                  >
                    <EmailsInput placeholder='Nhập và nhấn Tab/Enter' />
                  </Form.Item>
                </Form>
                <div className='flex justify-end'>
                  <Button
                    disabled={
                      ![
                        ESubjectStatus.INIT,
                        ESubjectStatus.SENT_NOTIFICATION,
                      ].includes(recentNextSubject.status) ||
                      (recentNextSubject.status ===
                        ESubjectStatus.SENT_NOTIFICATION &&
                        isEmpty(extraEmails))
                    }
                    onClick={onOpenConfirm}
                    type='primary'
                  >
                    Xác nhận thông tin và Gửi
                  </Button>
                </div>
              </div>
            ) : null}
            {!isEmpty(extraEmailsSent) && (
              <>
                <Divider />
                <div>
                  <p className='font-semibold'>
                    Danh sách email bổ sung đã gửi:
                  </p>
                  <p>{extraEmailsSent.join(', ')}</p>
                </div>
              </>
            )}
            {(recentLastSentStudent || recentNextSubject) && (
              <>
                <Divider />
                <TableStudent
                  subjectId={
                    recentLastSentStudent?.id || recentNextSubject?.id || ''
                  }
                />
              </>
            )}
          </div>
        </>
      )}
      {recentNextSubject && (
        <ModalConfirm
          open={openConfirm}
          setOpen={setOpenConfirm}
          subject={recentNextSubject}
        />
      )}
    </>
  )
}

export default SendEmailNotificationSubjectV
