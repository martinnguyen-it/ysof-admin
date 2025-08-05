import React, { FC, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetListStudents } from '@/apis/student/useQueryStudent'
import { useGetListSubjects } from '@/apis/subject/useQuerySubject'
import { useCreateSubjectRegistration } from '@/apis/subjectRegistration/useMutationSubjectRegistration'
import { useGetListSubjectRegistrations } from '@/apis/subjectRegistration/useQuerySubjectRegistration'
import { IOpenForm } from '@/domain/common'
import { IStudentInResponse } from '@/domain/student'
import { ICreateSubjectRegistration } from '@/domain/subject/subjectRegistration'
import { Checkbox, Form, Modal, Select } from 'antd'
import { toast } from 'react-toastify'
import { useDebounce } from '@/hooks/useDebounce'

interface IProps {
  open: Required<IOpenForm<string>>
  setOpen: React.Dispatch<React.SetStateAction<Required<IOpenForm<string>>>>
}

const ModalAdd: FC<IProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm<ICreateSubjectRegistration>()
  const [searchStudents, setSearchStudents] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState<string>(open.item)

  const queryClient = useQueryClient()

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getListSubjectRegistration'] })
    toast.success('Cập nhật thành công')
    setOpen({ active: false, item: '' })
  }

  const { mutate: mutateCreate, isPending: isPendingCreate } =
    useCreateSubjectRegistration(onSuccess)

  const handleOk = async () => {
    try {
      await form.validateFields()
      const data = form.getFieldsValue()
      mutateCreate(data)
    } catch {}
  }

  const searchDebounce = useDebounce(searchStudents, 300)

  const { data: studentsData, isLoading: isLoadingStudents } =
    useGetListStudents({
      page_index: 1,
      page_size: 50,
      search: searchDebounce || undefined,
    })

  const { data: subjects = [] } = useGetListSubjects()

  // Get all registration data to find current student's registrations
  const { data: allRegistrations } = useGetListSubjectRegistrations({
    page_index: 1,
    page_size: 500, // Get all to find the student
  })

  const handleCancel = () => {
    setOpen({ active: false, item: '' })
  }

  useEffect(() => {
    if (open.active) {
      form.resetFields()
    }
  }, [open, form])

  // When student is selected, update the subjects checkboxes with their current registrations
  useEffect(() => {
    if (selectedStudentId && allRegistrations?.data) {
      const studentData = allRegistrations.data.find(
        (item) => item.student.id === selectedStudentId
      )
      if (studentData) {
        form.setFieldValue('subjects', studentData.subject_registrations)
      }
    }
  }, [selectedStudentId, allRegistrations, form])

  const onSearchStudent = (val: string) => {
    setSearchStudents(val)
  }

  const studentOptions = useMemo(
    () =>
      studentsData?.data?.map((item: IStudentInResponse) => ({
        value: item.id,
        label: (
          <>
            {item.seasons_info[item.seasons_info.length - 1].numerical_order}{' '}
            {item.holy_name} {item.full_name}
          </>
        ),
      })) || [],
    [studentsData]
  )

  const onStudentChange = (value: string) => {
    setSelectedStudentId(value)
  }

  return (
    <Modal
      title='Cập nhật đăng ký môn học'
      open={open.active}
      onOk={handleOk}
      confirmLoading={isPendingCreate}
      onCancel={handleCancel}
      cancelText='Hủy'
      okText='Cập nhật'
      width={600}
    >
      <Form layout='vertical' form={form} name='form-subject-registration'>
        <Form.Item
          name='student_id'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn học viên',
            },
          ]}
          initialValue={selectedStudentId}
          label='Học viên'
        >
          <Select
            placeholder='Chọn học viên'
            onSearch={onSearchStudent}
            onChange={onStudentChange}
            filterOption={() => true}
            allowClear
            showSearch
            options={studentOptions}
            loading={isLoadingStudents}
          />
        </Form.Item>

        <Form.Item name='subjects' label='Môn học'>
          <Checkbox.Group className='w-full'>
            <div className='grid max-h-60 grid-cols-1 gap-2 overflow-y-auto'>
              {subjects?.map((item) => (
                <Checkbox key={item.id} value={item.id}>
                  {item.code} - {item.title}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAdd
