import React from 'react'
import { Button, Input } from '../../../common/Forms';
import { useFormInput } from '../../../Hooks/useFormInput';
import abdmService from '../../../services/abdm.service';
import { publicRsaEncrypt } from '../../../utils/encryption';

function EMobile() {
  const [inputs, handleChange, updateInputs]: any = useFormInput({ step: 0, authMethod: "MOBILE_OTP" });

  const mobileNumberHandler = () => {
    const { emailAddress } = inputs;

    abdmService.updateInitiate({ emailAddress }).then(res => {
      if (res.data) {
        updateInputs('txnId', res.data.txnId);
        updateInputs('step', 1);
      }
    })
  }

  const otpHandler = () => {
    const { otp, txnId } = inputs;
    const encryptedOTP = publicRsaEncrypt(otp);
    abdmService.updateVerify({ otp: encryptedOTP, txnId, authMethod: inputs["MOBILE_OTP"] }).then(res => {
      if (res.data) {
        // abdmService.oldMobileOtpGenerate({ txnId: res.data.txnId })
        // updateInputs('txnId', res.data.txnId);
        // updateInputs('step', 2);
      }
    })
  }



  const handler = [mobileNumberHandler, otpHandler];

  const { otp, txnId, step } = inputs;
  return (
    <div className='form-gap'>
      <Input show={step === 0} onChange={handleChange} name="emailAddress" placeholder="Enter new email" />
      <Input show={step === 1} onChange={handleChange} name="otp" placeholder="Enter OTP" />
      <Button onClick={handler[step]} style={{ width: "100%" }} type="primary">Submit</Button>
    </div>
  )
}

export default EMobile