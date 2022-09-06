import React from 'react'
import './profiletabs.scss'

interface Props {
    title: string,
    children:any,
    style?:any
}

function ProfileTabs({ children, title ,...props }: Props) {

    return (
        <div className="profile-tab-wrapper" {...props}>
            <div className="tabs">
                {/* <div className="tab">ABDM Registration</div> */}
                {/* <div className="tab">{title}</div> */}
            </div>
            {children}
        </div>
    )
}

export default ProfileTabs