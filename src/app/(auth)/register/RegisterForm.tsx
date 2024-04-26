'use client'
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/app-provider";
import ButtonCustom from "@/components/ButtonCustom"
import { useCookies } from 'next-client-cookies';
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik';
import LabelCustom from "@/components/LabelCustom";
import Image from "next/image";
import Link from "next/link";
import { Input } from "antd";
import { signUpSchema } from "@/schemaValidations/auth.schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
    const navigation = useRouter()
    const { setUser } = useAppContext()
    const [loading, setLoading] = useState<boolean>(false)
    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const res = await authApiRequest.register(values)
            toast.success(res.payload.message, {
                position: toast.POSITION.TOP_RIGHT
            })
            navigation.push('/login');
        } catch (error: any) {
            setLoading(true)
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
                <Formik initialValues={{
                    fullname: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                }}
                    validationSchema={signUpSchema}
                    onSubmit={onFinish}
                >
                    {formik => (
                        <Form>
                            <div>
                                <LabelCustom required style={{ fontSize: "13px" }}>Fullname</LabelCustom>
                                <div>
                                    <Field className="p-3 border rounded-lg w-full text-base" style={formik.touched.fullname && formik.errors.fullname ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent" } : { outline: "2px solid transparent", outlineColor: "#dbdbdb" }} name="fullname" />
                                    {
                                        formik.touched.fullname && formik.errors.fullname ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.fullname}</LabelCustom> : ""
                                    }
                                </div>
                            </div>
                            <div>
                                <LabelCustom required style={{ fontSize: "13px" }}>Email</LabelCustom>
                                <div>
                                    <Field className="p-3 border rounded-lg w-full text-base" style={formik.touched.email && formik.errors.email ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent" } : { outline: "2px solid transparent", outlineColor: "#dbdbdb" }} name="email" />
                                    {
                                        formik.touched.email && formik.errors.email ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.email}</LabelCustom> : ""
                                    }
                                </div>
                            </div>
                            <div >
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
                            </div>
                            <div>
                                <LabelCustom required style={{ fontSize: "13px" }}>Phone</LabelCustom>
                                <div>
                                    <Field className="p-3 border rounded-lg w-full text-base" style={formik.touched.phone && formik.errors.phone ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent" } : { outline: "2px solid transparent", outlineColor: "#dbdbdb" }} name="phone" />
                                    {
                                        formik.touched.phone && formik.errors.phone ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.phone}</LabelCustom> : ""
                                    }
                                </div>
                            </div>
                            <div>
                                <LabelCustom required style={{ fontSize: "13px" }}>Address</LabelCustom>
                                <div>
                                    <Field className="p-3 border rounded-lg w-full text-base" style={formik.touched.address && formik.errors.address ? { outlineColor: "rgb(247 167 167)", outline: "2px solid transparent" } : { outline: "2px solid transparent", outlineColor: "#dbdbdb" }} name="address" />
                                    {
                                        formik.touched.address && formik.errors.address ? <LabelCustom color="red" style={{ fontSize: "13px" }}>{formik.errors.address}</LabelCustom> : ""
                                    }
                                </div>
                            </div>
                            <Link href={'/login'} className="hover:text-red-500" style={{ fontSize: "16px", float: "right", paddingTop: "5px" }}>Come back to the page login</Link>
                            <div className="mt-16 text-center">
                                <ButtonCustom title="Sign Up" width={200} height={45} style={{ fontSize: "18px", fontWeight: "bold" }} type="submit" loading={loading} />
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div >
    )
}

