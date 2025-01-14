import { ICreateDocumentGoogle, ICreateDocumentWithFile, IUpdateDocument } from '@domain/document'
import { createDocumentGoogle, createDocumentWithFile, deleteDocument, updateDocument } from '@src/services/document'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useCreateDocumentWithFile = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateDocumentWithFile) => createDocumentWithFile(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useCreateDocumentGoogle = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: ICreateDocumentGoogle) => createDocumentGoogle(payload),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useUpdateDocument = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (payload: { id: string; data: IUpdateDocument }) => updateDocument(payload.id, payload.data),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })

export const useDeleteDocument = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess,
    onError: (error: Error) => {
      const { message } = error
      toast.error(message)
    },
  })
