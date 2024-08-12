import React from 'react'
import { Avatar } from 'antd';

interface AvatarCusProps extends React.HTMLAttributes<HTMLDivElement> {
    user: any;
}
export default function AvatarCus({ user, className, ...rest }: AvatarCusProps) {
    return (
        <Avatar className={className} style={{ backgroundColor: user?.color, color: 'white' }} >{user?.abb}</Avatar>
    )
}
