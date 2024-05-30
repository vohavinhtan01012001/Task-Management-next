import React from 'react'

interface Props {
    children: any;
    className?: string;
    onClick?: any;
}

export default function ButtonHover({ children, className, onClick }: Props) {
    return (
        <button className={`hover:bg-gray-100 text-center px-2 py-1  hover:text-gray-700 text-gray-500 rounded-lg ${className}`} onClick={onClick}>{children}</button>
    )
}
