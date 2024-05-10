'use client'

import sectionApiRequest from '@/apiRequests/section';
import TaskInSection from '@/app/(container)/project/[id]/TaskInSection';
import { sectionType } from '@/schemaValidations/section.schema';
import { faCheck, faEllipsis, faPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Button } from 'antd';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import projectApiRequest from '@/apiRequests/project';
import { projectType } from '@/schemaValidations/project.schema';
import Image from 'next/image';

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

    const getSections = async () => {
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
    }


    useEffect(() => {
        getSections()
    }, [pathName, projectId]);

    return (
        <>
            <h1 className='text-2xl font-bold font-serif'>{project?.title}</h1>
            <div className='grid grid-cols-5 gap-6 mx-4'>
                {
                    sections.map((section, index) => {
                        return (
                            <div key={index} className={`pt-3  ${isSectionAdded === section.id ? 'animate-show-section' : ''}`}>
                                <div className={`${isHovered ? "" : "hover:shadow-md hover:cursor-grab  active:cursor-grabbing hover:border-gray-200"} duration-300 border border-transparent w-full px-4 pt-4 pb-10 rounded-lg `}>
                                    <div className='flex items-center justify-between pb-4' >
                                        <h3 className=' text-base font-semibold text-gray-600'>{section.title}</h3>
                                        <button className='hover:text-gray-800 text-gray-400'>
                                            <FontAwesomeIcon icon={faEllipsis} className=' text-xl' />
                                        </button>
                                    </div>
                                    <div
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        className='duration-300'
                                    >
                                        <TaskInSection projectId={section.projectId} sectionId={section.id} userId={section.userId} />
                                    </div>
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

                            ) : <button className={`flex items-center text-gray-400 text-sm w-[70%] hover:text-red-600 mt-6 px-4 py-2 bg-slate-100 rounded-lg duration-300 animate-show-section`} onClick={() => setShowInputSection(true)}>
                                <FontAwesomeIcon icon={faSquarePlus} className='text-base pr-3' />
                                <p >Add section</p>
                            </button>

                    }
                </div>
            </div>
            <div>
                {
                    sections.length <= 0 && <div className='mx-auto'>
                        <Image src={"/study.jpg"} width={800} height={200}  className='mx-auto' alt='study'/>
                    </div>
                }
            </div>
        </>
    )
}
