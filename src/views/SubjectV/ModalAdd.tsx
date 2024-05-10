import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import { isEmpty } from 'lodash'
import React, { Dispatch, DispatchWithoutAction, FC, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { EDocumentType, IDocumentInResponse } from '@domain/document'
import { getListDocuments } from '@src/services/document'
import { useDebounce } from '@src/hooks/useDebounce'
import { IOpenFormWithMode } from '@domain/common'
import { ISubjectInResponse } from '@domain/subject'
import { createSubject, updateSubject } from '@src/services/subject'
import { currentSeasonState, selectSeasonState } from '@atom/seasonAtom'
import { OPTIONS_SUBDIVISION } from '@constants/subject'
import { ILecturerInResponse } from '@domain/lecturer'
import { getListLecturers } from '@src/services/lecturer'
import dayjs from 'dayjs'
import { userInfoState } from '@atom/authAtom'
import { EAdminRole } from '@domain/admin/type'
import { isSuperAdmin } from '@src/utils'

interface IProps {
  open: IOpenFormWithMode<ISubjectInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<ISubjectInResponse>>>
  setReloadData: DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loadingGetDocuments, setLoadingGetDocuments] = useState(false)
  const [loadingGetLecturers, setLoadingGetLecturers] = useState(false)
  const [documents, setDocuments] = useState<IDocumentInResponse[]>([])
  const [lecturers, setLecturers] = useState<ILecturerInResponse[]>([])
  const [searchDocuments, setSearchDocuments] = useState('')
  const [searchLecturers, setSearchLecturers] = useState('')
  const [startAt, setStartAt] = useState<string>()
  const currentSeason = useRecoilValue(currentSeasonState)
  const userInfo = useRecoilValue(userInfoState)

  const searchDocDebounce = useDebounce(searchDocuments, 300)
  const searchLecturerDebounce = useDebounce(searchLecturers, 300)

  useEffect(() => {
    ;(async () => {
      setLoadingGetDocuments(true)
      const res = await getListDocuments({ search: searchDocDebounce, season: currentSeason?.season, type: EDocumentType.STUDENT })
      if (!isEmpty(res)) {
        setDocuments(res.data)
      }
      setLoadingGetDocuments(false)
    })()
  }, [searchDocDebounce])

  useEffect(() => {
    ;(async () => {
      setLoadingGetLecturers(true)
      const res = await getListLecturers({ search: searchLecturerDebounce })
      if (!isEmpty(res)) {
        setLecturers(res.data)
      }
      setLoadingGetLecturers(false)
    })()
  }, [searchLecturerDebounce])

  const handleOk = async () => {
    setConfirmLoading(true)
    let res: ISubjectInResponse
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_start_at
      if (open?.item) {
        res = await updateSubject(open.item.id, { ...data, start_at: startAt })
        if (!isEmpty(res)) {
          toast.success('Sửa thành công')
          setOpen({ active: false, mode: 'add' })
          setReloadData()
        }
      } else {
        res = await createSubject({ ...data, start_at: startAt })
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen({ active: false, mode: 'add' })
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
  }

  const documentOptions = useMemo(
    () =>
      documents.map((item) => ({
        value: item.id,
        label: (
          <span className='flex items-center'>
            <img className='mr-1 size-4 object-cover' src={`https://drive-thirdparty.googleusercontent.com/64/type/${item?.mimeType}`}></img>
            {item.name}
          </span>
        ),
      })),
    [documents],
  )

  const lecturerOptions = useMemo(
    () =>
      lecturers.map((item) => ({
        value: item.id,
        label: (
          <span className='flex items-center'>
            <img className='mr-1 size-4 object-cover' src={item?.avatar || '/images/avatar.png'}></img>
            {item?.title ? item.title + ' ' : ''}
            {item?.holy_name ? item.holy_name + ' ' : ''}
            {item.full_name}
          </span>
        ),
      })),
    [lecturers],
  )

  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item) {
      form.setFieldsValue({
        ...open.item,
        attachments: open.item?.attachments ? open.item.attachments.map((item) => item.id) : [],
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
    setStartAt(dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  }

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
    >
      <Form layout='vertical' form={form} name='form-subject'>
        {(userInfo.roles.includes(EAdminRole.BHV) || isSuperAdmin(true)) && (
          <>
            <Form.Item
              name='code'
              label='Mã chủ đề'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhâp mã chủ đề',
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
                  message: 'Vui lòng nhâp tên chủ đề',
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
              <Select placeholder='Chọn phân môn' options={OPTIONS_SUBDIVISION} />
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
              <DatePicker format={'DD/MM/YYYY'} onChange={onChangeStartAt} />
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
            <Form.Item name='question_url' label='Link câu hỏi gửi giảng viên'>
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
            <Form.Item name='documents_url' label='Link tài liệu đính kèm ngoài'>
              <Select placeholder='Link tài liệu' mode='tags' allowClear />
            </Form.Item>
            <Form.Item name='abstract' label='Mô tả'>
              <Input.TextArea />
            </Form.Item>
          </>
        )}
        {(userInfo.roles.includes(EAdminRole.BKL) || isSuperAdmin(true)) && (
          <>
            <Form.Item name={['zoom', 'link']} label='Link Zoom'>
              <Input placeholder='Link zoom' />
            </Form.Item>
            <Form.Item name={['zoom', 'meeting_id']} label='ID'>
              <Input placeholder='ID' />
            </Form.Item>
            <Form.Item name={['zoom', 'passcode']} label='Mật khẩu'>
              <Input placeholder='Mật khẩu' />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default ModalAdd
