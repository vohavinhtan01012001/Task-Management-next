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
            <label style={{ fontSize: "16px", color: color, ...style }}> {
                children
            } </label >
            {
                required && <span style={{ color: "red" }}>*</span>
            }
        </>
    )
}
