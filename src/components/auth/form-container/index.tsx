import type { PropsWithChildren } from 'react'
import React from 'react'

type Props = {
    title: string
    des: string
}

const FormContainer: React.FC<PropsWithChildren<Props>> = ({
    title,
    des,
    children,
}) => {
    return (
        <div className="mx-auto flex w-full max-w-[655px] flex-col items-center rounded-2xl border border-[#EBEBEB] bg-white p-4 shadow-lg md:p-8">
            <div className="mb-3 text-2xl font-semibold text-cinder md:text-[32px]">
                {title}
            </div>
            <p className="mb-6 text-center text-sm text-AuroMetalSaurus-primary md:mb-8 md:text-base">
                {des}
            </p>
            {children}
        </div>
    )
}

export default FormContainer
