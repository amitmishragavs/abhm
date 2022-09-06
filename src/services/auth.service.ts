import axios from "axios";
//import { Profiler } from "react";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username: string, password: string) {
    // return axios
    //   .post(API_URL + "signin", {
    //     username,
    //     password
    //   })
    //   .then(response => {
    //     if (response.data.accessToken) {
    //       localStorage.setItem("user", JSON.stringify(response.data));
    //     }

    //     return response.data;
    //   });
    if(username === "admin" && password === "admin"){
      localStorage.setItem("user", JSON.stringify({"username": "Admin"}));
      return Promise.resolve('Success');
    }else
      return Promise.reject('login');
    
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("sessions")
    localStorage.removeItem("abdm_user")
    localStorage.removeItem("abdm_profile")
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
