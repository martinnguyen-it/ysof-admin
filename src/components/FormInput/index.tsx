import React, { useState } from 'react'

type Props = {
  label: string
  error?: string
  className?: string
} & React.HTMLProps<HTMLInputElement>

const FormInput = React.forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
  const [type, setType] = useState<React.HTMLInputTypeAttribute>(rest.type || 'text')
  const onChange = () => {
    setType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  return (
    <div className={`flex w-full flex-col space-y-[6px] ${className}`}>
      <label className='text-xs md:text-sm' htmlFor={label.replace(' ', '')}>
        {label}
      </label>
      <div className='text-cinder flex w-full rounded-md border border-[#EBEBEB] px-[13px] py-[10px] text-xs md:py-[14px] md:text-sm'>
        <input {...rest} type={type} ref={ref} id={label.replace(' ', '')} className='w-full bg-white outline-none focus:outline-none' />
        {rest.type && rest.type === 'password' ? <img src='/icons/show-password.svg' alt='' height={16} width={16} onClick={onChange} /> : <></>}
      </div>
      {error && <span className='text-xs italic text-red-700'>{error}</span>}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput
