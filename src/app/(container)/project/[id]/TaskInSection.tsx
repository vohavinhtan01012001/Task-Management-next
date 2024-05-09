'use client'

import taskApiRequest from "@/apiRequests/task";
import { taskType } from "@/schemaValidations/task.schema";
import { DownOutlined } from "@ant-design/icons";
import { faCheck, faDeleteLeft, faPlus, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "antd";
import ColorPicker, { Color } from 'antd/es/color-picker';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from 'dayjs';

interface Props {
    projectId: number;
    userId: number;
    sectionId: number;
}


export default function TaskInSection({ projectId, userId, sectionId }: Props) {
    const [openColor, setOpenColor] = useState(false);
    const [valueColor, setValueColor] = useState<string>("#000");
    const [showAddTask, setShowAddTask] = useState<boolean>(false);
    const [tasks, setTasks] = useState<taskType[]>([])
    const [form, setForm] = useState({
        title: '',
        note: '',
        userId: 0,
        priority: 0,
        sectionId: 0,
        projectId: 0,
        color: '#000',
    })
    const { RangePicker } = DatePicker;

    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        if (projectId && userId && sectionId) {
            setForm({ ...form, color: valueColor, projectId: projectId, userId: userId, sectionId: sectionId })
        }
    }, [showAddTask])

    const handleSubmit = async () => {
        try {
            console.log(form)
            const res = await taskApiRequest.addTask(form)
            setTasks([...tasks, res.payload.task])
            handleCloseAddTask()
        }
        catch (err: any) {
            toast.error(err.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleCloseAddTask = () => {
        setShowAddTask(false)
        setValueColor("#000")
        setForm({
            title: '',
            note: '',
            userId: 0,
            priority: 0,
            sectionId: 0,
            projectId: 0,
            color: '#000',
        })
    }


    const getTasks = async () => {
        try {
            const res = await taskApiRequest.getTask(sectionId);
            setTasks(res.payload.tasks)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTasks();
    }, [sectionId])

    return (
        <>
            {
                tasks.map((task, index) => {
                    return (
                        <div key={index} className='shadow-sm hover:shadow-md hover:cursor-pointer w-full border rounded-lg pt-3 pb-1 px-2 my-4 duration-300'>
                            <div className='flex items-center pb-2 overflow-hidden whitespace-nowrap text-ellipsis w-full'>
                                <div className='pr-[10px]'>
                                    <div className={`relative border-[2px] border-solid rounded-full w-[20px] h-[20px]`} style={{
                                        borderColor: task.color
                                    }}>
                                        <FontAwesomeIcon icon={faCheck} className={`text-base absolute top-[1px] left-[1px]  opacity-0 duration-300 hover:opacity-100 `} style={{ color: task.color }} />
                                    </div>
                                </div>
                                <p className='text-gray-800 text-sm w-full truncate'>{task.title}</p>
                            </div>
                            {task.startDate ? <p className='text-red-400 text-xs pl-8'>{task.startDate}</p> : ""}
                        </div>
                    )
                })
            }
            <div >
                {
                    showAddTask ? <div className="border rounded-xl py-2 px-2 h-[180px] animate-show-add-task">
                        <input onChange={(e) => setForm({ ...form, "title": e.target.value })} type="text" className="border-none outline-none text-sm font-semibold pb-[5px] w-full" placeholder="Task name" />
                        <textarea onChange={(e) => setForm({ ...form, "note": e.target.value })} className="border-none outline-none text-sm pb-[10px] w-full resize-none" placeholder="Description" />
                        <div className="flex items-center text-sm pb-6">
                            <div className="flex items-center justify-around w-full">
                                <ColorPicker
                                    defaultValue="#000"
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
                                <RangePicker
                                    className="w-[70%]"
                                    defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                                    format={dateFormat}
                                />
                            </div>
                        </div>
                        <div className="flex relative items-center w-full justify-end px-2 before:after:content-[''] before:border-gray-100 before:border before:w-full before:absolute before:-top-3 before:left-0 before:right-0">
                            <button className="pr-6" onClick={handleCloseAddTask}>
                                <FontAwesomeIcon icon={faDeleteLeft} className="text-2xl text-gray-400 hover:text-red-500 duration-300" />
                            </button>
                            <button onClick={handleSubmit}>
                                <FontAwesomeIcon icon={faShare} className="text-2xl text-gray-400 hover:text-green-700 duration-300" />
                            </button>
                        </div>
                    </div>
                        :
                        <button className='flex items-center pl-2 text-sm text-red-400 hover:*:text-red-600' onClick={() => setShowAddTask(true)}>
                            <FontAwesomeIcon icon={faPlus} className='pr-1' />
                            <p className='text-sm text-gray-600'>Add task</p>
                        </button>
                }


            </div>
        </>
    )
}
