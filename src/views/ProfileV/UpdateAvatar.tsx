import React, { useState, useCallback, useRef, useEffect } from 'react'
import { AxiosError } from 'axios'
import { useUpdateAvatar } from '@/apis/admin/useMutationAdmin'
import { userInfoState } from '@/atom/authAtom'
import { MAX_AVATAR_SIZE } from '@/constants'
import { EditOutlined } from '@ant-design/icons'
import { Modal, Slider } from 'antd'
import Cropper from 'react-easy-crop'
import { toast } from 'react-toastify'
import { useRecoilState } from 'recoil'
import { compressImage, getCroppedImg } from '@/lib/processImage'

const UpdateAvatar: React.FC = () => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState)

  const [avatar, setAvatar] = useState<string | null>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  const { mutateAsync: mutateUploadImage } = useUpdateAvatar()

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAvatar(userInfo?.avatar || null)
  }, [userInfo])

  const handleImageUpload = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Chỉ hỗ trợ định dạng JPEG và PNG.')
    } else {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setIsModalOpen(true)
      }
      reader.readAsDataURL(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setUploading(true)

    try {
      let croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

      if (croppedImage.size > MAX_AVATAR_SIZE) {
        croppedImage = await compressImage(croppedImage, MAX_AVATAR_SIZE)
      }

      const file = new File([croppedImage], 'avatar.jpg', {
        type: croppedImage.type,
      })
      const response = await mutateUploadImage(file)
      setUserInfo(response)
      toast.success('Cập nhật thành công.')
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
      }
    } finally {
      setUploading(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className='relative mx-auto h-32 w-32'>
      <div
        className='group relative h-full w-full cursor-pointer overflow-hidden rounded-full border'
        onClick={() => fileInputRef.current?.click()}
      >
        <img
          src={avatar || '/images/avatar.png'}
          referrerPolicy='no-referrer'
          alt='Avatar'
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition group-hover:opacity-100'>
          <EditOutlined className='text-xl text-white' />
        </div>
      </div>

      <input
        type='file'
        ref={fileInputRef}
        hidden
        accept='image/jpeg, image/png' // Restrict to jpeg and png
        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
      />

      <Modal
        title='Cập nhật ảnh'
        cancelText='Hủy'
        okText='Cập nhật'
        cancelButtonProps={{ disabled: uploading }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={uploadCroppedImage}
        confirmLoading={uploading}
      >
        <div className='relative h-64 w-full bg-gray-200'>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className='mt-2'>
          <p className='font-medium'>Zoom:</p>
          <Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
        </div>
      </Modal>
    </div>
  )
}

export default UpdateAvatar
