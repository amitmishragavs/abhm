import React, { useState } from 'react'
import { Button, Card } from 'antd'
import abdmService from '../services/abdm.service';
import { useHistory } from 'react-router-dom';
import CardWrapper from '../common/CardWrapper';
import { Input } from '../common/Forms';

function LoginAbha() {
    const [id, setId] = useState("");
    const [otp, setOtp] = useState("");
    const [res, setRes] = useState<any>({});
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
            abdmService.confirmOtp({
                otp: otp,
                txnId: res.txnId
            }).then(res => {
                // console.log(res)
                if (res.data) {
                    localStorage.setItem("abdm_user", JSON.stringify(res.data))
                    history.push("/abdm_profile");
                }
            });
        }
    }

    const isRes = Object.keys(res).length;
    const resBool = Boolean(isRes)
    return (
        <CardWrapper form title="ABHM Verifiacation">
            <Input show={!resBool} onChange={(e: any) => setId(e.target.value)} placeholder="Enter Health ID" />
            <Input show={resBool} onChange={(e: any) => setOtp(e.target.value)} placeholder="Enter Otp" />
            <Button onClick={resBool ? otpHandler : searchHandler} style={{ width: "100%" }} type="primary">{"Submit"}</Button>
        </CardWrapper>
    )
}

export default LoginAbha