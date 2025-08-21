import React, { Dispatch, FC, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetListDocuments } from '@/apis/document/useQueryDocument'
import { useGetListLecturers } from '@/apis/lecturer/useQueryLecturer'
import {
  useCreateSubject,
  useUpdateSubject,
} from '@/apis/subject/useMutationSubject'
import { userInfoState } from '@/atom/authAtom'
import { currentSeasonState } from '@/atom/seasonAtom'
import { EAdminRole } from '@/domain/admin/type'
import { IOpenFormWithMode } from '@/domain/common'
import { EDocumentType } from '@/domain/document'
import { ISubjectInResponse } from '@/domain/subject'
import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import { isEmpty, size } from 'lodash'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { isSuperAdmin } from '@/lib/utils'
import { OPTIONS_SUBDIVISION } from '@/constants/subject'
import { useDebounce } from '@/hooks/useDebounce'

interface IProps {
  open: IOpenFormWithMode<ISubjectInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<ISubjectInResponse>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const [searchDocuments, setSearchDocuments] = useState('')
  const [searchLecturers, setSearchLecturers] = useState('')
  const [startAt, setStartAt] = useState<string>()
  const currentSeason = useRecoilValue(currentSeasonState)
  const userInfo = useRecoilValue(userInfoState)

  const searchDocDebounce = useDebounce(searchDocuments, 300)
  const searchLecturerDebounce = useDebounce(searchLecturers, 300)

  const { data: lecturers, isPending: loadingGetLecturers } =
    useGetListLecturers({ search: searchLecturerDebounce })

  const { data: documents, isPending: loadingGetDocuments } =
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

  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjects'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, mode: 'add' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateSubject(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateSubject(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      if (open?.item) {
        mutateUpdate({
          subjectId: open.item.id,
          data: { ...data, start_at: startAt },
        })
      } else {
        mutateCreate({ ...data, start_at: startAt })
      }
    } catch {}
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

  const lecturerOptions = useMemo(
    () =>
      lecturers && size(lecturers?.data)
        ? lecturers.data.map((item) => ({
            value: item.id,
            label: (
              <span className='flex items-center'>
                <img
                  className='mr-1 size-4 rounded-full object-cover'
                  referrerPolicy='no-referrer'
                  src={item?.avatar || '/images/avatar.png'}
                ></img>
                {item?.title ? item.title + ' ' : ''}
                {item?.holy_name ? item.holy_name + ' ' : ''}
                {item.full_name}
              </span>
            ),
          }))
        : [],
    [lecturers]
  )

  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item) {
      form.setFieldsValue({
        ...open.item,
        attachments: open.item?.attachments
          ? open.item.attachments.map((item) => item.id)
          : [],
        lecturer: open.item.lecturer.id,
        date_start_at: dayjs(open.item.start_at, 'YYYY-MM-DD'),
      })
    } else form.resetFields()
  }, [open])

  const onSearchDocument = (val: string) => {
    setSearchDocuments(val)
  }

  const onSearchLecturer = (val: string) => {
    setSearchLecturers(val)
  }

  const onChangeStartAt: DatePickerProps['onChange'] = (_, dateString) => {
    setStartAt(
      dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD')
    )
  }

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingUpdate || isPendingCreate}
      onCancel={handleCancel}
      cancelText='Hủy'
      className='sm:!w-[70vw] lg:!w-[60vw]'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form
        layout='vertical'
        form={form}
        name='form-subject'
        className='grid grid-cols-1 gap-x-3 sm:grid-cols-2'
      >
        {(userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)) && (
          <>
            <Form.Item
              name='code'
              label='Mã chủ đề'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã chủ đề',
                },
              ]}
            >
              <Input placeholder={`Y${currentSeason?.season}.01`} />
            </Form.Item>
            <Form.Item
              name='title'
              label='Tên chủ đề'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên chủ đề',
                },
              ]}
            >
              <Input placeholder='Tên chủ đề' />
            </Form.Item>
            <Form.Item
              label='Phân môn'
              name='subdivision'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phân môn',
                },
              ]}
            >
              <Select
                placeholder='Chọn phân môn'
                options={OPTIONS_SUBDIVISION}
              />
            </Form.Item>
            <Form.Item
              name='date_start_at'
              label='Ngày học'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày bắt đầu',
                },
              ]}
            >
              <DatePicker
                placeholder='DD/MM/YYYY'
                format={'DD/MM/YYYY'}
                onChange={onChangeStartAt}
              />
            </Form.Item>
            <Form.Item
              name='lecturer'
              label='Giảng viên'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn giảng viên',
                },
              ]}
            >
              <Select
                placeholder='Chọn giảng viên'
                onSearch={onSearchLecturer}
                filterOption={() => true}
                allowClear
                showSearch
                options={lecturerOptions}
                loading={loadingGetLecturers}
              />
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
              <Select placeholder='Link tài liệu' mode='tags' allowClear />
            </Form.Item>
            <Form.Item name='abstract' label='Mô tả'>
              <Input.TextArea />
            </Form.Item>
          </>
        )}
        {(userInfo.roles.includes(EAdminRole.BKT) || isSuperAdmin(true)) && (
          <>
            <Form.Item
              rules={[
                {
                  type: 'url',
                  message: 'Vui lòng nhập link zoom hợp lệ',
                },
              ]}
              name={['zoom', 'link']}
              label='Link Zoom'
            >
              <Input placeholder='Link zoom' />
            </Form.Item>
            <Form.Item name={['zoom', 'meeting_id']} label='ID'>
              <Input placeholder='ID' />
            </Form.Item>
            <Form.Item name={['zoom', 'pass_code']} label='Mật khẩu'>
              <Input placeholder='Mật khẩu' />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default ModalAdd
