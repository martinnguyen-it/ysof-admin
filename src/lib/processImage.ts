// Function to crop, rotate, and return as Blob
export const getCroppedImg = (
  imageSrc: string,
  croppedAreaPixels: any
): Promise<Blob> => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, 'image/jpeg')
    }
  })
}
// Function to compress image
export const compressImage = (
  imageBlob: Blob,
  maxSize: number
): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(imageBlob)
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const maxWidth = 300
        const scaleFactor = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleFactor

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxSize) {
              resolve(blob)
            } else {
              canvas.toBlob(
                (compressedBlob) => {
                  resolve(compressedBlob!)
                },
                'image/jpeg',
                0.7
              )
            }
          },
          'image/jpeg',
          0.8
        )
      }
    }
  })
}
