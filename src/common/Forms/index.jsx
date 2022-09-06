import { Button as AButton, Input as AInput } from 'antd';
import './forms.scss';

export const Label = ({ children, text = "" }) => {
    if (!text) return children
    return <div className='label-wrapper'>
        <p>{text}</p>
        {children}
    </div>
}

export function Input({ show = true, lable = "", ...props }) {
    return show ? <Label text={lable}> <AInput {...props} /></Label> : null
}

export function Button({ show = true, ...props }) {
    return show ? <AButton type="primary" style={{ width: "100%" }}  {...props} /> : null
}