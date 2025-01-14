import { userInfoState } from '@atom/authAtom'
import { OPTIONS_ROLE } from '@constants/index'
import { EAdminRoleDetail } from '@domain/admin/type'
import { isSuperAdmin } from '@src/utils'
import { DatePicker, DatePickerProps, Form, Input, Modal, Select } from 'antd'
import { isEmpty, isObject, size } from 'lodash'
import React, { Dispatch, FC, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { IGeneralTaskInResponse } from '@domain/generalTask'
import { OPTIONS_GENERAL_TASK_LABEL, OPTIONS_GENERAL_TASK_TYPE } from '@constants/generalTask'
import { useQuill } from 'react-quilljs'
import { useDebounce } from '@src/hooks/useDebounce'
import dayjs from 'dayjs'
import 'quill/dist/quill.snow.css' // Add css for snow theme
import { IOpenFormWithMode } from '@domain/common'
import { selectSeasonState } from '@atom/seasonAtom'
import { useGetListDocuments } from '@src/apis/document/useQueryDocument'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateGeneralTask, useUpdateGeneralTask } from '@src/apis/generalTask/useMutationGeneralTask'

interface IProps {
  open: IOpenFormWithMode<IGeneralTaskInResponse>
  setOpen: Dispatch<React.SetStateAction<IOpenFormWithMode<IGeneralTaskInResponse>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const [searchDocuments, setSearchDocuments] = useState('')
  const [startAt, setStartAt] = useState<string>()
  const [endAt, setEndAt] = useState<string>()
  const userInfo = useRecoilValue(userInfoState)
  const { quill, quillRef } = useQuill()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        form.setFieldValue('description', quill.root.innerHTML)
      })
    }
  }, [quill])

  useEffect(() => {
    if (quill) {
      if (open && open?.item) {
        quill.clipboard.dangerouslyPasteHTML(open.item.description)
      } else {
        quill.clipboard.dangerouslyPasteHTML('')
      }
    }
  }, [open, quill])

  const searchDebounce = useDebounce(searchDocuments, 300)

  const season = useRecoilValue(selectSeasonState)
  const { data: documents, isLoading: loadingGetDocuments } = useGetListDocuments({ search: searchDebounce, season })

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListGeneralTasks'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, mode: 'add' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateGeneralTask(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateGeneralTask(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_start_at
      delete data.date_end_at
      if (open?.item) {
        mutateUpdate({
          id: open.item.id,
          data: { ...data, start_at: startAt, end_at: endAt && endAt !== 'Invalid Date' ? endAt : undefined },
        })
      } else {
        mutateCreate({ ...data, start_at: startAt, end_at: endAt && endAt !== 'Invalid Date' ? endAt : undefined })
      }
    } catch {
      /* empty */
    }
  }

  const documentOptions = useMemo(
    () =>
      documents && size(documents?.data)
        ? documents.data.map((item) => ({
            value: item.id,
            label: (
              <span className='flex items-center'>
                <img className='mr-1 size-4 object-cover' src={`https://drive-thirdparty.googleusercontent.com/64/type/${item?.mimeType}`}></img>
                {item.name}
              </span>
            ),
          }))
        : [],
    [documents],
  )

  const handleCancel = () => {
    setOpen({ active: false, mode: 'add' })
  }

  useEffect(() => {
    if (open?.item)
      form.setFieldsValue({
        ...open.item,
        attachments: open.item.attachments ? open.item.attachments.map((item) => item.id) : [],
        date_start_at: dayjs(open.item.start_at, 'YYYY-MM-DD'),
        date_end_at: open.item.end_at ? dayjs(open.item.end_at, 'YYYY-MM-DD') : undefined,
      })
    else form.resetFields()
  }, [open])

  const optionsRole = useMemo(() => {
    if (isSuperAdmin()) return OPTIONS_ROLE
    return (
      (userInfo &&
        userInfo.roles.map((val) => ({
          value: val,
          label: EAdminRoleDetail[val],
        }))) ||
      []
    )
  }, [userInfo])

  const onSearchDocument = (val: string) => {
    setSearchDocuments(val)
  }

  const onChangeStartAt: DatePickerProps['onChange'] = (_, dateString) => {
    setStartAt(dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  }
  const onChangeEndAt: DatePickerProps['onChange'] = (_, dateString) => {
    setEndAt(dayjs(dateString as unknown as string, 'DD/MM/YYYY').format('YYYY-MM-DD'))
  }

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate || isPendingUpdate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
      width={'80%'}
    >
      <Form layout='vertical' form={form} name='form-add-general-task'>
        <Form.Item
          name='title'
          label='Tiêu đề'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhâp tiêu đề',
            },
          ]}
        >
          <Input placeholder='Tiêu đề công việc' />
        </Form.Item>
        <Form.Item
          label='Loại'
          name='type'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại công việc',
            },
          ]}
        >
          <Select placeholder='Chọn loại công việc' options={OPTIONS_GENERAL_TASK_TYPE} />
        </Form.Item>
        <Form.Item
          name='role'
          label='Quản lý'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ban',
            },
          ]}
        >
          <Select
            placeholder='Chọn ban'
            options={optionsRole}
            showSearch
            filterOption={(input, option) =>
              isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
          />
        </Form.Item>
        <Form.Item name='label' label='Nhãn công việc'>
          <Select
            filterOption={(input, option) =>
              isObject(option) && (option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0)
            }
            placeholder='Chọn nhãn công việc'
            options={OPTIONS_GENERAL_TASK_LABEL}
            mode='multiple'
            allowClear
          />
        </Form.Item>
        <div className='flex gap-5'>
          <Form.Item
            name='date_start_at'
            label='Ngày bắt đầu'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày bắt đầu',
              },
            ]}
          >
            <DatePicker format={'DD/MM/YYYY'} onChange={onChangeStartAt} />
          </Form.Item>
          <Form.Item name='date_end_at' label='Ngày kết thúc'>
            <DatePicker format={'DD/MM/YYYY'} onChange={onChangeEndAt} minDate={startAt ? dayjs(startAt as unknown as Date) : undefined} />
          </Form.Item>
        </div>
        <Form.Item label='Mô tả ngắn' name='short_desc'>
          <Input.TextArea placeholder='Nhập mô tả' />
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
        <Form.Item name='description' className='hidden'>
          <Input.TextArea />
        </Form.Item>
        <div className='ant-form-item css-dev-only-do-not-override-qn5m80'>
          <div className='ant-row ant-form-item-row css-dev-only-do-not-override-qn5m80'>
            <div className='ant-col ant-form-item-label css-dev-only-do-not-override-qn5m80'>
              <label htmlFor='form-season_role' className='ant-form-item-required'>
                Mô tả
              </label>
            </div>
            <div className='ant-col ant-form-item-control css-dev-only-do-not-override-qn5m80'>
              <div className='ant-form-item-control-input'>
                <div className='ant-form-item-control-input-content'>
                  <div ref={quillRef}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default ModalAdd
