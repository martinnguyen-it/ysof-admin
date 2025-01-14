import { IManageFormInPayload } from '@domain/manageForm'
import { updateManageForm } from '@src/services/manageForm'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useUpdateManageForm = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: (data: IManageFormInPayload) => updateManageForm(data),
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
    onSuccess,
  })
