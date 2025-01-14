import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const useQueryErrorToast = (isError: boolean, message: string) => {
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
  }, [isError])
}
