import { IDocumentInResponse, IListDocumentInResponse, IParamsGetListDocument } from '@domain/document'
import { useQueryErrorToast } from '@src/hooks/useQueryErrorToast'
import { getDocumentDetail, getListDocuments } from '@src/services/document'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useGetListDocuments = (params?: IParamsGetListDocument, props?: Partial<UseQueryOptions<IListDocumentInResponse, AxiosError>>) => {
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
