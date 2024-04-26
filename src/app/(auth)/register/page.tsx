
import RegisterForm from "./RegisterForm"
export default function Register() {
    return (
        <div className="bg-white h-[800px] w-[450px] rounded-xl shadow-2xl">
            <div className="w-full mt-20 mb-12">
                <p className="text-4xl text-gray-700 tracking-widest font-bold text-center">
                    SIGN UP
                </p>
            </div>
            <RegisterForm />
        </div>
    )
}
