import { AxiosError } from 'axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  IDocumentInResponse,
  IListDocumentInResponse,
  IParamsGetListDocument,
} from '@/domain/document'
import { getDocumentDetail, getListDocuments } from '@/services/document'
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast'

export const useGetListDocuments = (
  params?: IParamsGetListDocument,
  props?: Partial<UseQueryOptions<IListDocumentInResponse, AxiosError>>
) => {
  const query = useQuery<IListDocumentInResponse, AxiosError>({
    queryKey: ['getListDocuments', params],
    queryFn: () => getListDocuments(params),
    ...props,
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}

export const useGetDocumentDetail = (id: string) => {
  const query = useQuery<IDocumentInResponse, AxiosError>({
    queryKey: ['getDocumentDetail', id],
    queryFn: () => getDocumentDetail(id),
  })
  useQueryErrorToast(query.isError, query?.error?.message!)

  return query
}
