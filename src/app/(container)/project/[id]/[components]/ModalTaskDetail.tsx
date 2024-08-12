import { taskType } from "@/schemaValidations/task.schema";
import { Button, Input, Modal, Avatar } from 'antd';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBars, faCaretDown, faCaretRight, faCheck, faEllipsis, faFile, faHeart, faMicrophone, faPlus, faSmile, faStar, faUpDown, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import ButtonHover from "@/components/ButtonHover";
import AddTask from "./AddTask";
import taskApiRequest from "@/apiRequests/task";
import { toast } from "react-toastify";
import { projectType } from "@/schemaValidations/project.schema";
import { AnimatePresence, motion, Variants } from 'framer-motion';
import projectApiRequest from "@/apiRequests/project";
import { sectionType } from "@/schemaValidations/section.schema";
import sectionApiRequest from '@/apiRequests/section';
import { userType } from "@/schemaValidations/account.schema";
import { UserOutlined } from "@ant-design/icons";
import AvatarCus from "@/components/Avatar";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    task: taskType | null;
    setTask: (value: taskType | null) => void;
    setTasks: React.Dispatch<React.SetStateAction<taskType[]>>;
    tasks: taskType[];
    project?: projectType;
    getSections: () => Promise<void>;
    setSections: React.Dispatch<React.SetStateAction<sectionType[]>>;
    section: sectionType;
}

