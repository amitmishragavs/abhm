import { Component } from "react";
import AuthService from "../services/auth.service";
import { RouteComponentProps } from "react-router-dom";
import IUser from "../types/user.type";
import { Button, Card, Checkbox, Input, Modal, Radio, Space, Spin, Upload } from "antd";
import './search.scss';
import aadharService from "../services/aadhar.service";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import abdmService from "../services/abdm.service";
import ProfileTabs from "../common/ProfileTabs";
import CardWrapper from "../common/CardWrapper";
interface RouterProps {
  history: string;
}
type Props = RouteComponentProps<RouterProps>;
type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { accessToken: string },
  aadharNo: string | null
  loading: boolean,
  imageUrl: string,
  data: any,
  multiple: boolean
  loader: boolean,
  selectedPatient: string
  txn: string
  otp: string
  mobile: string
  idExist: string
  mobileOtpTxn: string
  healthCreateId: boolean
  healtData: any
  userData: any
  step: number
  agree: boolean
  mobileFlow: any
}
let last: any;
export default class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleAadharNoChange = this.handleAadharNoChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { accessToken: "" },
      aadharNo: null,
      loading: false,
      imageUrl: "",
      data: [],
      multiple: false,
      loader: false,
      selectedPatient: "",
      txn: "",
      mobileOtpTxn: "",
      otp: "",
      healthCreateId: false,
      agree: false,
      step: 0,
      mobile: '',
      idExist: '',
      healtData: {},
      userData: {},
      mobileFlow: {
        mobileNo: ""
      }
    };
    this.changeHandler = this.changeHandler.bind(this)
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  createProfile() {
    this.setState({ loading: true })
    const { healtData, txn } = this.state;
    abdmService.createHealthId({ ...healtData, txnId: txn }).then(res => {
      localStorage.setItem('user', JSON.stringify(res));
      // this.setState({ userData: res });
      this.props.history.replace('/abdm_profile');
      this.setState({ loading: false })
    }).catch(err => {
      this.setState({ loading: false })
    });
  }

  getMobileOtp() {
    this.setState({ loading: true })
    if (this.state.mobileOtpTxn) {
      const { otp, mobileOtpTxn } = this.state;
      abdmService.verifyMobileOtp(otp, mobileOtpTxn).then(res => {
        this.setState({ txn: res.txnId, step: 3 });
        this.setState({ loading: false })
      }).catch(err => {
        this.setState({ loading: false })
      });
    } else {
      const { mobile, txn } = this.state;
      abdmService.getMobileOtp(mobile, txn).then(res => {
        if (res.txnId) {
          this.setState({ mobileOtpTxn: res.txnId })
        }
        this.setState({ loading: false })
      }).catch(err => {
        this.setState({ loading: false })
      });
    }
  }

  checkHealthId(healthId: string) {

    if (last) {
      clearTimeout(last);
    }
    last = setTimeout(() => {
      abdmService.checkHealthId({ healthId }).then(res => {
        if (res.status) {
          this.setState({ idExist: "Health ID already exist" })
        } else {
          this.setState({ idExist: "" })

        }

      })
    }, 2000);

  }

  handleSearch() {
    this.setState({ loading: true });
    if (!this.state.txn) {
      abdmService.getAadhaarOtp(this.state.aadharNo).then(res => {
        this.setState({ txn: res.txnId });
        this.setState({ loading: false });
      }).catch(err => {
        this.setState({ loading: false });
      });
    } else {
      const { otp, txn } = this.state;
      abdmService.verifyAadharOtp(otp, txn).then(res => {
        console.log(res)
        if (res.txnId) {
          this.setState({ txn: res.txnId, otp: "", step: 2 })
          this.setState({ loading: false });
        }
      }).catch(err => {
        this.setState({ loading: false });
      });
    }
  }

  handleAadharNoChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      aadharNo: e.currentTarget.value
    });
  }

  uploadButton() {
    return <div>
      {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  }

  handleChange({ file }: any) {
    this.setState({ loading: true })
    aadharService.getAadharDetrailsUpload(file).then(res => {
      if (res.status === 200) {
        const data = Array.isArray(res.data) ? res.data : eval(res.data);

        if (data.length > 2) {
          this.setState({ data: data, multiple: true });
        }
        else {
          this.props.history.push("/enroll?aaNo=" + data[1].aadhaar_number);
        }
        this.setState({ imageUrl: file })
      }
      this.setState({ loading: false })
    }).catch(err => {
      this.setState({ loading: false })
    });
  }

  //mobile flow 


  changeHandler(e:any){
    this.setState({mobileFlow:{[e.target.name]:e.target.value}})
  }

  render() {
    const { step } = this.state;
    const {} = this.state.mobileFlow;
    return <ProfileTabs style={{ background: "none", boxShadow: "none" }} title="ABDM Registration">
      <Spin spinning={this.state.loading}>
        <div className="search-wrapper" >
          <CardWrapper form title="Register" style={{ height: "auto" }}>
            {step === 0 ? <>
              <Button type="primary" onClick={() => this.props?.history?.push("/login_abha")}>Login ABHA</Button>
              <Button type="primary" onClick={() => this.setState({ step: 1 })}>Create ABHA with Aadhaar</Button>
              <Button type="primary" onClick={() => this.setState({ step: 4 })}>Create ABHA with Number</Button>
            </> : null}
            {/* aadhaad registration */}
            {step === 1 ? <>

              <div className="form" >
                <Input disabled={this.state.loading || !!this.state.txn} onChange={this.handleAadharNoChange} placeholder="Enter Aadhaar Number" />

                {this.state.txn && <Input onChange={(e) => this.setState({ otp: e.target.value })} placeholder="Enter Aadhaar OTP" />}
                {!this.state.txn ? <div className="term-condition">
                  <Checkbox onChange={(e) => this.setState({ agree: e.target.checked })} />
                  <span>I agree <a target="_blank" href="/term">term & condition</a></span>
                </div> : null}
                <Button disabled={!this.state.agree || this.state.loading || this.state.aadharNo?.length !== 12} style={{ width: "100%" }} onClick={this.handleSearch} type="primary">{this.state.txn ? "Submit" : "Get OTP"}</Button>
              </div>

              {/* <Modal title="Choose Patient" visible={this.state.multiple} okText="Next" onOk={(e) => {
                this.props.history.push(`/enroll?aaNo=${this.state.data[1].aadhaar_number}&patient=${this.state.selectedPatient}`);
              }} >
                <Radio.Group onChange={(e) => {
                  this.setState({ selectedPatient: e.target.value });
                }} >
                  <Space direction="vertical">
                    {this.state.data.slice(1).map((option: any) => {
                      return <Radio value={option.patient_id}>{`${option.first_name} (${option.patient_id})`}</Radio>
                    })}
                  </Space>
                </Radio.Group>
              </Modal> */}
            </> : null}
            {step === 2 ?
              <div className="form" >
                <Input disabled={!!this.state.mobileOtpTxn} onChange={(e) => this.setState(state => ({ ...state, mobile: e.target.value }))} placeholder="Enter Mobile Number" />
                {this.state.mobileOtpTxn && <Input onChange={(e) => this.setState({ otp: e.target.value })} placeholder="Enter Mobile OTP" />}
                {!this.state.mobileOtpTxn ? <Button disabled={this.state.mobile.length !== 10} style={{ width: "100%", margin: "1rem 0" }} onClick={this.getMobileOtp.bind(this)} type="primary">Get OTP</Button> : <Button disabled={this.state.otp.length !== 6} style={{ width: "100%", margin: "1rem 0" }} onClick={this.getMobileOtp.bind(this)} type="primary">Submit</Button>}
              </div>
              : null}
            {step === 3 ?
              <div className="form" >
                {/* <Input type="email" onChange={(e) => this.setState(state => ({ healtData: { ...state.healtData, email: e.target.value } }))} placeholder="Email" /> */}
                {/* <Input onChange={(e) => this.setState(state => ({ healtData: { ...state.healtData, firstName: e.target.value } }))} placeholder="First Name" /> */}
                {/* <Input onChange={(e) => this.setState(state => ({ healtData: { ...state.healtData, middleName: e.target.value } }))} placeholder="Middle Name" /> */}
                {/* <Input onChange={(e) => this.setState(state => ({ healtData: { ...state.healtData, lastName: e.target.value } }))} placeholder="Last Name" /> */}
                <Input onChange={(e) => {
                  this.checkHealthId(e.target.value);
                  this.setState(state => ({ healtData: { ...state.healtData, healthId: e.target.value } }))
                }} placeholder="Health Id" />
                {this.state.idExist && <p>{this.state.idExist}</p>}
                <Input type="password" onChange={(e) => this.setState(state => ({ healtData: { ...state.healtData, password: e.target.value } }))} placeholder="Password" />
                {/* <Input type="file" onChange={(e: any) => {
            this.setState(state => ({ healtData: { ...state.healtData, profilePhoto: e.target.files[0] } }))
          }} /> */}
                <Button disabled={Object.values(this.state.healtData).filter(r => r).length !== 2 || !!this.state.idExist} style={{ width: "100%", margin: "1rem 0" }} onClick={this.createProfile.bind(this)} type="primary">Create Profile</Button>
              </div>
              : null}

            {step === 4 ?
              <div className="form" >
                <Input name="mobile" disabled={this.state.loading || !!this.state.txn} onChange={this.changeHandler} placeholder="Enter Mobile Number" />

                {this.state.txn && <Input onChange={(e) => this.setState({ otp: e.target.value })} placeholder="Enter Aadhaar OTP" />}
                
                <Button disabled={!this.state.agree || this.state.loading || this.state.aadharNo?.length !== 12} style={{ width: "100%" }} onClick={this.handleSearch} type="primary">{this.state.txn ? "Submit" : "Get OTP"}</Button>
              </div> : null}
            {/* Mobile register */}
          </CardWrapper>
        </div>
      </Spin>
    </ProfileTabs>
  }
}

