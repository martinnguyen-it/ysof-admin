import { EDocumentType, EGoogleFileType } from '@domain/document'

export const EDocumentTypeDetail: { [key in EDocumentType]: string } = {
  [EDocumentType.ANNUAL]: 'Hằng năm',
  [EDocumentType.COMMON]: 'Trong năm',
  [EDocumentType.INTERNAL]: 'Nội bộ ban',
  [EDocumentType.STUDENT]: 'Dành cho học viên',
}
export const EGoogleFileTypeDetail: { [key in EGoogleFileType]: string } = {
  [EGoogleFileType.SPREAD_SHEET]: 'Google trang tính',
  [EGoogleFileType.DOCUMENT]: 'Google tài liệu',
}

export const DOCUMENT_LABEL = ['Tài liệu đầu năm', 'Tài liệu tuyển sinh', 'Tài liệu chung']

export const OPTIONS_DOCUMENT_LABEL = DOCUMENT_LABEL.map((value) => ({
  value,
  label: value,
}))

export const OPTIONS_DOCUMENT_TYPE = Object.keys(EDocumentTypeDetail).map((key) => ({
  value: key,
  label: EDocumentTypeDetail[key as EDocumentType],
}))

export const OPTIONS_GOOGLE_FILE_TYPE = Object.keys(EGoogleFileTypeDetail).map((key) => ({
  value: key,
  label: EGoogleFileTypeDetail[key as EGoogleFileType],
}))

export const OPTIONS_MODE_FILE = [
  {
    value: 'file',
    label: 'Tải file lên từ máy',
  },
  {
    value: 'google',
    label: 'Tạo file từ google',
  },
]
