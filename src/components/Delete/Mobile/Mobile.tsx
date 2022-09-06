import { Spin } from 'antd';
import React, { useEffect } from 'react'
import { Button, Input } from '../../../common/Forms'
import { useFormInput } from '../../../Hooks/useFormInput';
import abdmService from '../../../services/abdm.service';
import { publicRsaEncrypt } from '../../../utils/encryption';
import { publicKey } from '../../../utils/publicKey';




function DeleteMobile() {

  const [inputs, handleChange, updateInputs]: any = useFormInput({ step: 0, authMethod: "MOBILE_OTP" });

  const mobileNumberHandler = () => {
    abdmService.mobileGenerateOTP({}).then(res => {
      if (res.data) {
        updateInputs('txnId', res.data.txnId);
      }
    })
  }

  const otpHandler = () => {
    const { otp, txnId, authMethod } = inputs;
    const encryptedOTP = publicRsaEncrypt(otp);
    abdmService.profileDelete({ otp: encryptedOTP, txnId, authMethod }).then(res => {
      if (res.data) {

      }
    })
  }

  useEffect(() => {
    mobileNumberHandler()
  }, [])

  const { otp, txnId } = inputs;
  return (
    <Spin spinning={!txnId}>
      <div className='form-gap'>
        <Input onChange={handleChange} name="otp" placeholder="Enter OTP" />
        <Button onClick={otpHandler} type="primary">Submit</Button>
      </div>
    </Spin>
  )
}

export default DeleteMobile