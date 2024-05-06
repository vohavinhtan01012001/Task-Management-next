'use client'
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useFormik } from 'formik';
import { projectSchema } from '@/schemaValidations/project.schema';

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
}

export default function AddProject({ open, setOpen }: Props) {
    const [confirmLoading, setConfirmLoading] = useState(false);



    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            favorite: 0,
            color: '',
        },
        validationSchema: projectSchema,
        onSubmit: (values) => {
            // Handle form submission here
            console.log(values);
            handleOk(); // Example: Close modal after form submission
        },
    });

    return (
        <>
            <Modal
                title="Create My Project"
                open={open}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
                footer={null}
            >
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className='p-1 border rounded-lg w-full text-base outline-none'
                            onChange={formik.handleChange}
                            value={formik.values.title}
                        />
                        {formik.errors.title && formik.touched.title && (
                            <div>{formik.errors.title}</div> 
                        )}
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <div>{formik.errors.description}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="favorite">Favorite</label>
                        <input
                            id="favorite"
                            name="favorite"
                            type="number"
                            onChange={formik.handleChange}
                            value={formik.values.favorite}
                        />
                        {formik.errors.favorite && formik.touched.favorite && (
                            <div>{formik.errors.favorite}</div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="color">Color</label>
                        <input
                            id="color"
                            name="color"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.color}
                        />
                        {formik.errors.color && formik.touched.color && (
                            <div>{formik.errors.color}</div>
                        )}
                    </div>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </form >
            </Modal>
        </>
    );
}
