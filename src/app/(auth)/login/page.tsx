import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

export default function Login() {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('sessionToken') ? true : false
    if (sessionToken) {
        redirect('/today')
    }
    return (
        <div className="bg-white h-[800px] w-[450px] rounded-xl shadow-2xl">
            <div className="w-full mt-20 mb-12">
                <p className="text-4xl text-gray-700 tracking-widest font-bold text-center">
                    LOGIN
                </p>
            </div>
            <LoginForm />
        </div>

    )
}
