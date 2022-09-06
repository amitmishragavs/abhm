import { useHistory } from 'react-router-dom';
import { Button, Input } from '../../../../common/Forms';
import { useFormInput } from '../../../../Hooks/useFormInput';
import abdmService from '../../../../services/abdm.service';

function Aadhaar() {
    const [inputs, handleChange, updateInputs]: any = useFormInput({});
    const history = useHistory()
    const searchHandler = () => {
        abdmService.searchByHealthId(inputs["id"]).then(res => {
            if (res.data) {
                abdmService.authInit({ authMethod: "AADHAAR_OTP", healthid: res.data?.healthIdNumber }).then(res => {
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
        if (otp) {
            abdmService.confirmOtp({
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
    const show = Boolean(isRes)
    return (
        <div className='form-gap'>
            <Input lable="Health Id"  show={!show} onChange={handleChange} name="id" placeholder="Enter Health ID" />
            <Input lable="OTP" show={show} onChange={handleChange} name="otp" placeholder="Enter OTP" />
            <Button show={!show} onClick={searchHandler}  type="primary">Submit</Button>
            <Button show={show} onClick={otpHandler}  type="primary">Submit</Button>
        </div>
    )
}

export default Aadhaar