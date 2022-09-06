import React from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Input } from '../../../../common/Forms';
import { useFormInput } from '../../../../Hooks/useFormInput';
import abdmService from '../../../../services/abdm.service';

function Mobile() {
    const [inputs, handleChange, updateInputs]: any = useFormInput({});
    const history = useHistory()
    const searchHandler = () => {
        abdmService.searchByHealthId(inputs["id"]).then(res => {
            if (res.data) {
                const {healthIdNumber} = res.data;
                abdmService.authInit({ authMethod: "MOBILE_OTP", healthid: healthIdNumber }).then(res => {
                    console.log(res)
                    if (res.data) {
                        updateInputs('res', res.data)
                    }
                })
            }
        });
    }

    const otpHandler = () => {
        const { otp, res } = inputs
        console.log(otp,res)
        if (otp) {
            abdmService.confirmMobileOtp({
                otp,
                txnId: res.txnId
            }).then((res: any) => {
                if (res.data) {
                    localStorage.setItem("abdm_user", JSON.stringify(res.data))
                    history.push("/abdm_profile");
                }
            });
        }
    }
    const isRes = inputs.res ? Object.keys(inputs["res"]).length : 0;
    return (
        <div className='form-gap'>
            <Input show={!isRes} onChange={handleChange} name="id" placeholder="Enter Health ID" />
            <Input show={!!isRes} onChange={handleChange} name="otp" placeholder="Enter OTP" />
            <Button show={Boolean(!isRes)} onClick={searchHandler} style={{ width: "100%" }} type="primary">Submit</Button>
            <Button show={Boolean(isRes)} onClick={otpHandler} style={{ width: "100%" }} type="primary">Submit</Button>
        </div>
    )
}

export default Mobile