'use client'

import taskApiRequest from "@/apiRequests/task";
import ButtonHover from "@/components/ButtonHover";
import { taskType } from "@/schemaValidations/task.schema";
import { DownOutlined } from "@ant-design/icons";
import { faDeleteLeft, faPlus, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColorPicker, DatePicker } from "antd";
import { Color } from "antd/es/color-picker";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


interface Props {
    showAddTask: boolean;
    setShowAddTask: (value: boolean) => void;
    projectId: number;
    userId: number;
    sectionId: number;
    setTasks?: any;
    tasks?: taskType[]
    subTask: boolean;
}

export default function AddTask({ showAddTask, setShowAddTask, projectId, userId, sectionId, setTasks, tasks, subTask }: Props) {
    const [form, setForm] = useState({
        title: '',
        note: '',
        userId: 0,
        priority: 0,
        sectionId: 0,
        projectId: 0,
        color: '#000',
    })
    const [openColor, setOpenColor] = useState(false);
    const [valueColor, setValueColor] = useState<string>("#000");
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const [date, setDate] = useState<[string | null, string | null]>([null, null])
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
        setDate([null, null])
    }

    useEffect(() => {
        if (projectId && userId && sectionId) {
            setForm({ ...form, color: valueColor, projectId: projectId, userId: userId, sectionId: sectionId })
        }
    }, [showAddTask, valueColor])

    const handleSubmit = async () => {
        try {
            console.log(form)
            const res = await taskApiRequest.addTask({ ...form, startDate: date ? date[0] : null, endDate: date ? date[1] : null })
            tasks && setTasks([...tasks, res.payload.task])
            handleCloseAddTask()
        }
        catch (err: any) {
            toast.error(err.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    return (
        <div>  {
            showAddTask ?
                <div className="border rounded-xl py-2 px-2 h-[180px] animate-show-add-task">
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
                                format={dateFormat}
                                onChange={(value, dateStrings) => setDate([...dateStrings])}
                            />
                        </div>
                    </div>
                    <div className="flex relative items-center w-full justify-end px-2 before:after:content-[''] before:border-gray-100 before:border before:w-full before:absolute before:-top-3 before:left-0 before:right-0">
                        <button className="pr-6" onClick={handleCloseAddTask}>
                            <FontAwesomeIcon icon={faDeleteLeft} className="text-2xl text-gray-400 hover:text-red-500 duration-300" />
                        </button>
                        <button onClick={handleSubmit} disabled={form.title ? false : true} className={`${form.title ? '' : 'hover:cursor-not-allowed'}`}>
                            <FontAwesomeIcon icon={faShare} className={`text-2xl text-gray-400 ${form.title ? "hover:text-green-700" : ""} duration-300`} />
                        </button>
                    </div>
                </div>
                :
                subTask ?
                    <ButtonHover className='mt-8 flex items-center pl-2 text-sm' onClick={() => setShowAddTask(true)}>
                        <FontAwesomeIcon icon={faPlus} className='pr-1' />
                        <p className='text-sm '>Add sub task</p>
                    </ButtonHover>
                    : <button className='flex items-center pl-2 text-sm text-red-400 hover:*:text-red-600' onClick={() => setShowAddTask(true)}>
                        <FontAwesomeIcon icon={faPlus} className='pr-1' />
                        <p className='text-sm text-gray-600'>Add task</p>
                    </button>
        }
        </div>
    )
}
