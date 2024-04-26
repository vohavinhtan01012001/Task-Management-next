'use client'

import React from 'react'
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';
interface Props {
    type?: string | 'button',
    onClick?: () => void,
    width?: number,
    height?: number,
    title: string,
    style?: any,
    loading?: boolean,
}


export default function ButtonCustom({ type, onClick, width, height, title, style, loading }: Props) {
    const colors1 = ['#6557e2', '#04BEFE'];
    const colors2 = ['#c72d12', '#af9067'];
    const getHoverColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors: string[]) =>
        colors.map((color) => new TinyColor(color).darken(5).toString());
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                        colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors2).join(', ')})`,
                        colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors2).join(', ')})`,
                        lineWidth: 0,
                    },
                },
            }}
        >
            <Button loading={loading} disabled={loading} onClick={onClick} type="primary" htmlType={type === "submit" ? "submit" : "button"} size="large" style={{ width: width, height: height, ...style }}>
                {title}
            </Button>
        </ConfigProvider >
    )
}
