import { Spin } from 'antd';
import React, { useEffect } from 'react'
import { Button, Input } from '../../../common/Forms';
import { useFormInput } from '../../../Hooks/useFormInput';
import abdmService from '../../../services/abdm.service';
import { publicRsaEncrypt } from '../../../utils/encryption';

function DeactivateAadhaar() {
  const [inputs, handleChange, updateInputs]: any = useFormInput({ step: 0, authMethod: "AADHAAR_OTP" });

  const aadhaarHandler = () => {
    abdmService.aadhaarGenerateOTP({ aadhaar: inputs["aadhaar"] }).then(res => {
      if (res.data) {
        updateInputs('txnId', res.data.txnId);
      }
    })
  }

  const otpHandler = () => {
    const { otp, txnId, authMethod } = inputs;
    const encryptedOTP = publicRsaEncrypt(otp);
    abdmService.profileDeactivate({ otp: encryptedOTP, txnId, authMethod }).then(res => {
      if (res.data) {

      }
    })
  }


  const { otp, txnId } = inputs;
  const ifTxnId = Boolean(txnId)
  return (
    <Spin spinning={!txnId}>
      <div className='form-gap'>
        <Input show={!ifTxnId} onChange={handleChange} name="aadhaar" placeholder="Enter Aadhaar" />
        <Input show={ifTxnId} onChange={handleChange} name="otp" placeholder="Enter OTP" />
        <Button show={!ifTxnId} onClick={aadhaarHandler} type="primary">Submit</Button>
        <Button show={ifTxnId} onClick={otpHandler} type="primary">Submit</Button>
      </div>
    </Spin>
  )
}

export default DeactivateAadhaar