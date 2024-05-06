'use client'
import ButtonCustom from "@/components/ButtonCustom";
import LabelCustom from "@/components/LabelCustom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field } from 'formik';
import { loginSchema } from "@/schemaValidations/auth.schema";
import { Input } from "antd";
import authApiRequest from "@/apiRequests/auth";
import { toast } from 'react-toastify'
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const router = useRouter()
    const { setUser } = useAppContext()
    const [loading, setLoading] = useState<boolean>(false)
    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const res = await authApiRequest.login(values)
            await authApiRequest.auth(res.payload.accessToken)
            setUser(res.payload.user)
            router.push('/today')
            toast.success(res.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } catch (error: any) {
            toast.error(error.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="pr-12 pl-12 pt-6 pb-6 ">
            <div >
                <Formik initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={onFinish}
                >
                    {formik => (
                        <Form>
                            <div>
                                <LabelCustom required style={{ fontSize: "13px" }}>Email</LabelCustom>
                                <div>
                                    <Field className="p-3 border rounded-lg w-full text-base" style={formik.touched.email && formik.errors.email ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent" } : { outline: "2px solid transparent", outlineColor: "#dbdbdb" }} name="email" />
                                    {
                                        formik.touched.email && formik.errors.email ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.email}</LabelCustom> : ""
                                    }
                                </div>
                            </div>
                            <div className="mt-10">
                                <LabelCustom required style={{ fontSize: "13px" }}>Password</LabelCustom>
                                <div>
                                    <Field name="password">
                                        {({
                                            field,
                                            form: { touched, errors },
                                        }: {
                                            field: any,
                                            form: any,
                                        }) => (
                                            <Input.Password className="p-3 border rounded-lg w-full text-base " style={formik.touched.password && formik.errors.password ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent", border: "0" } : { outline: "2px solid transparent", border: '0', outlineColor: "#dbdbdb" }} {...field} />
                                        )}
                                    </Field>
                                    {
                                        formik.touched.password && formik.errors.password ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.password}</LabelCustom> : ""
                                    }
                                </div>
                                <Link href={'/register'} className="hover:text-red-500" style={{ fontSize: "14px", float: "right", paddingTop: "5px" }}>Forgot password?</Link>
                            </div>
                            <div className="mt-16 text-center">
                                <ButtonCustom loading={loading} title="Login" width={200} height={50} style={{ fontSize: "18px", fontWeight: "bold" }} type="submit" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="mt-6 w-full text-center">
                <LabelCustom style={{ fontSize: "15px", color: "#555", fontWeight: "600" }}>Or Sign Up Using</LabelCustom>
                <div className="mt-6 flex justify-center items-center">
                    <Image src='/facebook.png' alt="Facebook" width={90} height={90} />
                    <Image src='/tiwi.png' alt="tiwi" width={65} height={65} />
                    <Image src='/google.png' alt="Facebook" width={120} height={120} />
                </div>
            </div>
            <div className="mt-10 w-full text-center">
                <LabelCustom style={{ fontSize: "15px", color: "#555", fontWeight: "600" }}>Or Sign Up Using</LabelCustom>
                <div>
                    <Link href={'/register'} className="text-gray-600 text-base font-semibold hover:text-red-500">Sign Up</Link>
                </div>
            </div>
        </div >
    )
}
