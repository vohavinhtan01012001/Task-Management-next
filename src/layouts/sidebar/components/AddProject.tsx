import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Drawer, Switch, DatePicker, Select } from 'antd'; // Import DatePicker from Ant Design
import { useFormik } from 'formik';
import { projectSchema, projectType } from '@/schemaValidations/project.schema';
import { DownOutlined } from '@ant-design/icons';
import ColorPicker, { Color } from 'antd/es/color-picker';
import projectApiRequest from '@/apiRequests/project';
import { toast } from 'react-toastify';
import ButtonSubmit from '@/components/ButtonSubmit';
import LabelCustom from '@/components/LabelCustom';

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    setProjects: Dispatch<SetStateAction<projectType[]>>;
    projects: projectType[];
    setProjectsFavorite: Dispatch<SetStateAction<projectType[]>>;
    projectsFavorite: projectType[];
}

export default function AddProject({ open, setOpen, setProjects, projects, setProjectsFavorite, projectsFavorite }: Props) {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [valueColor, setValueColor] = useState<string>("#000");
    const [favorite, setFavorite] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            favorite: 0,
            color: '#000',
            userId: '',
        },
        validationSchema: projectSchema,
        onSubmit: async (values) => {
            const userJsonString = localStorage.getItem('user');
            if (userJsonString !== null) {
                const userJson = JSON.parse(userJsonString);
                if (favorite) {
                    values.favorite = 1;
                }
                else {
                    values.favorite = 0;
                }
                values.userId = userJson.id;
                values.color = valueColor;
                try {
                    console.log(values)
                    setConfirmLoading(true)
                    const res: any = await projectApiRequest.addProject(values);
                    if (values.favorite == 1) {
                        setProjectsFavorite([...projectsFavorite, res.payload.project])
                    }
                    else {
                        setProjects([...projects, res.payload.project])
                    }
                    toast.success(res.payload.status.message, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    handleCancel()
                } catch (error: any) {
                    toast.error(error.payload.message, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    console.log(error)
                } finally {
                    setConfirmLoading(false)
                }
            }
        },
    });

    const handleCancel = () => {
        formik.resetForm();
        setFavorite(false);
        setValueColor('#000');
        setOpenColor(false)
        setOpen(false);
    };

    return (
        <>
            <Drawer
                title={<p className='text-green-700 font-bold text-base' >Create My Project</p>}
                open={open}
                width={700}
                onClose={handleCancel}
            >
                <form onSubmit={formik.handleSubmit} className='pb-4 px-4'>
                    {/* Title */}
                    <div className="pb-[20px]">
                        <div className='flex items-center justify-between '>
                            <LabelCustom required>Title: </LabelCustom>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className='ml-3 p-1 border rounded-lg text-base outline-none w-[80%]'
                                onChange={formik.handleChange}
                                value={formik.values.title}
                            />
                        </div>
                        <div className='text-center text-red-600'>
                            {formik.errors.title && formik.touched.title && (
                                <div>{formik.errors.title}</div>
                            )}
                        </div>
                    </div>

                    {/* Favorite */}
                    <div className="pb-[20px]">
                        <div className=''>
                            <LabelCustom style={{ paddingRight: "30px" }}>Favorite:</LabelCustom>
                            <Switch
                                value={favorite}
                                defaultChecked={false}
                                onChange={setFavorite}
                                className='ml-[35px]'
                                style={{
                                    backgroundColor: `${favorite ? "rgb(20, 83, 45)" : ""}`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Color */}
                    <div className="pb-[20px]">
                        <div className=''>
                            <LabelCustom style={{ paddingRight: "50px" }}>Color:</LabelCustom>
                            <ColorPicker
                                defaultValue="#000"
                                className='ml-[30px]'
                                open={openColor}
                                value={valueColor}
                                onChange={(value: Color, hex: string) => setValueColor(hex)}
                                onOpenChange={setOpenColor}
                                showText={() => (
                                    <DownOutlined
                                        rotate={openColor ? 180 : 0}
                                        style={{
                                            color: 'rgba(0, 0, 0, 0.25)',
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="pb-[20px]">
                        <div className='flex items-center justify-between'>
                            <LabelCustom required>Description:</LabelCustom>
                            <textarea
                                id="description"
                                className='ml-3 p-1 border rounded-lg text-base outline-none w-[80%]'
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                        </div>
                        <div className='text-center text-red-600'>
                            {formik.errors.description && formik.touched.description && (
                                <div>{formik.errors.description}</div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className=' h-8 mx-auto text-center'>
                        <ButtonSubmit type='submit' loading={confirmLoading}>Save Changes</ButtonSubmit>
                    </div>
                </form >
            </Drawer>
        </>
    );
}
