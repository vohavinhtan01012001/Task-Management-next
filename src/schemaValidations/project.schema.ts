import * as Yup from 'yup';


export type projectType = {
    id:number;
    title:string;
    description: string;
    favorite: number;
    color:string;
}

export const projectSchema= Yup.object(
    {
        title:Yup.string().required(),
        description:Yup.string().required(),
        favorite: Yup.number().required(),
        color: Yup.string().required(),
    }
);
