import * as Yup from 'yup';
import { sectionType } from './section.schema';


export type taskType = {
    id: number;
    title: string;
    note: string;
    favorite: number;
    color: string;
    userId: number;
    priority: number;
    subTaskId: number;
    sectionId: number;
    projectId: number;
    startDate:string;
    status:0 | 1;
    endDate:string;
    Section: sectionType;
}

export const taskSchema= Yup.object(
    {
        title: Yup.string().required(),
        note: Yup.string(),
        userId: Yup.number().required(),
        priority: Yup.number(),
        sectionId: Yup.number().required(),
        projectId: Yup.number().required(),
        color: Yup.string().required(),
    }
);

export type taskAddType = Yup.InferType<typeof taskSchema>
