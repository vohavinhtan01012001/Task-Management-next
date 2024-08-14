'use client'

import sectionApiRequest from '@/apiRequests/section';
import TaskInSection from '@/app/(container)/project/[id]/TaskInSection';
import { sectionType } from '@/schemaValidations/section.schema';
import { faCopy, faEdit, faEllipsis, faShareNodes, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { DragEvent, useCallback, useEffect, useState } from 'react'
import { Button } from 'antd';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import projectApiRequest from '@/apiRequests/project';
import { projectType } from '@/schemaValidations/project.schema';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ConFirmDialog from '@/components/Confirm';

export default function Section() {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [sections, setSections] = useState<sectionType[]>([])
    const pathName = usePathname();
    const [showInputSection, setShowInputSection] = useState<boolean>(false)
    const [titleSection, setTitleSection] = useState<string>('')
    const [projectId, setProjectId] = useState<number>()
    const [isSectionAdded, setIsSectionAdded] = useState<number>(0)
    const [project, setProject] = useState<projectType>()
    const [user, setUser] = useState<any>({})
    const [showMenuSection, setShowMenuSection] = useState<number>(0)
    const [showInputTitle, setShowInputTitle] = useState<number>(0)
    const [inputTitle, setInputTitle] = useState<string>('')
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    useEffect(() => {
        const pathParts = pathName.split('/');
        console.log(pathParts[2])
        const path = parseInt(pathParts[2], 10);
        setProjectId(path)
    }, [pathName])

    useEffect(() => {
        const userJsonString = localStorage.getItem('user');
        if (userJsonString !== null) {
            setUser(JSON.parse(userJsonString))
        }
    }, [pathName])


    const handleSubmit = async () => {
        if (projectId && user?.id) {
            try {
                const res = await sectionApiRequest.addSection({ projectId: projectId, title: titleSection, userId: user.id })
                setShowInputSection(false)
                setSections([...sections, { ...res.payload.section }])
                setIsSectionAdded(res.payload.section.id)
                setTitleSection('');
            } catch (error: any) {
                toast.error(error.payload.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        }
    }

    const handleMouseMove = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const getSections = useCallback(async () => {
        try {
            if (projectId) {
                const project = await projectApiRequest.getById(projectId);
                const res = await sectionApiRequest.getAll(projectId);
                setSections(res.payload.sections);
                setProject(project.payload.project);
            }
        } catch (error) {
            console.log(error);
        }
    }, [projectId]);


    useEffect(() => {
        getSections()
    }, [getSections]);


    const [draggingElement, setDraggingElement] = useState<sectionType | null>(null);
    const [style, setStyle] = useState(0)
    const dragStart = (event: DragEvent<HTMLDivElement>, task: sectionType) => {
        setDraggingElement(task);
        // Add drag data
        event.dataTransfer.setData('text/plain', '');
        event.currentTarget.style.opacity = '1';
    };

    const dragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const dragEnter = (event: DragEvent<HTMLDivElement>, task: sectionType) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';
    };

    const dragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.style.opacity = '1';
    };

    const drop = async (event: DragEvent<HTMLDivElement>, section: sectionType) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';

        if (draggingElement && draggingElement.id !== section.id) {
            const draggingIndex = sections.findIndex(item => item.id === draggingElement.id);
            const targetIndex = sections.findIndex(item => item.id === section.id);

            const updateTask = [...sections];
            updateTask.splice(targetIndex, 0, updateTask.splice(draggingIndex, 1)[0]);
            setSections([...updateTask]);
            const sectionList = updateTask.map((task, index) => {
                return ({ id: task.id, priority: index });
            });
            console.log(sectionList);
            await sectionApiRequest.updatePriority(sectionList);
            setDraggingElement(null);
        }
    };

    const dragEnd = (event: any) => {
        event.currentTarget.style.opacity = '1';
        setDraggingElement(null);
        event.currentTarget.style.background = '#fff';
    };

    const actionHandlers: Record<string, (section: sectionType) => Promise<void> | void> = {
        Share: async (section: sectionType) => {

        },
        Copy: async (section: sectionType) => {
            try {
                const res = await sectionApiRequest.copySection(section.id);
                getSections();
                toast.success(res.payload.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            } catch (error: any) {
                toast.error(error.payload.message, {
                    position: toast.POSITION.TOP_RIGHT
                })
            }
        },
        Edit: async (section: sectionType) => {
            setShowInputTitle(section.id);
            setInputTitle(section.title);
        },
        Delete: async (section: sectionType) => {
            setShowConfirm(true);
            // try {
            //     const res = await sectionApiRequest.deleteSection(section.id);
            //     const dataIndex = sections.findIndex(s => s.id === section.id)
            //     if (dataIndex != -1) {
            //         sections.splice(dataIndex, 1);
            //     }
            //     setSections([...sections]);
            //     toast.success(res.payload.message, {
            //         position: toast.POSITION.TOP_RIGHT
            //     })
            // } catch (error: any) {
            //     toast.error(error.payload.message, {
            //         position: toast.POSITION.TOP_RIGHT
            //     })
            // }
        },
    }


    const handleActions = async (e: any, section: sectionType) => {
        const action = e.target.closest('button').name;
        if (!action) return;
        await actionHandlers[action](section);
        setShowMenuSection(0);
    }

    const handleUpdateTitle = async (section: sectionType) => {
        try {
            const res = await sectionApiRequest.updateSection(section.id, {
                title: inputTitle,
                projectId: section.projectId,
                userId: section.userId
            })

            const updateSection = sections.findIndex(s => s.id === section.id)
            if (updateSection != -1) {
                sections[updateSection].title = inputTitle;
            }
            setSections([...sections])
            setShowInputTitle(0);
            toast.success(res.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error: any) {
            toast.error(error.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }


    return (
        <div className=''>
            <h1 className='text-2xl font-bold font-serif'>{project?.title}</h1>
            <div className='container grid grid-cols-5 gap-6 mx-4 mt-2'>
                {
                    sections.map((section, index) => {
                        return (
                            <div key={index}
                                draggable={true}
                                onDragStart={(e: any) => dragStart(e, section)}
                                onDragOver={dragOver}
                                onDragEnter={(e: any) => dragEnter(e, section)}
                                onDragLeave={dragLeave}
                                onDrop={(e: any) => drop(e, section)}
                                onDragEnd={(e: any) => dragEnd(e)}
                                // initial={{ opacity: 0, x: -120 }}
                                // animate={{ opacity: 1, x: 0 }}
                                // transition={{
                                //     duration: 0.3,
                                //     delay: index * 0.1,
                                // }}
                                className={`${isHovered ? "" : "hover:shadow-md hover:cursor-grab  active:cursor-grabbing hover:border-gray-200"} 
                                    border w-[260px] h-auto border-transparent px-4 pt-4 pb-10 rounded-lg shadow relative active:*:opacity-45 active:border-none active:shadow-none`
                                }
                            >
                                <div >
                                    <div className={`flex ${showInputTitle === section.id ? 'items-start' : 'items-center'} justify-between pb-4`} >
                                        {
                                            showInputTitle === section.id ?
                                                <div className=''>
                                                    <input defaultValue={section.title} onChange={(e: any) => setInputTitle(e.target.value)} className='border px-2 py-1 rounded-lg outline-none ' />
                                                    <div className='py-2'>
                                                        <Button className=' text-gray-500 shadow-md hover:border-gray-500 hover:text-gray-500 font-bold mr-2' onClick={() => setShowInputTitle(0)}>Cancel</Button>
                                                        <Button
                                                            style={{ background: 'rgb(187, 247, 208)', borderColor: "rgb(187, 247, 208)" }}
                                                            className={` text-gray-500 shadow-md ${inputTitle == '' ? '' : 'hover:text-gray-500'} font-bold`}
                                                            disabled={inputTitle == '' ? true : false}
                                                            onClick={() => handleUpdateTitle(section)}
                                                        >
                                                            Ok
                                                        </Button>
                                                    </div>
                                                </div>
                                                :
                                                <h3 className=' text-base font-semibold text-gray-600'>{section.title}</h3>
                                        }
                                        <button className='hover:text-gray-800 text-gray-400 w-7 h-7' onClick={() => setShowMenuSection(section.id)}>
                                            <FontAwesomeIcon icon={faEllipsis} className=' text-xl' />
                                        </button>
                                    </div>
                                    <div
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        className='duration-300'
                                    >
                                        <TaskInSection getSections={getSections} section={section} taskList={section.Tasks} project={project} setSections={setSections} />
                                    </div>
                                </div>
                                <div
                                    className='absolute top-[40px] right-[10px] overflow-hidden rounded-lg z-50'
                                >
                                    <motion.div
                                        className='border w-[130px]'
                                        initial={{ opacity: 0, y: -180, height: 0 }}
                                        animate={showMenuSection === section.id ? { opacity: 1, y: 0, height: "auto" } : { opacity: 1, y: -180, height: 0 }}
                                    >
                                        <div >
                                            <button name="Share" onClick={(e: any) => handleActions(e, section)} className='w-full py-3 px-3 text-start bg-white hover:bg-gray-100 text-gray-600 text-sm duration-300'><FontAwesomeIcon className='text-gray-500 pr-1' icon={faShareNodes} />{' '}Share</button>
                                            <button name="Copy" onClick={(e: any) => handleActions(e, section)} className='w-full py-3 px-3 text-start bg-white hover:bg-gray-100 text-gray-600 text-sm duration-300'><FontAwesomeIcon className='text-gray-500 pr-1' icon={faCopy} />{' '}Copy</button>
                                            <button name="Edit" onClick={(e: any) => handleActions(e, section)} className='w-full py-3 px-3 text-start bg-white hover:bg-gray-100 text-gray-600 text-sm duration-300'><FontAwesomeIcon className='text-gray-500 pr-1' icon={faEdit} />{' '}Edit</button>
                                            <button name="Delete" onClick={(e: any) => handleActions(e, section)} className='w-full py-3 px-3 text-start bg-white hover:bg-gray-100 text-gray-600 text-sm duration-300'><FontAwesomeIcon className='text-gray-500 pr-1' icon={faTrash} />{' '}Delete</button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                        )
                    })
                }
                <div>
                    {
                        showInputSection ?
                            (
                                <div className='mt-6 animate-show-section duration-300'>
                                    <input className='border w-full rounded-md outline-green-700 duration-300 px-2 py-2 text-sm' onChange={(e: any) => setTitleSection(e.target.value)} />
                                    <div className='flex mt-2 items-center justify-end'>
                                        <Button className=' text-gray-500 shadow-md hover:border-gray-500 hover:text-gray-500 font-bold mr-2' onClick={() => setShowInputSection(false)}>Cancel</Button>
                                        <Button
                                            style={{ background: 'rgb(187, 247, 208)', borderColor: "rgb(187, 247, 208)" }}
                                            className={` text-gray-500 shadow-md ${titleSection == '' ? '' : 'hover:text-gray-500'} font-bold`}
                                            disabled={titleSection == '' ? true : false}
                                            onClick={handleSubmit}
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </div>

                            ) : <motion.button whileTap={{ scale: 0.9 }} className={`flex items-center text-gray-400 text-sm w-[70%] hover:text-red-600 mt-6 px-4 py-2 bg-slate-100 rounded-lg duration-300 animate-show-section`} onClick={() => setShowInputSection(true)}>
                                <FontAwesomeIcon icon={faSquarePlus} className='text-base pr-3' />
                                <p >Add section</p>
                            </motion.button>

                    }
                </div>
            </div >
            <div>
                {
                    sections.length <= 0 && <div className='mx-auto'>
                        <Image src={"/study.jpg"} width={800} height={200} className='mx-auto mt-8' alt='study' />
                    </div>
                }
            </div>
            {
                showMenuSection != 0 && <div className='fixed top-0 right-0 left-0 bottom-0 z-20' onClick={() => setShowMenuSection(0)}></div>
            }
            <ConFirmDialog open={showConfirm} onClickOk={() => { }} titleButtonCancel='Cancel' titleButtonOk='Delete' handleCancel={() => setShowConfirm(false)} icon={faTrash} title='Xác nhận xóa ?' />
        </div>
    )
}
