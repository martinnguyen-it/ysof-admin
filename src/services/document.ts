import { ICreateDocumentGoogle, ICreateDocumentWithFile, IDocumentInResponse, IListDocumentInResponse, IParamsGetListDocument, IUpdateDocument } from '@domain/document'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListDocuments = (params?: IParamsGetListDocument): Promise<IListDocumentInResponse> => get(API_LIST.document, { params })

export const getDocumentDetail = (id: string): Promise<IDocumentInResponse> => get(API_LIST.document + '/' + id)

export const createDocumentWithFile = (data: ICreateDocumentWithFile): Promise<IDocumentInResponse> => {
  const formData = new FormData()
  formData.append('file', new Blob([data.file]))
  formData.append('payload', JSON.stringify(data.payload))

  return post(API_LIST.document + '/file', formData)
}

export const createDocumentGoogle = (data: ICreateDocumentGoogle): Promise<IDocumentInResponse> => post(API_LIST.document + '/google', data)

export const updateDocument = (id: string, data: IUpdateDocument): Promise<IDocumentInResponse> => {
  const formData = new FormData()
  if (data?.file) {
    formData.append('file', new Blob([data.file]))
  }
  formData.append('payload', JSON.stringify(data.payload))

  return put(API_LIST.document + '/' + id, formData)
}

export const deleteDocument = (id: string): Promise<IDocumentInResponse> => del(API_LIST.document + '/' + id)
