import { FC, useEffect, useMemo, useState } from 'react'
import { useGetListDocuments } from '@/apis/document/useQueryDocument'
import {
  useGetSubjectLastSentStudentRecent,
  useGetSubjectNextMostRecent,
} from '@/apis/subject/useQuerySubject'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EDocumentType } from '@/domain/document'
import { ESubjectStatus } from '@/domain/subject'
import { Button, Divider, Form, Input, Select, Spin } from 'antd'
import dayjs from 'dayjs'
import { isEmpty, size } from 'lodash'
import { useRecoilValue } from 'recoil'
import { ESubjectStatusDetail } from '@/constants/subject'
import { useDebounce } from '@/hooks/useDebounce'
import ModalConfirm from './ModalConfirm'
import TableStudent from './TableStudent'

const SendEmailNotificationSubjectV: FC = () => {
  const [form] = Form.useForm()
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
  const { data: recentNextSubject, isLoading: isLoadingNextRecent } =
    useGetSubjectNextMostRecent(isFetched)

  useEffect(() => {
    if (!isEmpty(recentNextSubject)) {
      form.setFieldsValue({
        ...recentNextSubject,
        attachments: recentNextSubject?.attachments
          ? recentNextSubject.attachments.map((item) => item.id)
          : [],
      })
    }
  }, [recentNextSubject])

  const onOpenConfirm = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
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
                  disabled={recentNextSubject.status !== ESubjectStatus.INIT}
                  layout='vertical'
                  form={form}
                  name='form-subject'
                  className='grid grid-cols-1 gap-x-3 md:grid-cols-2 lg:grid-cols-3'
                >
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
                    <Input />
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
                    <Input placeholder='Link zoom' />
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
                    <Input placeholder='ID' />
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
                    <Input placeholder='Mật khẩu' />
                  </Form.Item>
                </Form>
                <div className='flex justify-end'>
                  <Button
                    disabled={recentNextSubject.status !== ESubjectStatus.INIT}
                    onClick={onOpenConfirm}
                    type='primary'
                  >
                    Xác nhận thông tin và Gửi
                  </Button>
                </div>
                <Divider />
                <TableStudent subjectId={recentNextSubject.id} />
              </div>
            ) : null}
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
