'use client'

import React from 'react'
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';
import styles from './button.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
interface Props {
    type?: "button" | "submit" | "reset" | undefined,
    onClick?: () => void,
    width?: number,
    height?: number,
    title: string,
    style?: any,
    loading?: boolean,
}


export default function ButtonCustom({ type, onClick, width, height, title, style, loading }: Props) {
    return (

        <>
            {
                loading ?
                    <button className={`${styles.buttonLoading}`} type={type ? type : 'button'} onClick={onClick} style={{ opacity: 0.5, width: width, height: "50px", ...style }}>
                        <FontAwesomeIcon icon={faSpinner} className='animate-spin text-3xl ' />
                    </button>
                    : <button className={styles.button} type={type ? type : 'button'} onClick={onClick} style={{ width: width, height: height, ...style }}>
                        {title}
                    </button>
            }
        </>

    )
}
