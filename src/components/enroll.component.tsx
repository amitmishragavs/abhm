import { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import aadharService from "../services/aadhar.service";
import { RouteComponentProps } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Input, Modal } from "antd";
import './enroll.scss'

interface RouterProps {
  history: string;
}
type Props = RouteComponentProps<RouterProps>;

type State = {
  redirect: string | null,
  userReady: boolean,
  success: string,
  alreadyExist: boolean;
  registered?: number,
  currentUser: IUser & { accessToken: string },
  data: {
    first_name?: string,
    last_name?: string,
    dob?: string,
    age?: string,
    aadhaar_number?: string,
    gender?: string,
    father_name?: string,
    father_no?: string,
    mother_name?: string,
    mother_no?: string,
    mobile_no?: string,
    email_addr?: string,
    city?: string,
    state?: string,
    country?: string,
    pin_code?: string,
    addr?: string,
  }
}




export default class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);



    // this.handFirstNameChange = this.handFirstNameChange.bind(this);
    // this.handMobileNoChange = this.handMobileNoChange.bind(this);
    // this.handAddressChange = this.handAddressChange.bind(this);
    // this.handleMaleGender = this.handleMaleGender.bind(this);
    // this.handleFemaleGender = this.handleFemaleGender.bind(this);
    // this.handleOtherGender = this.handleOtherGender.bind(this);
    // this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { accessToken: "" },
      data: {},
      success: "",
      alreadyExist: true,
      registered: 0
    };


  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    this.setState({
      data: {
        ...this.state.data,
        [key]: e.currentTarget.value,
      }
    });
  }



  handleCancel() {
    this.props.history.push("/search");
    window.location.reload();
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });

    this.setState({ currentUser: currentUser, userReady: true })


    let search = window.location.search;
    let params = new URLSearchParams(search);
    let aadhaarNumber = params.get('aaNo');
    let selectedPatientId = params.get('patient');

    if (aadhaarNumber) {
      console.log(aadhaarNumber)
      aadharService.getAadharDetails(aadhaarNumber).then(
        (res) => {
          const data = Array.isArray(res.data)? res.data : eval(res.data);
          if (data) {

            const pat= selectedPatientId ? data.slice(1).find((patient:any)=>patient.patient_id===selectedPatientId) : data[1];
            if(pat){
              this.setState({ registered: data[0].pre_existing, data:  pat  });
            }
          }

        },
        error => {
        }
      );
    }
    // Modal.error({
    //   title:'Patient already exists!!',
    //   content: <div>
    //     <h3></h3>
    //   </div>,
    //   onCancel: () => {
    //     this.setState({alreadyExist: true})
    //   },
    //   onOk: () => {
    //     this.props.history.replace("/search");
    //   },
    //   okText: 'Go Back',
    //   mask: false,
    //   keyboard: false,
    // })
  }



  handleSubmit() {
    aadharService.saveAadharDetails({...this.state.data,key:String(this.state.registered),aadhaar_number:String(this.state.data.aadhaar_number)}).then(
      (res) => {
        this.setState({ data: {},registered:res.data[0], success: res.data[1] });
      },
      error => {
      }
    );
  }

  submit = () => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          //onClick: () => alert('Click Yes')
          onClick: () => {
            this.handleSubmit();
          }
        },
        {
          label: 'No',
          onClick: () => {

          }
        }
      ]
    });
  };

  render() {
    const { first_name = "",
      last_name = "",
      dob = "",
      age = "",
      aadhaar_number = "",
      gender = "",
      father_name = "",
      father_no = "",
      mother_name = "",
      mother_no = "",
      mobile_no = "",
      email_addr = "",
      city = "",
      state = "",
      country = "",
      pin_code = "",
      addr = "" } = this.state.data;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div className="registration-wrapper">
        <div className="registration-nav">
          <div className="tab">Patient Auto Enrollment</div>

        </div>
        {(this.state.userReady) ?
          <div className="form-wrapper">
            <div className="row col-md-12 text-center mt-3">
              {/* <div className="col-md-12 text-center page-header">
                <h1>
                  Patient Auto Enrollment
                </h1>
              </div> */}
            </div>
            <div className="clearfix"></div>
            <div>
              <div className="aadhaar-section">
                <div>
                Aadhaar No - <span>{this.state.data["aadhaar_number"]}</span>
                </div>
                <div className="action-btn">
                  <button type="button" className="btn btn-primary" onClick={this.submit}>Submit</button>
                  <button type="button" className="btn btn-primary" onClick={this.handleCancel}>Clear</button>
                </div>
              </div>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Patient Information</legend>
                <div className="control-group">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="fName">First Name</label>
                          <Input size="small" type="text" className="form-control" id="fName" value={first_name} onChange={(e) => this.handleChange(e, "first_name")} />
                          {/* <input type="text" className="form-control" id="fName" value={this.state.data.Name} onChange={this.handFirstNameChange} /> */}
                          <div >
                            <label htmlFor="faName">Father Name</label>
                            <Input value={father_name} onChange={(e) => this.handleChange(e, "father_name")} size="small" type="text" className="form-control" id="fName" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-2">
                          <label htmlFor="lName">Last Name</label>
                          <Input size="small" type="text" className="form-control" id="fName" value={last_name} onChange={(e) => this.handleChange(e, "last_name")} />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="mNo">Email Address</label>
                          <Input value={email_addr} onChange={(e) => this.handleChange(e, "email_addr")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="DOB">Date of Birth</label>
                          <Input size="small" value={dob} type="text" className="form-control" id="dOB" />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="Gender">Gender</label>
                          <div className="row mt-2">
                            <div className="col-md-12">
                              <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="male" id="male" value="Male" checked={gender === "Male"} onChange={() => this.setState({ data: { ...this.state.data, gender: "Male" } })} />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">Male</label>
                              </div>

                              <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="female" id="female" value="Female" checked={gender === "Female"} onChange={() => this.setState({ data: { ...this.state.data, gender: "Female" } })} />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">Female</label>
                              </div>

                              <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="other" id="other" value="Other" checked={gender === "Other"} onChange={() => this.setState({ data: { ...this.state.data, gender: "Other" } })} />
                                <label className="form-check-label" htmlFor="flexRadioDefault1">Other</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-md-2">
                          <label htmlFor="mNo">Mobile No</label>
                          <Input value={mobile_no} onChange={(e) => this.handleChange(e, "mobile_no")} size="small" type="text" className="form-control" id="fName" />
                        </div> */}

                      </div>
                      <div className="clearfix"></div>
                      <div className="row">

                        <div className="col-md-2">
                          <label htmlFor="faNo">Father Contact No</label>
                          <Input value={father_no} onChange={(e) => this.handleChange(e, "father_no")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="moName">Mother Name</label>
                          <Input value={mother_name} onChange={(e) => this.handleChange(e, "mother_name")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="moNo">Mother Contact No</label>
                          <Input value={mother_no} onChange={(e) => this.handleChange(e, "mother_no")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </fieldset>
            </div>

            <div>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Contact Information</legend>
                <div className="control-group">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="mNo">Mobile No</label>
                          <Input value={mobile_no} onChange={(e) => this.handleChange(e, "mobile_no")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="city">City</label>
                          <Input value={city} onChange={(e) => this.handleChange(e, "city")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        {/* <div className="col-md-7">
                          <input type="text" className="form-control" id="city" />
                        </div> */}
                      </div>
                      <div className="clearfix"></div>
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="country">Country</label>
                          <Input value={country} onChange={(e) => this.handleChange(e, "country")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        {/* <div className="col-md-7">
                          <input type="text" className="form-control" id="country" />
                        </div> */}
                      </div>


                    </div>
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="mNo">Email Address</label>
                          <Input value={email_addr} onChange={(e) => this.handleChange(e, "email_addr")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        {/* <div className="col-md-7">
                          <input type="text" className="form-control" id="email" />
                        </div> */}
                      </div>
                      <div className="clearfix"></div>
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="state">State</label>
                          <Input value={state} onChange={(e) => this.handleChange(e, "state")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        {/* <div className="col-md-7">
                          <input type="text" className="form-control" id="state" />
                        </div> */}
                      </div>
                      <div className="clearfix"></div>
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="pCode">Postal Code</label>
                          <Input value={pin_code} onChange={(e) => this.handleChange(e, "pin_code")} size="small" type="text" className="form-control" id="fName" />
                        </div>
                        {/* <div className="col-md-7">
                          <input type="text" className="form-control" id="pCode" />
                        </div> */}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <label htmlFor="add">Full Address</label>
                      <textarea value={addr} onChange={(e) => this.setState({ data: { ...this.state.data, addr: e.target.value } })} rows={5} className="form-control" id="add" />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

          </div>
          : null}
        <Modal onCancel={() => {
          this.setState({ success: "" })
          this.handleCancel()
        }} title={`${this.state.registered ? "Record updated for the patient" : "New patient record created"}`} visible={!!this.state.success} destroyOnClose={true} footer={null}>
          <h1>{this.state.success}</h1>
        </Modal>
      </div>
    );
  }
}
