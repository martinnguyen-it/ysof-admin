import { selectSeasonState } from '@atom/seasonAtom'
import { IOpenForm } from '@domain/common'
import { IStudentInResponse } from '@domain/student'
import { ISubjectAbsentInResponse } from '@domain/subject/subjectAbsent'
import { useDebounce } from '@src/hooks/useDebounce'
import { getListStudents } from '@src/services/student'
import { createSubjectAbsents, updateSubjectAbsents } from '@src/services/subjectAbsent'
import { Form, Input, Modal, Select } from 'antd'
import { isEmpty, isObject } from 'lodash'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'

interface IProps {
  open: Required<IOpenForm<ISubjectAbsentInResponse | string>>
  setOpen: React.Dispatch<React.SetStateAction<Required<IOpenForm<ISubjectAbsentInResponse | string>>>>
  setReloadData: React.DispatchWithoutAction
}

const ModalAdd: FC<IProps> = ({ open, setOpen, setReloadData }) => {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [searchStudents, setSearchStudents] = useState('')
  const [loadingGetStudents, setLoadingGetStudents] = useState(false)
  const [students, setStudents] = useState<IStudentInResponse[]>([])

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      let res: ISubjectAbsentInResponse
      if (isObject(open?.item)) {
        res = await updateSubjectAbsents(open.item?.subject.id, open.item?.student.id, { reason: data?.reason, note: data?.note })
        if (!isEmpty(res)) {
          toast.success('Sửa thành công')
          setOpen({ active: false, item: '' })
          setReloadData()
        }
      } else {
        res = await createSubjectAbsents(open.item, data.student, { reason: data?.reason, note: data?.note })
        if (!isEmpty(res)) {
          toast.success('Thêm thành công')
          setOpen({ active: false, item: '' })
          setReloadData()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }

    setConfirmLoading(false)
  }

  const searchDebounce = useDebounce(searchStudents, 300)

  const season = useRecoilValue(selectSeasonState)
  useEffect(() => {
    ;(async () => {
      setLoadingGetStudents(true)
      const res = await getListStudents({ search: searchDebounce })
      if (!isEmpty(res)) {
        setStudents(res.data)
      }
      setLoadingGetStudents(false)
    })()
  }, [searchDebounce, season])

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
            {item.numerical_order} {item.holy_name} {item.full_name}
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
      confirmLoading={confirmLoading}
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
            <Select placeholder='Chọn học viên' onSearch={onSearchStudent} filterOption={() => true} allowClear showSearch options={studentOptions} loading={loadingGetStudents} />
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
