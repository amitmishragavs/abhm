import React from 'react'
import { Button, Input } from '../../../common/Forms';
import { useFormInput } from '../../../Hooks/useFormInput';
import abdmService from '../../../services/abdm.service';
import { publicRsaEncrypt } from '../../../utils/encryption';

function MAadhaar() {
  const [inputs, handleChange, updateInputs]: any = useFormInput({ step: 0, authMethod: "AADHAAR_OTP" });

  const mobileNumberHandler = () => {
    const { newMobileNumber } = inputs;

    abdmService.newMobileOtpGenerate({ newMobileNumber }).then(res => {
      if (res.data) {
        updateInputs('txnId', res.data.txnId);
        updateInputs('step', 1);
      }
    })
  }

  const otpHandler = () => {
    const { otp, txnId } = inputs;
    const encryptedOTP = publicRsaEncrypt(otp);
    abdmService.verifyNewMobileOtp({ otp: encryptedOTP, txnId }).then(res => {
      if (res.data) {
        abdmService.oldAadhaarOtpGenerate({ txnId: res.data.txnId })
        updateInputs('txnId', res.data.txnId);
        updateInputs('step', 2);
      }
    })
  }

  const oldOtpHandler = () => {
    const { otp, txnId } = inputs;
    const encryptedOTP = publicRsaEncrypt(otp);
    abdmService.updateAuthentication({ otp: encryptedOTP, txnId: txnId, authMethod: inputs["authMethod"] }).then(res => {
      if (res.data) {
        window.location.reload();
      }
    })
  }

  const handler = [mobileNumberHandler, otpHandler, oldOtpHandler];

  const { otp, txnId, step } = inputs;
  return (
    <div className='form-gap'>
      <Input show={step === 0} onChange={handleChange} name="newMobileNumber" placeholder="Enter new number" />
      <Input show={step === 1} onChange={handleChange} name="otp" placeholder="Enter OTP" />
      <Input show={step === 2} onChange={handleChange} name="otp" placeholder="Enter Old Mobile OTP" />
      <Button onClick={handler[step]} style={{ width: "100%" }} type="primary">Submit</Button>
    </div>
  )
}

export default MAadhaar