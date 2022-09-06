import React, { useState } from 'react'

function Aadhaar() {
  const [step, setStep] = useState(0);

  return "";
//   (
//     { step === 1 ? <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
//       <Input disabled={this.state.loading || !!this.state.txn} onChange={this.handleAadharNoChange} placeholder="Enter Aadhaar Number" />

//       {this.state.txn && <Input onChange={(e) => this.setState({ otp: e.target.value })} placeholder="Enter Aadhaar OTP" />}
//       {!this.state.txn ? <div className="term-condition">
//         <Checkbox onChange={(e) => this.setState({ agree: e.target.checked })} />
//         <span>I agree <a target="_blank" href="/term">term & condition</a></span>
//       </div> : null}
//       <Button disabled={!this.state.agree || this.state.loading || this.state.aadharNo?.length !== 12} style={{ width: "100%" }} onClick={this.handleSearch} type="primary">{this.state.txn ? "Submit" : "Get OTP"}</Button>
//     </div> : null}
//   )
}

export default Aadhaar