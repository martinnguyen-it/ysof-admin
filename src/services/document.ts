import { ICreateDocumentGoogle, ICreateDocumentWithFile, IDocumentInResponse, IListDocumentInResponse, IParamsGetListDocument, IUpdateDocument } from '@domain/document'
import { del, get, put, post } from './HTTPService'
import { API_LIST } from '@constants/index'

export const getListDocuments = async (params?: IParamsGetListDocument): Promise<IListDocumentInResponse> => {
  const response = await get({
    url: API_LIST.document,
    data: params,
  })
  return response?.data
}

export const getDocumentDetail = async (id: string): Promise<IDocumentInResponse> => {
  const response = await get({
    url: API_LIST.document + '/' + id,
  })
  return response?.data
}

export const createDocumentWithFile = async (data: ICreateDocumentWithFile): Promise<IDocumentInResponse> => {
  const formData = new FormData()
  formData.append('file', new Blob([data.file]))
  formData.append('payload', JSON.stringify(data.payload))
  const response = await post({
    url: API_LIST.document + '/file',
    data: formData,
  })
  return response?.data
}

export const createDocumentGoogle = async (data: ICreateDocumentGoogle): Promise<IDocumentInResponse> => {
  const response = await post({
    url: API_LIST.document + '/google',
    data,
  })
  return response?.data
}

export const updateDocument = async (id: string, data: IUpdateDocument): Promise<IDocumentInResponse> => {
  const formData = new FormData()
  if (data?.file) {
    formData.append('file', new Blob([data.file]))
  }
  formData.append('payload', JSON.stringify(data.payload))

  const response = await put({
    url: API_LIST.document + '/' + id,
    data: formData,
  })
  return response?.data
}

export const deleteDocument = async (id: string): Promise<IDocumentInResponse> => {
  const response = await del({
    url: API_LIST.document + '/' + id,
  })
  return response?.data
}
