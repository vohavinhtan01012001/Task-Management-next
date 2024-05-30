import { taskType } from "@/schemaValidations/task.schema";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBars, faCheck, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import ButtonHover from "@/components/ButtonHover";
import AddTask from "./AddTask";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    task: taskType | null;
    setTask: (value: taskType | null) => void;
}

export default function ModalTaskDetail({ open, setOpen, task, setTask }: Props) {
    const [showTextTitle, setShowTextTitle] = useState(false);
    const [taskDetail, setTaskDetail] = useState<any>();
    const [showAddTask, setShowAddTask] = useState<boolean>(false);

    useEffect(() => {
        if (open && task) {
            setTaskDetail(task);
        }
    }, [open])


    const handleOk = () => {

    };

    const handleCancel = () => {
        setOpen(false);
        setTask(null);
    };

    const handlUpdate = () => {

    }

    return (
        <>
            <Modal
                title={
                    <div className="border-b">
                        <div className="flex items-center justify-between w-[95%] -mt-1 ">
                            <div>
                                <p>
                                    <ButtonHover>
                                        # My work /
                                    </ButtonHover>
                                    <ButtonHover>
                                        section1
                                    </ButtonHover>
                                </p>
                            </div>
                            <div className="flex items-center -mt-1">
                                <ButtonHover>
                                    <FontAwesomeIcon icon={faAngleUp} className="text-xl" />
                                </ButtonHover>
                                <ButtonHover>
                                    <FontAwesomeIcon icon={faAngleDown} className="text-xl" />
                                </ButtonHover>
                                <ButtonHover className="ml-2">
                                    <FontAwesomeIcon icon={faEllipsis} className="text-xl" />
                                </ButtonHover>
                            </div>
                        </div>
                    </div>
                }
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}
            >
                <div className="w-full grid grid-cols-3 gap-4 h-[600px]">
                    <div className="col-span-2">
                        <div className="flex items-start">
                            <div className={`mr-5 mt-3 relative border-[2px] border-solid rounded-full w-[20px] h-[20px]`} style={{
                                borderColor: "red"
                            }}>
                                <FontAwesomeIcon icon={faCheck} className={`text-base absolute top-[1px] left-[1px]  opacity-0 duration-300 hover:opacity-100 `} style={{ color: "red" }} />
                            </div>
                            <div className="block w-full" >
                                <div className={`py-2 px-2 rounded-lg w-full ${showTextTitle ? 'border' : ''}`} onClick={() => setShowTextTitle(true)}>
                                    <input type="text" className="outline-none text-xl w-full" name='title' value={taskDetail?.title} onChange={(e: any) => setTaskDetail({ ...taskDetail, [e.target.name]: e.target.value })} />
                                    <div className="text-gray-500 w-full">
                                        <input type="text" className="outline-none w-full" name="note" value={taskDetail?.note} placeholder={taskDetail?.note == "" ? "=>Note" : ""} onChange={(e: any) => setTaskDetail({ ...taskDetail, [e.target.name]: e.target.value })} />
                                    </div>
                                </div>
                                {
                                    showTextTitle &&
                                    <div className="flex items-center justify-end mt-2">
                                        <Button type="text" className="mr-2" onClick={() => setShowTextTitle(false)}>Cancel</Button>
                                        <Button type="primary" onClick={handlUpdate} danger>Save</Button>
                                    </div>
                                }
                                {
                                    taskDetail &&
                                    <div className="mt-6">
                                        <AddTask subTask={true} projectId={taskDetail?.projectId} sectionId={taskDetail?.sectionId} setShowAddTask={setShowAddTask} showAddTask={showAddTask} userId={taskDetail?.userId} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="">

                    </div>
                </div>
            </Modal>
        </>
    );
};
