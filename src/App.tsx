import { Component } from "react";
import { Switch, Route } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";


import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";

import EventBus from "./common/EventBus";
import Search from "./components/search.component";
import Enroll from "./components/enroll.component";
import HeaderComponent from "./components/header.component";
import abdmService from "./services/abdm.service";
import AadhaarDetails from "./components/aadhaarDetails.component";
import Term from "./components/Term";
import ABHAVerification from "./components/loginAbha.component";
import ABHALogin from "./components/ABHM/Login";
import ABHMCard from "./components/ABHM/Card";
import ForgetABHA from "./components/ForgetABHA";
type Props = {};

type State = {
  currentUser: IUser | undefined
  loading: boolean
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      loading:true
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    // const sessions = localStorage.getItem('sessions');
    // if (!sessions) {
      abdmService.getSession().then(res=>{
        this.setState({loading:false});
      })
    // } else {
    //   abdmService.session = JSON.parse(sessions);
    // }

    if (user) {
      this.setState({
        currentUser: user
        // showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
   
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="app-wrapper">

        { window.location.pathname!=="/login" ? <HeaderComponent currentUser={currentUser} /> : null}

        <div style={{ background: "#ECF5FF" }}>
          <div className="container-wrapper container">
           {!this.state.loading &&  <Switch>
              <Route exact path={["/", "/login"]} component={Login} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/login_abha" component={ABHALogin} />
              <Route exact path="/abha_verification" component={ABHAVerification} />
              <Route path="/register" component={Search} />
              <Route path="/enroll" component={Enroll} />
              <Route path="/abdm_profile" component={AadhaarDetails} />
              <Route path="/abdm_card" component={ABHMCard} />
              <Route path="/forget" component={ForgetABHA} />
              <Route path="/term" component={Term} />
            </Switch>}
          </div>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;