export default function ModalTaskDetail({ project, setTasks, section, tasks, setSections, open, setOpen, task, setTask, getSections }: Props) {
    const [showTextTitle, setShowTextTitle] = useState(false);
    const [taskDetail, setTaskDetail] = useState<any>();
    const [showAddTask, setShowAddTask] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('')
    const [note, setNote] = useState<string>('')
    const [isOpen, setIsOpen] = useState(false);
    const [listMove, setListMove] = useState<projectType[]>([])
    const [openListProject, setOpenListProject] = useState<number>(0)
    const [taskList, setTaskList] = useState<any[]>([])
    const [showListSubTask, setShowListSubTask] = useState<boolean>(false)
    const [showSubTask, setShowSubTask] = useState<taskType | null>(null)
    const [showInputComment, setShowInputComment] = useState<boolean>(false)
    const [comment, setComment] = useState<string>('')
    const [comments, setComments] = useState<any[]>([])
    const [showComments, setShowComments] = useState<boolean>(false)
    const [hideTaskListStatus, setHideTaskListStatus] = useState<boolean>(false)
    const [userAvatar, setUserAvatar] = useState<any>();

    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            const user = localStorage.getItem('user') && localStorage.getItem('user')
            const userObject = user && JSON.parse(user)
            setUserAvatar(userObject)
        }
    }, [])

    const itemVariants: Variants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
    };



    useEffect(() => {
        if (open && task) {
            setTaskDetail(task);
            setTitle(task.title);
            setNote(task.note);
            handleGetAllProjectsAndSections()
            handleGetSubTasks();
            getComments();
        }
        else {
            handleCancel();
        }
    }, [open, task])

    const handleCancel = () => {
        setOpen(false);
        setTask(null);
        setOpenListProject(0);
        setShowListSubTask(false);
        setShowInputComment(false);
        setHideTaskListStatus(false);
        setShowComments(false);
        setComments([])
    };

    const getComments = async () => {
        try {
            if (!task?.id) return;
            const res = await taskApiRequest.getComments(task?.id);
            setComments(res.payload.comments);
        } catch (error) {

        }
    }


    const handleUpdate = async () => {
        try {
            if (!task) return;
            const res = await taskApiRequest.updateTask(task.id, {
                title: title,
                note: note
            })
            const updateTask = tasks.findIndex(t => t.id === task.id)
            if (updateTask !== -1) {
                tasks[updateTask] = res.payload.task;
            }
            setTasks([...tasks])
            setTask({ ...res.payload.task })
            setShowTextTitle(false);
            toast.success(res.payload.status.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error: any) {
            toast.error(error.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleGetSubTasks = async () => {
        try {
            console.log(task)
            if (!task?.id) return;
            const res = await taskApiRequest.getSubTasks(task.id);
            setTaskList(res.payload.tasks)
        } catch (error) {

        }
    }

    const handleCheckTask = async () => {
        try {
            if (!task) return;
            const res = await taskApiRequest.updateStatus(task.id);
            const updateTask = tasks.findIndex(t => t.id === task.id);
            if (updateTask !== -1) {
                tasks.splice(updateTask, 1);
            }
            setTasks([...tasks])
            handleCancel();
            toast.success(res.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error: any) {
            toast.error(error.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleCheckSubTask = async (id: number) => {
        try {
            const res = await taskApiRequest.updateStatus(id);
            const updatedTasks = taskList.map(task => {
                if (task.id === id) {
                    return { ...task, status: 1 };
                }
                return task;
            });
            setTaskList([...updatedTasks]);
            toast.success(res.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error: any) {
            toast.error(error.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
    }

    const handleCancelUpdate = () => {
        setShowTextTitle(false)
        if (!task) return;
        setTitle(task.title);
    }

    const handleGetAllProjectsAndSections = async () => {
        try {
            const res = await projectApiRequest.getAllListMove()
            setListMove(res.payload.list)
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickMoveCheck = async (sectionId: number) => {
        try {
            if (!task || !task?.id || task?.id === sectionId) return;
            await taskApiRequest.moveTaskToSection(task?.id, sectionId)
            setTask({ ...task, sectionId: sectionId });
            if (!project?.id) return;
            const res = await sectionApiRequest.getAll(task.projectId);
            setSections([...res.payload.sections]);
        } catch (error: any) {
        }
    }

    const handleChangeTask = (text: string) => {
        if (text === "next") {
            if (!task?.id) return;
            const taskNext = tasks.findIndex(taskT => taskT.id === task.id);
            const checkTaskNext = tasks[taskNext + 1];
            if (checkTaskNext) {
                setTask({ ...checkTaskNext });
            }
        }
        else if (text === "previous") {
            if (!task?.id) return;
            const taskNext = tasks.findIndex(taskT => taskT.id === task.id);
            const checkTaskNext = tasks[taskNext - 1];
            if (checkTaskNext) {
                setTask({ ...checkTaskNext });
            }
        }
    }

    const handleShowSubTaskDetail = (subTask: taskType, task: taskType | null) => {
        if (!task) return;
        setShowSubTask(task);
        setTask({ ...subTask });
    }

    const handleComebackTask = (task: taskType | null) => {
        if (!task) return;
        setShowSubTask(null);
        setTask({ ...task });
    }
    const [user, setUser] = useState<userType | null>();
    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            const user = localStorage.getItem('user') && localStorage.getItem('user')
            const userObject = user && JSON.parse(user)
            if (userObject) {
                setUser(userObject)
            }
        }
    }, [])

    const handleSubmitComment = async () => {
        try {
            if (!user?.id || !task?.id) return;
            const res = await taskApiRequest.addComment({
                userId: user.id,
                taskId: task.id,
                comment: comment
            })
            setComments(prev => [...prev, { ...res.payload.comments, User: user }])
            setShowInputComment(false);
        } catch (error) {

        }
    }



    return (
        <>
            <Modal
                title={
                    <div className="border-b mx-[-24px] relative">
                        <div className="flex items-center justify-between w-[95%] -mt-1 ">
                            <div className="pl-2 pb-1">
                                <p>
                                    <motion.button className="text-gray-500 px-2 hover:bg-slate-100 rounded-lg mx-2 hover:text-green-800 py-[5px]" whileTap={{ scale: 0.92 }}>
                                        # {project?.title}
                                    </motion.button>
                                    <span className="text-gray-500">/</span>
                                    <motion.button onClick={() => setOpen(false)} className="text-gray-500 px-2 hover:bg-slate-100 rounded-lg mx-2 hover:text-green-800 py-[5px]" whileTap={{ scale: 0.92 }}>
                                        {section?.title}
                                    </motion.button>
                                    {
                                        showSubTask?.id === task?.subTaskId &&
                                        <>
                                            <span className="text-gray-500">/</span>
                                            <motion.button onClick={() => handleComebackTask(showSubTask)} className="text-gray-500 px-2 hover:bg-slate-100 rounded-lg mx-2 hover:text-green-800 py-[5px]" whileTap={{ scale: 0.92 }}>
                                                {showSubTask?.title}
                                            </motion.button>
                                        </>
                                    }
                                </p>
                            </div>
                            <div className="flex items-center -mt-[10px]">
                                <motion.button className={`w-[40px] h-[30px]  rounded-lg  ${tasks[0]?.id === task?.id ? "cursor-default text-gray-400" : "text-gray-600 hover:bg-slate-100"}`} whileTap={{ scale: 0.92 }} onClick={() => tasks[0]?.id !== task?.id && handleChangeTask("previous")}>
                                    <FontAwesomeIcon icon={faAngleUp} className={`text-xl ${tasks.length === 1 && 'opacity-60'}`} />
                                </motion.button>
                                <motion.button className={`w-[40px] h-[30px]  rounded-lg  ${tasks[tasks.length - 1]?.id === task?.id ? "cursor-default text-gray-400" : "text-gray-600 hover:bg-slate-100"}`} whileTap={{ scale: 0.92 }} onClick={() => tasks[tasks.length - 1]?.id !== task?.id && handleChangeTask("next")}>
                                    <FontAwesomeIcon icon={faAngleDown} className={`text-xl ${tasks.length === 1 && 'opacity-60'}`} />
                                </motion.button>
                                <motion.button className="ml-2">
                                    <FontAwesomeIcon icon={faEllipsis} className="text-xl" />
                                </motion.button>
                            </div>
                        </div>
                    </div >
                }
                open={open}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                className=""
            >
                <div className="w-full grid grid-cols-3 gap-4 h-[600px] mt-[-9px] mb-[-20px] ">
                    <div className="col-span-2 pt-[9px] pb-[20px] overflow-y-auto no-scrollbar">
                        <div className="flex items-start ">
                            <div className={`ml-2 mr-1 mt-3 relative border-[2px] border-solid rounded-full w-[20px] h-[20px]`} style={{
                                borderColor: task?.color
                            }} onClick={handleCheckTask}>
                                <FontAwesomeIcon icon={faCheck} className={`text-base absolute top-[1px] left-[1px]  opacity-0 duration-300 ${(showSubTask?.id === task?.subTaskId && task?.status === 1) && 'opacity-100'} hover:opacity-100 `} style={{ color: task?.color }} />
                            </div>
                            <div className="block w-full " >
                                {
                                    showSubTask?.id === task?.subTaskId && task?.status === 1 ?
                                        <div className={`py-2 px-2 rounded-lg w-full`}>
                                            <p className="text-xl line-through">{title}</p>
                                            <div className="text-gray-500 w-full ">
                                                <p className="line-through">{note}</p>
                                            </div>
                                        </div>
                                        : <div className={`py-2 px-2 rounded-lg w-full ${showTextTitle ? 'border' : ''}`} onClick={() => setShowTextTitle(true)}>
                                            <input type="text" className="outline-none text-xl w-full" name='title' value={title} onChange={(e: any) => setTitle(e.target.value)} />
                                            <div className="text-gray-500 w-full">
                                                <input type="text" className="outline-none w-full" name="note" value={note} placeholder={note == "" ? "=>Note" : ""} onChange={(e: any) => setNote(e.target.value)} />
                                            </div>
                                        </div>
                                }
                                {
                                    showTextTitle &&
                                    <div className="flex items-center justify-end mt-2">
                                        <Button type="text" className="mr-2" onClick={handleCancelUpdate}>Cancel</Button>
                                        <Button type="primary" onClick={handleUpdate} danger>Save</Button>
                                    </div>
                                }
                                {
                                    taskList.length > 0 && <div className="pt-5 pl-3 duration-300">
                                        <motion.div
                                            className="flex items-center justify-between hover:cursor-pointer"
                                        >
                                            <motion.div whileTap={{ scale: 0.98 }}
                                                onClick={() => setShowListSubTask(!showListSubTask)}
                                                className="flex items-center"
                                            >
                                                <div className="pr-2">
                                                    <FontAwesomeIcon icon={faCaretDown} className={` ${showListSubTask ? 'rotate-0' : '-rotate-90'} duration-300`} />
                                                </div>
                                                <div className="font-semibold flex items-center">Sub Task {taskList.filter(task => task.status === 1).length}/{taskList.length}
                                                    <div className={`border-[5px] ml-2 
                                                    ${taskList.filter(task => task.status === 1).length * 100 / taskList.length === 100 ?
                                                            "border-red-600" :
                                                            taskList.filter(task => task.status === 1).length * 100 / taskList.length >= 75 ?
                                                                "border-r-red-600 border-t-red-600 border-b-red-600" :
                                                                taskList.filter(task => task.status === 1).length * 100 / taskList.length >= 50 ?
                                                                    "border-r-red-600 border-t-red-600" :
                                                                    taskList.filter(task => task.status === 1).length * 100 / taskList.length >= 25 ?
                                                                        "border-t-red-600" : ""} rounded-full w-[25px] h-[25px]`}>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            <div>
                                                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setHideTaskListStatus(!hideTaskListStatus)} className="hover:bg-slate-100 text-gray-700 hover:text-gray-900 px-2 py-1 rounded-md" >{hideTaskListStatus ? "Show completed" : "Hide completed"}</motion.button>
                                            </div>
                                        </motion.div>
                                        <motion.div transition={{
                                            duration: 0.3,
                                            delay: 0.1,
                                        }}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={showListSubTask ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                                            className={`overflow-hidden `}>
                                            {
                                                taskList.map((item, index) => {
                                                    if (hideTaskListStatus) {
                                                        return (
                                                            item.status === 0 && <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                                animate={showListSubTask ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                                transition={{
                                                                    duration: 0.3,
                                                                    delay: index * 0.1,
                                                                }}
                                                                className="py-2"
                                                            >
                                                                <div className="flex items-start">
                                                                    <div
                                                                        className={` ml-2 mr-2 mt-1 relative border-[2px] border-solid rounded-full w-[15px] h-[15px] ${item.status === 0 && "hover:cursor-pointer"}`}
                                                                        style={{ borderColor: item?.color }}
                                                                        onClick={() => item.status === 0 && handleCheckSubTask(item.id)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faCheck}
                                                                            className={`text-sm absolute top-[-2px] left-[-1px] opacity-0 duration-300 ${item.status === 0 ? "hover:opacity-100" : "opacity-100"}`}
                                                                            style={{ color: item?.color }}
                                                                        />
                                                                    </div>
                                                                    <motion.div whileTap={{ scale: 0.92 }} onClick={() => handleShowSubTaskDetail(item, task)} className={`${item.status === 1 ? 'line-through' : ''} cursor-pointer`}>
                                                                        <p className="">{item.title}</p>
                                                                        <p className="text-xs text-gray-500">{item.note}</p>
                                                                    </motion.div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    }
                                                    else {
                                                        return (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                                animate={showListSubTask ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                                transition={{
                                                                    duration: 0.3,
                                                                    delay: index * 0.1,
                                                                }}
                                                                className="py-2"
                                                            >
                                                                <div className="flex items-start">
                                                                    <div
                                                                        className={` ml-2 mr-2 mt-1 relative border-[2px] border-solid rounded-full w-[15px] h-[15px] ${item.status === 0 && "hover:cursor-pointer"}`}
                                                                        style={{ borderColor: item?.color }}
                                                                        onClick={() => item.status === 0 && handleCheckSubTask(item.id)}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faCheck}
                                                                            className={`text-sm absolute top-[-2px] left-[-1px] opacity-0 duration-300 ${item.status === 0 ? "hover:opacity-100" : "opacity-100"}`}
                                                                            style={{ color: item?.color }}
                                                                        />
                                                                    </div>
                                                                    <motion.div whileTap={{ scale: 0.92 }} onClick={() => handleShowSubTaskDetail(item, task)} className={`${item.status === 1 ? 'line-through' : ''} cursor-pointer`}>
                                                                        <p className="">{item.title}</p>
                                                                        <p className="text-xs text-gray-500">{item.note}</p>
                                                                    </motion.div>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    }
                                                })

                                            }
                                            <AddTask setTasks={setTaskList} task={task} subTask={true} projectId={taskDetail?.projectId} sectionId={taskDetail?.sectionId} setShowAddTask={setShowAddTask} showAddTask={showAddTask} userId={taskDetail?.userId} />
                                        </motion.div>

                                    </div>
                                }
                                {
                                    taskList.length > 0 ? <></> :
                                        <div className="mt-6">
                                            <AddTask setTasks={setTaskList} task={task} subTask={true} projectId={taskDetail?.projectId} sectionId={taskDetail?.sectionId} setShowAddTask={setShowAddTask} showAddTask={showAddTask} userId={taskDetail?.userId} />
                                        </div>
                                }
                                {
                                    comments.length > 0 && <div className="mt-6 pl-3">
                                        <motion.div whileTap={{ scale: 0.98 }} className="cursor-pointer flex items-center" onClick={() => setShowComments(!showComments)}>
                                            <div className="pr-2">
                                                <FontAwesomeIcon icon={faCaretDown} className={` ${showComments ? 'rotate-0' : '-rotate-90'} duration-300`} />
                                            </div>
                                            <div className="font-semibold flex items-center">
                                                Comments <span className="text-gray-400 pl-2 font-extralight">{comments.length}</span>
                                            </div>
                                        </motion.div>
                                        <motion.div transition={{
                                            duration: 0.3,
                                            delay: 0.1,
                                        }}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={showComments ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                                            className={`overflow-hidden`}>
                                            {
                                                comments.map((item, index) => {
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                            animate={showComments ?
                                                                { opacity: 1, y: 0, height: "auto" } :
                                                                { opacity: 0, y: (index + 1) * -50, height: 0 }}
                                                            transition={{
                                                                duration: 0.3,
                                                                delay: index * 0.1,
                                                            }}
                                                            className="py-2 ml-3"
                                                        >
                                                            <div className="flex items-center">
                                                                <AvatarCus user={item.User} className="w-[25px] h-[25px] mr-2" />
                                                                <span>{item.comment}</span>
                                                            </div>

                                                        </motion.div>
                                                    );
                                                })

                                            }
                                            <div className="">
                                                {
                                                    showInputComment ?
                                                        <motion.div className=" border w-full rounded-lg px-2 py-2 duration-300">
                                                            <div className="rounded-lg w-full -mt-1">
                                                                <input type="text" className="outline-none rounded-lg h-10 px-3 w-full text-gray-600" placeholder="comment" onChange={(e: any) => setComment(e.target.value)} />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="mt-2 -mb-2">
                                                                    <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                        <FontAwesomeIcon icon={faFile} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                                    </motion.button>
                                                                    <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                        <FontAwesomeIcon icon={faMicrophone} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                                    </motion.button>
                                                                    <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                        <FontAwesomeIcon icon={faSmile} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                                    </motion.button>
                                                                </div>
                                                                <div className="mt-2 -mb-2">
                                                                    <motion.button onClick={() => setShowInputComment(false)} whileTap={{ scale: 0.92 }} className="px-2 py-[6px] mx-1 rounded-md text-gray-600 font-semibold hover:bg-gray-100 duration-300">cancel</motion.button>
                                                                    <motion.button onClick={handleSubmitComment} whileTap={{ scale: 0.92 }} className="px-2 py-[6px] mx-1 bg-[#dc4c3e] border rounded-md text-white font-semibold hover:bg-[#c73427] duration-300">Comment</motion.button>
                                                                </div>
                                                            </div>
                                                        </motion.div> :
                                                        <motion.div className="flex items-center">
                                                            <div className="pr-3">
                                                                <AvatarCus user={userAvatar} />
                                                            </div>
                                                            <motion.div whileTap={{ scale: 0.92 }} initial={{ width: "80%" }} animate={{ width: "100%" }} onClick={() => setShowInputComment(true)} className="border w-full rounded-lg px-2 py-1 cursor-pointer hover:bg-slate-100 duration-300">
                                                                <span className="text-gray-400">comment</span>
                                                            </motion.div>
                                                        </motion.div>
                                                }
                                            </div>
                                        </motion.div>
                                    </div>
                                }
                                {
                                    comments.length === 0 && <div className="mt-6 flex items-center justify-around">

                                        {
                                            showInputComment ?
                                                <motion.div initial={{ width: "80%" }} animate={{ width: "100%" }} className="border w-full rounded-lg px-2 py-2 duration-300">
                                                    <div className="rounded-lg w-full -mt-1">
                                                        <input type="text" className="outline-none rounded-lg h-10 px-3 w-full text-gray-600" placeholder="comment" onChange={(e: any) => setComment(e.target.value)} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="mt-2 -mb-2">
                                                            <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                <FontAwesomeIcon icon={faFile} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                            </motion.button>
                                                            <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                <FontAwesomeIcon icon={faMicrophone} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                            </motion.button>
                                                            <motion.button whileTap={{ scale: 0.92 }} className="px-1">
                                                                <FontAwesomeIcon icon={faSmile} className="text-xl text-gray-400 px-3 py-2 hover:bg-slate-100 rounded-lg hover:text-gray-500 duration-300 " />
                                                            </motion.button>
                                                        </div>
                                                        <div className="mt-2 -mb-2">
                                                            <motion.button onClick={() => setShowInputComment(false)} whileTap={{ scale: 0.92 }} className="px-2 py-[6px] mx-1 rounded-md text-gray-600 font-semibold hover:bg-gray-100 duration-300">cancel</motion.button>
                                                            <motion.button onClick={handleSubmitComment} whileTap={{ scale: 0.92 }} className="px-2 py-[6px] mx-1 bg-[#dc4c3e] border rounded-md text-white font-semibold hover:bg-[#c73427] duration-300">Comment</motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div> :
                                                <>
                                                    <div className="pr-3">
                                                        <AvatarCus user={userAvatar} />
                                                    </div>
                                                    <motion.div whileTap={{ scale: 0.92 }} initial={{ width: "80%" }} animate={{ width: "100%" }} onClick={() => setShowInputComment(true)} className="border w-full rounded-lg px-2 py-1 cursor-pointer hover:bg-slate-100 duration-300">
                                                        <span className="text-gray-400">comment</span>
                                                    </motion.div>
                                                </>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="border-l rounded-br-lg bg-green-50 mr-[-24px] mt-[1px]  ">
                        <div className="pt-[9px] pb-[20px]">
                            <div className="px-6 py-4">
                                <label className="text-base font-semibold text-gray-500">Project</label>
                                <motion.nav
                                    initial={false}
                                    animate={isOpen ? "open" : "closed"}
                                    className="w-full"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="w-full flex justify-between items-center bg-green-200 px-3 py-1 rounded-md shadow"
                                    >
                                        <span className="flex-1 pl-2">{project?.title}</span>
                                        <motion.div
                                            variants={{
                                                open: { rotate: 180 },
                                                closed: { rotate: 0 }
                                            }}
                                            transition={{ duration: 0.2 }}
                                            style={{ originY: 0.55 }}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 20 20">
                                                <path d="M0 7 L 20 7 L 10 16" />
                                            </svg>
                                        </motion.div>
                                    </motion.div>
                                    <motion.ul
                                        variants={{
                                            open: {
                                                clipPath: "inset(0% 0% 0% 0% round 10px)",
                                                transition: {
                                                    type: "spring",
                                                    bounce: 0,
                                                    duration: 0.7,
                                                    delayChildren: 0.3,
                                                    staggerChildren: 0.05
                                                }
                                            },
                                            closed: {
                                                clipPath: "inset(10% 50% 90% 50% round 10px)",
                                                transition: {
                                                    type: "spring",
                                                    bounce: 0,
                                                    duration: 0.3
                                                }
                                            }
                                        }}
                                        style={{ pointerEvents: isOpen ? "auto" : "none" }}
                                        className="bg-white rounded-b-lg shadow border"
                                    >
                                        {
                                            listMove.map((move, moveIndex) => {
                                                return (
                                                    <div key={moveIndex} className="cursor-pointer">
                                                        <motion.li variants={itemVariants} className="py-2 px-3 hover:bg-slate-50 hover:text-green-900 flex items-center" onClick={() => move.id === openListProject ? setOpenListProject(0) : setOpenListProject(move.id)}>
                                                            {move.Sections.length > 0 && <div className="pr-1"><motion.div animate={(move.id === openListProject) ? { rotate: 90 } : { rotate: 0 }}> <FontAwesomeIcon icon={faCaretRight} /></motion.div></div>}
                                                            {
                                                                <div className="pr-1"> {
                                                                    move.favorite ?
                                                                        <FontAwesomeIcon icon={faHeart} style={{ color: move.color }} />
                                                                        : <span style={{ color: move.color }}># {" "}</span>
                                                                }
                                                                </div>
                                                            }
                                                            <span>{move.title}</span>
                                                        </motion.li>
                                                        <motion.li
                                                            animate={(move.Sections.length > 0 && move.id === openListProject)
                                                                ? { height: 'auto', opacity: 1 } :
                                                                { overflow: 'hidden', height: 0, opacity: 0 }}

                                                        >
                                                            {(
                                                                move.Sections.map((section, sectionIndex) => {
                                                                    return (
                                                                        <motion.li
                                                                            className="hover:bg-slate-50 hover:text-green-900 py-2 px-3 pl-[30px]"
                                                                            key={`${moveIndex}-${sectionIndex}`}
                                                                            variants={itemVariants}
                                                                            onClick={() => handleClickMoveCheck(section.id)}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" /> {" "}{section.title}
                                                                                </div>
                                                                                {
                                                                                    task?.sectionId === section.id && <div>
                                                                                        <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </motion.li>
                                                                    );
                                                                })
                                                            )}
                                                        </motion.li>
                                                    </div>
                                                );
                                            })
                                        }
                                    </motion.ul>
                                </motion.nav>
                            </div>
                        </div>
                    </div>
                </div >
            </Modal >
        </>
    );
};
