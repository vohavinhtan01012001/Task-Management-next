import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { MouseEventHandler } from 'react'



interface Props {
    type?: "button" | "submit" | "reset" | undefined,
    onClick?: MouseEventHandler<HTMLButtonElement>;
    loading?: boolean;
    style?: any;
    children: string;
}

export default function ButtonSubmit({ type, onClick, style, loading, children }: Props) {
    return (
        <button type={type ? type : 'button'} onClick={onClick} style={{ backgroundColor: "rgb(187, 247, 208)", color: "rgb(20, 83, 45)", ...style }} className='shadow-md rounded-lg px-3 py-2 hover:opacity-80' >
            {
                loading ?
                    <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        {' '}
                    </>
                    : ""
            }
            {children}
        </button>
    )
}
