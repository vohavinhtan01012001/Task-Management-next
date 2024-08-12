import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';


interface Props {
    open: boolean;
    handleCancel: () => void;
    icon: FontAwesomeIconProps["icon"];
    title: string;
    titleButtonOk: string;
    titleButtonCancel: string;
    onClickOk: () => void;
}

const ConFirmDialog: React.FC<Props> = (
    {
        icon,
        title,
        onClickOk,
        open,
        handleCancel,
        titleButtonCancel,
        titleButtonOk
    }) => {
    return (
        <>
            <Modal open={open} footer={null} onCancel={() => handleCancel()}>
                <motion.div className='block'>
                    <div className='block w-full'>
                        <div className='block w-full text-center py-[15px]'>
                            <FontAwesomeIcon icon={icon} className='font-bold text-gray-600 text-6xl' />
                        </div>
                        <div className='text-center'>
                            <p className='text-sm text-gray-700 font-medium'> {title}</p>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button className='text-sm px-3  ' onClick={() => handleCancel()}>{titleButtonCancel}</button>
                        <button className='text-sm px-3 bg-green-500 text-white rounded-sm h-[25px] w-[100px]' onClick={onClickOk}>{titleButtonOk}</button>
                    </div>
                </motion.div>
            </Modal>
        </>
    );
};

export default ConFirmDialog;