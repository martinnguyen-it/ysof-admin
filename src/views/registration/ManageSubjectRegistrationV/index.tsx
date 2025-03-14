import { FC, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateManageForm } from '@/apis/manageForm/useMutationManageForm'
import { useGetManageForm } from '@/apis/manageForm/useQueryManageForm'
import { useGetListSubjects } from '@/apis/subject/useQuerySubject'
import { currentSeasonState } from '@/atom/seasonAtom'
import {
  EManageFormStatus,
  EManageFormType,
  IManageFormInPayload,
} from '@/domain/manageForm'
import { Button, Input, Spin } from 'antd'
import dayjs from 'dayjs'
import { isEmpty, size } from 'lodash'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'
import { EManageFormStatusDetail } from '@/constants/manageForm'

const ManageSubjectRegistrationV: FC = () => {
  const queryClient = useQueryClient()
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingClose, setIsLoadingClose] = useState(false)
  const currentSeason = useRecoilValue(currentSeasonState)
  const [value, setValue] = useState(`Bạn thân mến,
YSOF thông báo đến bạn về việc đăng ký môn học của Trường Học Đức Tin Cho Người Trẻ - YSOF, niên khóa ${currentSeason?.academic_year || '202x-202x'}.
Thời gian đăng ký: Từ khi ra thông báo tới 23:59 ngày xx/xx/202x. Sau thời gian trên, form đăng ký sẽ được khóa và Ban Tổ Chức sẽ không nhận thêm bất cứ lượt đăng
ký nào của học viên.`)

  const { data: listSubject, isLoading: isLoadingSubject } =
    useGetListSubjects()

  const { data: infoForm, isLoading: isLoadingForm } = useGetManageForm(
    EManageFormType.SUBJECT_REGISTRATION
  )

  useEffect(() => {
    if (infoForm?.data && infoForm.data?.content) {
      setValue(infoForm.data?.content)
    }
  }, [infoForm])

  const { mutateAsync } = useUpdateManageForm()
  const onSubmit = async () => {
    if (!value) {
      toast.error('Mô tả không được để trống')
      return
    }
    if (!size(listSubject)) {
      toast.error('Vui lòng tạo chủ đề trước')
      return
    }
    setIsLoadingSubmit(true)
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_REGISTRATION,
      status: EManageFormStatus.ACTIVE,
      data: {
        content: value,
      },
    }
    try {
      const res = await mutateAsync(payload)
      if (!isEmpty(res)) {
        if (infoForm?.data?.content === value)
          toast.success('Mở form thành công')
        else toast.success('Sửa thành công')
        queryClient.invalidateQueries({ queryKey: ['getManageForm'] })
      }
    } catch {}
    setIsLoadingSubmit(false)
  }
  const onClose = async () => {
    setIsLoadingClose(true)
    const payload: IManageFormInPayload = {
      type: EManageFormType.SUBJECT_REGISTRATION,
      status: EManageFormStatus.CLOSED,
    }
    try {
      const res = await mutateAsync(payload)
      if (!isEmpty(res)) {
        toast.success('Đóng form thành công')
        queryClient.invalidateQueries({ queryKey: ['getManageForm'] })
      }
    } catch {}
    setIsLoadingClose(false)
  }

  return (
    <>
      {isLoadingForm || isLoadingSubject ? (
        <div className='mt-20 flex w-full justify-center'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          <div className='rounded-xl bg-white px-10 py-6 shadow-lg'>
            <div className='flex justify-center text-2xl font-bold'>
              ĐĂNG KÝ MÔN HỌC - YSOF {currentSeason?.academic_year}
            </div>
            <div className='mt-3'>
              <span className='font-semibold'>Trạng thái:</span>{' '}
              {infoForm && (
                <span
                  className={`rounded-md px-2 py-1 ${
                    infoForm?.status === EManageFormStatus.ACTIVE
                      ? 'bg-green-100 text-green-700'
                      : infoForm?.status === EManageFormStatus.CLOSED
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {' '}
                  {EManageFormStatusDetail[infoForm?.status]}
                </span>
              )}
            </div>
            <div className='mt-4 text-sm'>
              <Input.TextArea
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                value={value}
              />
              <p className='px-2'>
                Nếu gặp trở ngại trong quá trình đăng ký môn học, bạn hãy phản
                hồi với chúng tôi qua địa chỉ email YSOF:{' '}
                <a className='text-blue-500' href='mailto:ysofsj@gmail.com'>
                  ysofsj@gmail.com
                </a>
                <br />
                <br />
                Trân trọng,
                <br />
                BTC YSOF.
              </p>
            </div>

            <div className='flex justify-end gap-3'>
              {infoForm?.status === EManageFormStatus.ACTIVE && (
                <Button
                  disabled={isLoadingClose}
                  loading={isLoadingClose}
                  className='mt-2 bg-red-500 hover:!bg-red-500/80'
                  onClick={onClose}
                  type='primary'
                >
                  Đóng form
                </Button>
              )}
              <Button
                disabled={
                  isLoadingSubmit ||
                  (infoForm?.data?.content === value &&
                    infoForm?.status === EManageFormStatus.ACTIVE)
                }
                loading={isLoadingSubmit}
                className='mt-2'
                onClick={onSubmit}
                type='primary'
              >
                {infoForm?.status !== EManageFormStatus.ACTIVE
                  ? 'Mở form'
                  : 'Sửa form'}
              </Button>
            </div>
          </div>
          <div className='my-4 rounded-xl bg-white'>
            <div className='text-center text-lg font-medium'>
              Danh sách chủ đề
            </div>
            <div className='mt-5 flex justify-center'>
              <div className='flex max-w-5xl flex-col gap-2'>
                {listSubject && size(listSubject) > 0 ? (
                  listSubject.map((item, idx) => (
                    <span key={item.id} className='break-words'>
                      <span className='font-medium'>{idx + 1}.</span>{' '}
                      {dayjs(item.start_at).format('DD-MM-YYYY')} - {item.code}{' '}
                      - {item.title}
                    </span>
                  ))
                ) : (
                  <>Không có chủ đề</>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ManageSubjectRegistrationV
