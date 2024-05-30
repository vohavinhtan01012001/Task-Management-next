'use client'

import taskApiRequest from "@/apiRequests/task";
import { taskType } from "@/schemaValidations/task.schema";
import { DownOutlined } from "@ant-design/icons";
import { faCheck, faDeleteLeft, faPlus, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from "antd";
import ColorPicker, { Color } from 'antd/es/color-picker';
import { DragEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalTaskDetail from './[components]/ModalTaskDetail';
import AddTask from "./[components]/AddTask";

interface Props {
    projectId: number;
    userId: number;
    sectionId: number;
}


export default function TaskInSection({ projectId, userId, sectionId }: Props) {
    const [showAddTask, setShowAddTask] = useState<boolean>(false);
    const [tasks, setTasks] = useState<taskType[]>([])

    const [task, setTask] = useState<taskType | null>(null)
    const [showModalTaskDetail, setShowModalTaskDetail] = useState(false)

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

    const [draggingElement, setDraggingElement] = useState<taskType | null>(null);
    const [style, setStyle] = useState(0)
    const dragStart = (event: DragEvent<HTMLDivElement>, task: taskType) => {
        setDraggingElement(task);
        // Add drag data
        event.dataTransfer.setData('text/plain', '');

    };

    const dragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';
    };

    const dragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';
    };

    const dragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.style.opacity = '1';
    };

    const drop = async (event: DragEvent<HTMLDivElement>, task: taskType) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';

        if (draggingElement && draggingElement.id !== task.id) {
            const draggingIndex = tasks.findIndex(item => item.id === draggingElement.id);
            const targetIndex = tasks.findIndex(item => item.id === task.id);

            const updateTask = [...tasks]
            updateTask.splice(targetIndex, 0, updateTask.splice(draggingIndex, 1)[0]);
            setTasks([...updateTask])
            const taskList = updateTask.map((task, index) => {
                return ({ id: task.id, priority: index })
            })
            console.log(taskList)
            await taskApiRequest.updatePriority(taskList)
            setDraggingElement(null);
        }
    };

    const dragEnd = () => {
        setDraggingElement(null);
    };

    const handleShowTaskDetail = (task: taskType) => {
        setShowModalTaskDetail(true)
        setTask(task)
    }


    return (
        <>
            {
                tasks.map((task, index) => {
                    return (
                        <div key={index}
                            draggable={true}
                            onDragStart={(e) => dragStart(e, task)}
                            onDragOver={dragOver}
                            onDragEnter={dragEnter}
                            onDragLeave={dragLeave}
                            onDrop={(e) => drop(e, task)}
                            onDragEnd={dragEnd}
                            onClick={() => handleShowTaskDetail(task)}
                            className={`box${task.id} relative shadow-sm hover:shadow-md hover:cursor-pointer w-full border rounded-lg pt-3 pb-1 px-2 my-4 duration-300`}>
                            <div className='flex items-center pb-2 overflow-hidden whitespace-nowrap text-ellipsis w-full'>
                                <div className='pr-[10px]'>
                                    <div className={`relative border-[2px] border-solid rounded-full w-[20px] h-[20px]`} style={{
                                        borderColor: task.color
                                    }}>
                                        <FontAwesomeIcon icon={faCheck} className={`text-base absolute top-[1px] left-[1px]  opacity-0 duration-300 hover:opacity-100 `} style={{ color: task.color }} />
                                    </div>
                                </div>
                                <p className={`text-sm w-full truncate`} style={{
                                    color: task.color
                                }}>{task.title}</p>
                            </div>
                            {task.startDate ? <p className='text-red-400 text-xs pl-8'>{task.startDate}{'--->'}{task.endDate}</p> : ""}
                            {/* <div className={`${style === task.id ? 'absolute top-0 right-0 left-0 bottom-0 rounded-lg  bg-slate-300': ''}`}></div> */}
                        </div>
                    )
                })
            }
            <AddTask
                subTask={false}
                projectId={projectId}
                setTasks={setTasks}
                tasks={tasks}
                sectionId={sectionId}
                userId={userId}
                showAddTask={showAddTask}
                setShowAddTask={setShowAddTask}
            />
            <ModalTaskDetail
                open={showModalTaskDetail}
                setOpen={setShowModalTaskDetail}
                task={task}
                setTask={setTask}
            />
        </>
    )
}
