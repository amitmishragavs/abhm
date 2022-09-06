import { Button, Input } from 'antd';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import CardWrapper from '../../../common/CardWrapper'
import Tabs from '../../../common/Tabs';
import abdmService from '../../../services/abdm.service';
import Aadhaar from './Aadhaar';
import Mobile from './Mobile';

const Auth: any = {
    0: abdmService.confirmOtp,
    1: abdmService.confirmMobileOtp
}
function Login() {
    const [id, setId] = useState("");
    const [otp, setOtp] = useState("");
    const [res, setRes] = useState<any>({});
    const [authType, setAuthType] = useState<string>("0")
    const history = useHistory()

    const searchHandler = () => {
        abdmService.searchByHealthId(id).then(res => {
            if (res.data) {
                abdmService.authInit({ authMethod: "AADHAAR_OTP", healthid: res.data?.healthIdNumber }).then(res => {
                    if (res.data) {
                        setRes(res.data)
                    }
                })
            }
        });
    }

    const otpHandler = () => {
        if (otp) {
            Auth[authType]({
                otp: otp,
                txnId: res.txnId
            }).then((res: any) => {
                if (res.data) {
                    localStorage.setItem("abdm_user", JSON.stringify(res.data))
                    history.push("/abdm_profile");
                }
            });
        }
    }

    const isRes = Object.keys(res).length;
    return (
        <CardWrapper defaultActiveKey="0" form title="Login ">
            <Tabs active="0" titles={["Mobile", "Aadhaar"]}>
                <Mobile />
                <Aadhaar />
            </Tabs>
        </CardWrapper>
        // <CardWrapper form title="Login">
        //     {!isRes ? <Input onChange={(e: any) => setId(e.target.value)} placeholder="Enter Health ID" /> : null}
        //     <Button onClick={isRes ? otpHandler : searchHandler} style={{ width: "100%" }} type="primary">{"Submit"}</Button>
        // </CardWrapper>
    )
}

export default Login