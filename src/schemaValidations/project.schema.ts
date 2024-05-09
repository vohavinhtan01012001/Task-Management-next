import * as Yup from 'yup';


export type projectType = {
    id:number;
    title: string;
    description: string;
    favorite: number;
    color: string;
    userId: string;
    startDate: string;
    endDate: string;
    status: number;
}

export const projectSchema= Yup.object(
    {
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        favorite: Yup.number().required('Favorite is required'),
        color: Yup.string().required('Color is required'),
    }
);

export type projectAddType = Yup.InferType<typeof projectSchema>
