import { IStudentInSubject } from '@domain/subject/subjectRegistration'
import { getListSubjectRegistrationsBySubjectId } from '@src/services/subjectRegistration'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { isArray, size } from 'lodash'
import { FC, useEffect, useState } from 'react'

interface IProps {
  subjectId: string
}

const TableStudent: FC<IProps> = ({ subjectId }) => {
  const [tableData, setTableData] = useState<IStudentInSubject[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const data = await getListSubjectRegistrationsBySubjectId(subjectId)
      if (isArray(data)) {
        setTableData(data)
      }
      setIsLoading(false)
    })()
  }, [])

  const columns: ColumnsType<IStudentInSubject> = [
    {
      title: 'MSHV',
      dataIndex: 'numerical_order',
      align: 'center',
      key: 'numerical_order',
      render: (_, record: IStudentInSubject) => String(record.seasons_info[record.seasons_info.length - 1].numerical_order).padStart(3, '0'),
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      align: 'center',
      key: 'group',
      render: (_, record: IStudentInSubject) => record.seasons_info[record.seasons_info.length - 1].group,
    },
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (_, record: IStudentInSubject) => (
        <>
          {record.holy_name} {record.full_name}
        </>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ]
  return (
    <div>
      <div className='flex justify-center text-2xl font-bold'>DANH SÁCH HỌC VIÊN ĐĂNG KÝ</div>
      <p className='my-3 font-semibold'>Tổng: {size(tableData) || 0}</p>
      <Table
        showSorterTooltip={{ target: 'sorter-icon' }}
        columns={columns}
        className='text-wrap'
        rowKey='id'
        pagination={false}
        dataSource={tableData}
        loading={isLoading}
        scroll={{ x: 800 }}
        bordered
      />
    </div>
  )
}

export default TableStudent
