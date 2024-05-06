import DefaultLayout from "@/layouts";
import '@/layouts/sidebar/sidebar.css'
import { cookies } from "next/headers";
import Page404 from '../../components/CusTomError/Page404';

export default function RootLayout({ children }: any) {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('sessionToken') ? true : false
    return (
        <>
            {
                sessionToken ?
                    <DefaultLayout>
                        {children}
                    </DefaultLayout>
                    :
                    <Page404 />
            }
        </>
    )
}
