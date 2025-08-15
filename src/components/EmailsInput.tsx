import React, { useState, useRef, useEffect, useCallback, FC } from 'react'
import { Input, Tag, Space, InputRef } from 'antd'

interface EmailsInputProps {
  value?: string[]
  onChange?: (emails: string[]) => void
  placeholder?: string
  disabled?: boolean
}

const EmailsInput: FC<EmailsInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Nhập email và nhấn Tab/Enter để thêm',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [shouldFocus, setShouldFocus] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const addEmail = useCallback(
    (email: string) => {
      const trimmedEmail = email.trim()
      if (
        trimmedEmail &&
        validateEmail(trimmedEmail) &&
        !value.includes(trimmedEmail)
      ) {
        const newEmails = [...value, trimmedEmail]
        onChange?.(newEmails)
        setInputValue('')
        setShouldFocus(true)
      }
    },
    [value, onChange]
  )

  const removeEmail = useCallback(
    (index: number) => {
      const newEmails = value.filter((_, i) => i !== index)
      onChange?.(newEmails)
      setShouldFocus(true)
    },
    [value, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addEmail(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last email when backspace is pressed on empty input
      removeEmail(value.length - 1)
    }
  }

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')

      // Split by common delimiters (tab, newline, comma, semicolon)
      const emails = pastedText
        .split(/[\t\n,;]/)
        .map((email) => email.trim())
        .filter((email) => email && validateEmail(email))

      // Add unique emails
      const uniqueEmails = emails.filter((email) => !value.includes(email))
      if (uniqueEmails.length > 0) {
        const newEmails = [...value, ...uniqueEmails]
        onChange?.(newEmails)
        setShouldFocus(true)
      }

      // Set remaining invalid text as input value
      const invalidEmails = pastedText
        .split(/[\t\n,;]/)
        .map((email) => email.trim())
        .filter((email) => email && !validateEmail(email))
        .join(', ')

      if (invalidEmails) {
        setInputValue(invalidEmails)
      }
    },
    [value, onChange]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleTagClose = (index: number) => {
    removeEmail(index)
  }

  // Handle focus after state changes
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
      setShouldFocus(false)
    }
  }, [shouldFocus])

  return (
    <div
      className='email-input-container min-h-[40px] rounded-md border border-gray-300 p-2'
      onClick={(e) => {
        // Don't focus if clicking on a tag or its close button
        if (
          e.target instanceof HTMLElement &&
          (e.target.closest('.ant-tag') ||
            e.target.closest('.ant-tag-close-icon'))
        ) {
          return
        }
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }}
    >
      <Space wrap className='w-full' size={[4, 4]}>
        {value.map((email, index) => (
          <Tag
            key={`${email}-${index}`}
            closable
            onClose={() => handleTagClose(index)}
            className='mb-1'
            color='blue'
            style={{ margin: '2px' }}
          >
            {email}
          </Tag>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className='min-w-[200px] flex-1 border-none shadow-none'
          size='middle'
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Space>
    </div>
  )
}

export default EmailsInput
