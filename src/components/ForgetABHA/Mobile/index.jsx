
import React, { useState } from 'react'
import { Input, Button } from '../../../common/Forms';
import { InputTypes, useFormInput } from '../../../Hooks/useFormInput'
import abdmService from '../../../services/abdm.service';



function Mobile() {
    const [inputs, changeHandler, updateInputs] = useFormInput();
    const [user, setUser] = useState({})

    const sendOtp = () => {
        const { mobile } = inputs
        abdmService.generateForgetOtp({ mobile }).then(res => {
            if (res.data) {
                const { txnId } = res.data;
                updateInputs("txnId", txnId)
            }
        })
    }

    const confirmOtp = () => {
        abdmService.getHealthId(inputs).then(res => {
            if (res.data) {
                setUser(res.data);
            }
        })
    }

    const { txnId, mobile = "" } = inputs;

    return (
        <div className='form-gap'>
            <Input mobile={mobile.length === 10} show={!txnId} name="mobile" onChange={changeHandler} placeholder="Number" lable='Mobile Number' />
            <Input show={!txnId} name="firstName" onChange={changeHandler} lable='First Name' />
            <Input show={!txnId} name="name" onChange={changeHandler} lable="Full Name" />
            <Input show={!txnId} name="gender" onChange={changeHandler} placeholder="M | F" lable="Gender" />
            <Input show={!txnId} name="yearOfBirth" onChange={changeHandler} placeholder="Year" lable="DOB" />
            <Input show={!!txnId} name="otp" onChange={changeHandler} placeholder="XXXXXX" lable='OTP' />
            <Button show={!txnId} onClick={sendOtp} >{"Submit"}</Button>
            <Button show={!!txnId} onClick={confirmOtp} >{"Submit"}</Button>

            {/* {user.healthId ? <h4>{user.healthId}</h4> : null} */}
        </div>
    )
}

export default Mobile