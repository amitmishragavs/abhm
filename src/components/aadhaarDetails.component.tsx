import { Button, Divider, Spin } from 'antd'
import React, { Component } from 'react'
import Modal from '../common/Modal'
import Tabs from '../common/Tabs'
import abdmService from '../services/abdm.service'
import './aadhaardetails.scss'
import DeactivateAadhaar from './Deactivate/Aadhaar/Aadhaar'
import DeactivateMobile from './Deactivate/Mobile/Mobile'
import DeleteAadhaar from './Delete/Aadhaar/Aadhaar'
import DeleteMobile from './Delete/Mobile/Mobile'
import EAadhaar from './Update/Email/Aadhaar'
import EMobile from './Update/Email/Mobile'
import MAadhaar from './Update/Mobile/Aadhaar'
import MMobile from './Update/Mobile/Mobile'


// const Detail = ({ title, children }: any) => {
//   return <div className='detail'>
//     <b>{title}</b>
//     <span>{children}</span>
//   </div>
// }
const Detail = ({ title, children, onUpdate }: any) => {

  return <tr className='detail'>
    <td ><b>{title}</b></td>
    <td>
      <span>{children}</span>
    </td>
    {onUpdate && <td>
      <Button onClick={onUpdate}>Update</Button>
    </td>}
  </tr>
}

type State = {
  data: any,
  loading: boolean
  modal: string
  qr: string
  profile: string
  card: any
  deactivate: any
}
type Props = {
  history: any;
}

export default class AadhaarDetails extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      modal: "",
      qr: "",
      profile: "",
      card: {},
      deactivate: {}
    }
  }
  componentDidMount() {
    const user = localStorage.getItem("abdm_profile");
    if (user) {
      this.setState({ data: JSON.parse(user), loading: false })
    } else {

      abdmService.getProfile().then(res => {
        if (res.data) {
          localStorage.setItem("abdm_profile", JSON.stringify(res.data));
          this.setState({ data: res.data, loading: false })
        }
      });

      // this.props.history.replace('/search');
    }
    abdmService.getQRPng().then((res: any) => {
      if (res.data) {
        this.setState({ qr: Buffer.from(res.data, "binary").toString("base64") })
      }
    })
    abdmService.getProfilePng().then((res: any) => {
      if (res.data) {
        this.setState({ profile: Buffer.from(res.data, "binary").toString("base64") })
      }
    })
  }
  render() {
    const { data, modal, qr, card, profile, deactivate } = this.state;
    return <div className="registration-wrapper-detail">
      <div className="registration-nav-detail">
        <div className="tab">ABDM User</div>
      </div>

      {this.state.loading ? <div className='profile-loader'><Spin spinning={this.state.loading}></Spin> </div> : <div className="profile-wrapper">
        <section className='profile-photo'>
          <div style={{ textAlign: "center", padding: "0 1rem" }}>
            <img style={{
              borderRadius: "50%",
              height: "152px",
            }}
              src={`data:image/png;base64, ${data.profilePhoto}`} alt="Red dot" />
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{data.name}</span>
              <span>{data.gender}</span>
            </div>

          </div>
        </section>
        {/* <Divider /> */}
        <section className='profile-detail'>
          <Tabs className="" titles={['Personal', "Address", "ABHM Card", "Deactivate/Delete"]} defaultActiveKey="1" type="card" style={{ marginBottom: 32 }}>
            <section className='personal'>
              <table>
                <tbody>
                  <Detail title="Email" onUpdate={() => this.setState({ modal: "email" })}>
                    {data.email}
                  </Detail>
                  <Detail title="Mobile" onUpdate={() => this.setState({ modal: "mobile" })}>
                    {data.mobile}
                  </Detail>
                  <Detail title="Health ID">
                    {data.healthId}
                  </Detail>
                  <Detail title="DOB">
                    {`${data.dayOfBirth}/${data.monthOfBirth}/${data.yearOfBirth}`}
                  </Detail>

                </tbody>
              </table>

            </section>
            <section className='personal'>
              <table>
                <tbody>

                  <Detail title="District">
                    {data.districtName}
                  </Detail>
                  <Detail title="State">
                    {data.stateName}
                  </Detail>
                </tbody>
              </table>
            </section>
            <section className='abdm-card display-gap'>
              <Button onClick={() => this.setState({ card: { file: profile, title: "ABHA Card" } })}>ABHM Profile</Button>
              <Button onClick={() => this.setState({ card: { file: qr, title: "QR Code" } })}>Profile QR</Button>
            </section>
            <section className='abdm-card display-gap'>
              <Button onClick={() => this.setState({ deactivate: { type: "Deactivate" } })}>Deactivate</Button>
              <Button onClick={() => this.setState({ deactivate: { type: "Delete" } })}>Delete</Button>
            </section>
          </Tabs>
          {/* <p style={{ fontSize: "20px", fontWeight: "bold", opacity: 0.7 }}>Personal Detail</p>

          <Divider />
          <p style={{ fontSize: "20px", fontWeight: "bold", opacity: 0.7 }}>Address</p> */}

        </section>
      </div>}
      <Modal visible={Object.keys(card).length} title={card.title} onCancel={() => this.setState({ card: {} })}>
        <div style={{ textAlign: "center" }}>
          <img style={{ width: "-webkit-fill-available" }} src={`data:image/png;base64,${card.file}`} />
        </div>
      </Modal>
      <Modal visible={modal === "email"} title="Update Email" onCancel={() => this.setState({ modal: "" })}>
        <Tabs titles={["Mobile", "Aadhaar"]}>

          <EMobile />
          <EAadhaar />
        </Tabs>
      </Modal>
      <Modal visible={modal === "mobile"} title="Update Mobile" onCancel={() => this.setState({ modal: "" })}>
        <Tabs titles={["Mobile", "Aadhaar"]}>
          <MMobile />
          <MAadhaar />
        </Tabs>
      </Modal>

      <Modal visible={Object.keys(deactivate).length} title={deactivate.type} onCancel={() => this.setState({ deactivate: {} })}>
        <Tabs titles={["Mobile", "Aadhaar"]}>
          {deactivate.type === "Deactivate" ? <DeactivateMobile /> : <DeleteMobile />}
          {deactivate.type === "Deactivate" ? <DeactivateAadhaar /> : <DeleteAadhaar />}
        </Tabs>
      </Modal>

    </div>
  }
}

