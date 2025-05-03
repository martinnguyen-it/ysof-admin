import React, { FC, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useCreateSubjectAbsents,
  useUpdateSubjectAbsents,
} from '@/apis/subjectAbsent/useMutationSubjectAbsent'
import { useGetListSubjectRegistrationsBySubjectId } from '@/apis/subjectRegistration/useQuerySubjectRegistration'
import { IOpenForm } from '@/domain/common'
import {
  EAbsentType,
  ICreateSubjectAbsent,
  ISubjectAbsentInResponse,
} from '@/domain/subject/subjectAbsent'
import { Form, Input, Modal, Select } from 'antd'
import { isEmpty, isObject } from 'lodash'
import { toast } from 'react-toastify'
import { OPTIONS_ABSENT_TYPE } from '@/constants/subjectAbsent'
import { useDebounce } from '@/hooks/useDebounce'

interface IProps {
  open: Required<IOpenForm<ISubjectAbsentInResponse | string>>
  setOpen: React.Dispatch<
    React.SetStateAction<Required<IOpenForm<ISubjectAbsentInResponse | string>>>
  >
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm<ICreateSubjectAbsent & { student: string }>()
  const [searchStudents, setSearchStudents] = useState('')

  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjectAbsents'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, item: '' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateSubjectAbsents(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateSubjectAbsents(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      if (isObject(open?.item)) {
        mutateUpdate({
          subjectId: open.item.subject.id,
          studentId: open.item.student.id,
          data,
        })
      } else {
        mutateCreate({
          subjectId: open.item,
          studentId: data.student,
          data,
        })
      }
    } catch {}
  }

  const searchDebounce = useDebounce(searchStudents, 300)

  const { data: students = [], isLoading } =
    useGetListSubjectRegistrationsBySubjectId(
      isObject(open?.item) ? open.item.subject.id : open.item,
      searchDebounce || undefined
    )

  const handleCancel = () => {
    setOpen({ active: false, item: '' })
  }

  useEffect(() => {
    if (open?.item && typeof open.item !== 'string')
      form.setFieldsValue({ ...open.item, student: open.item.student.id })
  }, [open])

  const onSearchStudent = (val: string) => {
    setSearchStudents(val)
  }

  const studentOptions = useMemo(
    () =>
      students.map((item) => ({
        value: item.id,
        label: (
          <>
            {item.seasons_info[item.seasons_info.length - 1].numerical_order}{' '}
            {item.holy_name} {item.full_name}
          </>
        ),
      })),
    [students]
  )

  return (
    <Modal
      title={isObject(open.item) ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate || isPendingUpdate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={isObject(open.item) ? 'Sửa' : 'Thêm'}
    >
      <Form layout='vertical' form={form} name='form-subject-absent'>
        {!isObject(open.item) ? (
          <Form.Item
            name='student'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn học viên',
              },
            ]}
            label='Học viên'
          >
            <Select
              placeholder='Chọn học viên'
              onSearch={onSearchStudent}
              filterOption={() => true}
              allowClear
              showSearch
              options={studentOptions}
              loading={isLoading}
            />
          </Form.Item>
        ) : (
          <Form.Item label='Học viên'>
            <Input
              disabled
              value={
                open.item.student.seasons_info[
                  open.item.student.seasons_info.length - 1
                ].numerical_order +
                ' ' +
                open.item.student.holy_name +
                ' ' +
                open.item.student.full_name
              }
            />
          </Form.Item>
        )}
        <Form.Item label='Lý do' name='reason'>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label='Loại'
          name='type'
          initialValue={EAbsentType.NO_ATTEND}
        >
          <Select options={OPTIONS_ABSENT_TYPE} />
        </Form.Item>

        <Form.Item label='Ghi chú (Học viên không thấy phần này)' name='note'>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
