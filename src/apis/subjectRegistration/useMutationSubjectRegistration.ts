import { useMutation } from '@tanstack/react-query'
import { ICreateSubjectRegistration } from '@/domain/subject/subjectRegistration'
import { createSubjectRegistration } from '@/services/subjectRegistration'
import { toast } from 'react-toastify'

export const useCreateSubjectRegistration = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateSubjectRegistration) =>
      createSubjectRegistration(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
