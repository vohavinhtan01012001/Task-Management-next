import React from 'react'

interface Props {
    style?: any,
    required?: boolean,
    color?: string | '#333',
    children: string,
}


export default function LabelCustom({ style, required, color, children }: Props) {
    return (
        <>
            <label
                style={{ fontSize: "16px", color: color, position: "relative", ...style }}
                className={`
                        ${required ?
                        "after:content-['*'] after:text-red-600 after:absolute after:top-0 after:-right-[10px] after:font-bold"
                        : ""}`
                }
            >
                {children}
            </label>
        </>
    )
}
