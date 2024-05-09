'use client'

import React, { useState, DragEvent, SetStateAction, Dispatch } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { projectType } from '@/schemaValidations/project.schema';
import { useRouter } from 'next/navigation';


interface DraggableListProps {
    projectsFavorite: projectType[];
    pathName: string;
    showMyProjects: boolean;
    setProjectsFavorite: Dispatch<SetStateAction<projectType[]>>
    favorited: boolean;
}

const ListMyProject: React.FC<DraggableListProps> = ({ favorited, setProjectsFavorite, projectsFavorite, pathName, showMyProjects }) => {
    const [draggingElement, setDraggingElement] = useState<projectType | null>(null);
    const navigation = useRouter()
    const dragStart = (event: DragEvent<HTMLDivElement>, project: projectType) => {
        setDraggingElement(project);
        // Add drag data
        event.dataTransfer.setData('text/plain', '');
    };

    const dragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const dragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '0.5';
    };

    const dragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.currentTarget.style.opacity = '1';
    };

    const drop = (event: DragEvent<HTMLDivElement>, project: projectType) => {
        event.preventDefault();
        event.currentTarget.style.opacity = '1';

        if (draggingElement && draggingElement.id !== project.id) {
            const draggingIndex = projectsFavorite.findIndex(item => item.id === draggingElement.id);
            const targetIndex = projectsFavorite.findIndex(item => item.id === project.id);

            const updateProjects = [...projectsFavorite]
            updateProjects.splice(targetIndex, 0, updateProjects.splice(draggingIndex, 1)[0]);
            console.log(updateProjects)
            setProjectsFavorite([...updateProjects])
            setDraggingElement(null);
        }
    };

    const dragEnd = () => {
        setDraggingElement(null);
    };

    return (
        <ul>
            {projectsFavorite.map((project, index) => {
                const pathParts = pathName.split('/');
                const path = pathParts[2];

                return (
                    <li key={index} className={`transition-all duration-300 ${showMyProjects ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
                        <div
                            className={`${project.id.toString() === path ? "" : "hover:bg-gray-100 rounded-lg"}`}
                            style={project.id.toString() === path ? { backgroundColor: "rgb(187 247 208 / 1)", color: "rgb(20 83 45 / 1)", borderRadius: "8px" } : {}}
                            draggable={showMyProjects}
                            onDragStart={(e) => dragStart(e, project)}
                            onDragOver={dragOver}
                            onDragEnter={dragEnter}
                            onDragLeave={dragLeave}
                            onDrop={(e) => drop(e, project)}
                            onDragEnd={dragEnd}
                            onClick={() => navigation.push('/project/' + project.id)}
                        >
                            <div className='flex items-center justify-between'>
                                <div
                                    className={` flex justify-start font-mono items-center pl-4 text-gray-500 text-base pb-2 pt-2 cursor-pointer animate-wiggle ${showMyProjects ? 'cursor-pointer' : 'cursor-default'} overflow-hidden whitespace-nowrap text-ellipsis`}
                                >
                                    <span className={`pr-2`} style={{ color: project.color, fontWeight: "bold" }}>
                                        {favorited ? <FontAwesomeIcon icon={faHeart} className='text-sm ' /> : "#"}
                                    </span>
                                    <p className='w-full truncate'>{project.title}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default ListMyProject;
