import * as Yup from 'yup';


export type sectionType = {
    id:number;
    title: string;
    userId: number;
    projectId: number;
    priority: number;
}

export const sectionSchema= Yup.object(
    {
        title: Yup.string().required(),
        userId: Yup.number().required(),
        projectId: Yup.number().required(),
    }
);

export type sectionAddType = Yup.InferType<typeof sectionSchema>
