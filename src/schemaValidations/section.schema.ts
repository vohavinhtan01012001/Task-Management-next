import * as Yup from 'yup';
import { projectType } from './project.schema';
import { taskType } from './task.schema';


export type sectionType = {
    id:number;
    title: string;
    userId: number;
    projectId: number;
    priority: number;
    Tasks:taskType[]
    Project:projectType;
}

export const sectionSchema= Yup.object(
    {
        title: Yup.string().required(),
        userId: Yup.number().required(),
        projectId: Yup.number().required(),
    }
);

export type sectionAddType = Yup.InferType<typeof sectionSchema>
