import * as Yup from 'yup';
import { userType } from './account.schema';


export type LoginResType = {
    user: userType,
    accessToken: string,
    statusCode: number,
    message:string
}
export type SignUpResType = {
    statusCode: number,
    message:string
}


export const loginSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required(),
    password: Yup.string().required().min(6),
})



export const signUpSchema = Yup.object({
    fullname: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phone: Yup.string().min(10).required('Phone number is required'),
    address: Yup.string().required('Address is required')
  })



export type LoginBodyType = Yup.InferType<typeof loginSchema>
export type SignUpBodyType = Yup.InferType<typeof signUpSchema>