
export default function AuthRootLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-[url('/background.png')]" style={{
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover"
        }}> {children}</div>
    )
}
