import { IOpenForm } from '@domain/common'
import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'
import { useGetListStudents } from '@src/apis/student/useQueryStudent'
import { useCreateSubjectAbsents, useUpdateSubjectAbsents } from '@src/apis/subjectAbsent/useMutationSubjectAbsent'
import { useDebounce } from '@src/hooks/useDebounce'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Input, Modal, Select } from 'antd'
import { isEmpty, isObject } from 'lodash'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

interface IProps {
  open: Required<IOpenForm<ISubjectAbsentInResponse | string>>
  setOpen: React.Dispatch<React.SetStateAction<Required<IOpenForm<ISubjectAbsentInResponse | string>>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm()
  const [searchStudents, setSearchStudents] = useState('')

  const queryClient = useQueryClient()

  const isUpdateForm = !isEmpty(open?.item)

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjectAbsents'] })
    if (isUpdateForm) toast.success('Sửa thành công')
    else toast.success('Thêm thành công')
    setOpen({ active: false, item: '' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateSubjectAbsents(onSuccess)
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateSubjectAbsents(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      delete data.date_of_birth_temp
      if (isObject(open?.item)) {
        mutateUpdate({
          subjectId: open.item.subject.id,
          studentId: open.item.student.id,
          data: { reason: data?.reason, note: data?.note },
        })
      } else {
        mutateCreate({ subjectId: open.item, studentId: data.student, data: { reason: data?.reason, note: data?.note } })
      }
    } catch {}
  }

  const searchDebounce = useDebounce(searchStudents, 300)

  const { data, isLoading } = useGetListStudents({
    search: searchDebounce,
  })
  const students = data?.data || []

  const handleCancel = () => {
    setOpen({ active: false, item: '' })
  }

  useEffect(() => {
    if (open?.item) form.setFieldsValue(open.item)
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
            {item.seasons_info[item.seasons_info.length - 1].numerical_order} {item.holy_name} {item.full_name}
          </>
        ),
      })),
    [students],
  )

  return (
    <Modal
      title={open.item ? 'Sửa' : 'Thêm'}
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate || isPendingUpdate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText={open.item ? 'Sửa' : 'Thêm'}
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
            <Select placeholder='Chọn học viên' onSearch={onSearchStudent} filterOption={() => true} allowClear showSearch options={studentOptions} loading={isLoading} />
          </Form.Item>
        ) : null}
        <Form.Item label='Lý do' name='reason'>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label='Ghi chú' name='note'>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
