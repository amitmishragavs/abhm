import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:8000/';

class ABDMService {
    session: any = {}
    async getSession() {
        const res = await axios.post(API_URL + 'sessions');
        if (res.data) {
            this.session = res.data
            localStorage.setItem("sessions", JSON.stringify(this.session));
        }
    }
    getUserToken() {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user)
        return token;
    }

    async getAadhaarOtp(aadharnumber: string | null) {
        const res = await axios.post(`${API_URL}generateotp`, { aadhaar: aadharnumber }, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });

        return res.data;

    }

    async verifyAadharOtp(otp: any, txn: any) {
        if (!txn || !otp) return false;
        const data = { otp, txnId: txn };
        const res = await axios.post(`${API_URL}verifyaadhaarotp`, data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
        return res.data;
    }

    async getMobileOtp(mobile: any, txn: any) {
        const data = { mobile, txnId: txn };
        const res = await axios.post(`${API_URL}generatemobileotp`, data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
        return res.data;
    }

    async verifyMobileOtp(otp: any, txn: any) {
        const data = { otp, txnId: txn };
        const res = await axios.post(`${API_URL}verifymobileotp`, data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
        return res.data;
    }

    async createHealthId(data: any) {
        const res = await axios.post(`${API_URL}createhealthidwithpreverified`, data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
        return res.data;
    }

    async checkHealthId(data: any) {
        const res = await axios.post(`${API_URL}existsbyhealthid`, data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
        return res.data;
    }

    saveAadharDetails(data: any) {
        return axios.post(API_URL + 'save_aadhaar_data', data);
    }


    getAadharDetrailsUpload(img: File) {

        const data = new FormData()

        data.append('file', img)

        return axios.post(API_URL + "upload_img", data, {
            headers: {

                // Overwrite Axios's automatically set Content-Type

                'Content-Type': 'multipart/formData'

            }
        });
    }

    searchByHealthId(healthId: string) {
        const data = { healthId }
        return axios.post(API_URL + 'searchByHealthId', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }

    authInit(data: any) {
        return axios.post(API_URL + 'authInit', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }

    confirmOtp(data: any) {
        return axios.post(API_URL + 'confirmWithAadhaarOtp', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }

    confirmMobileOtp(data: any) {
        return axios.post(API_URL + 'confirmWithMobileOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }

    generateForgetOtp(data: any) {
        return axios.post(API_URL + 'mobile/generateOtp', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }

    getHealthId(data: any) {
        return axios.post(API_URL + 'healthId/mobile', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
            }
        });
    }


    //update mobile number
    newMobileOtpGenerate(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'mobile/new/generateOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    verifyNewMobileOtp(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'mobile/new/verifyOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    oldMobileOtpGenerate(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'mobile/old/generateOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    oldAadhaarOtpGenerate(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'mobile/aadhaar/generateOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    updateAuthentication(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'mobile/update/authentication', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    //update email
    updateInitiate(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'initiate/send', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    updateVerify(data: any) {
        const token = this.getUserToken()
        return axios.post(API_URL + 'verification/auth/verify', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    getProfile() {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user)

        // const token = "eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI5MS0xNjAxLTQ0NjYtNzA0NyIsImNsaWVudElkIjoiU0JYXzAwMTg0OSIsInN5c3RlbSI6IkFCSEEtTiIsIm1vYmlsZSI6IjkzMjY2ODQ2MDYiLCJoZWFsdGhJZCI6ImFtaXRtaXNocmFweUBzYngiLCJleHAiOjE2NjE5NTYyNzYsImhlYWx0aElkTnVtYmVyIjoiOTEtMTYwMS00NDY2LTcwNDciLCJpYXQiOjE2NjE5NTQ0NzZ9.d2EyKI1enV4hvNa1posHyoQLgW9KxjYaKWZ9xaBOC2Y68xnO5iJ9hlryCCwMQk3dIZeZEA3f216yonCxgyq5XcrRcAsAplDNU_aqhZ_q4GzJTFGF9WkmyF0ks3GOdWlnia02jrQEHD-atcS33pIcJp0OzdSxxBT0JznRxETIBs2xCQ7KkR9SP_RlNahjiUk5H1ekbRvB0vP-KF54a23D37KaHYaoVph0v_MB6MYkCBgszKk8RuZ4Va2CXn7pPfFafDTJiYBeQf5eqFggbj42RMZiKW-blm_jCt_3qBUH5GWMl7bqBAHMSm0CAcDrA4TXhJrBw4v2RufrhAsRlcxmheLjJ5u8k0tcoMQ4xIrqa_F1CeV5AmyDPZJbbDa-oQY7s27-JO7FAVrFvwyHY5IqJWzfyhGQOMWJKHddM8AouTToQHDnOg2IGzrLNQ5xwoWPgvJq3uKRz0A1ZKUFIAeVpwC4UelMjTgfafIPW1C9JGcfgyrdnMMMKm4nk_kat0MIwwFJsmCvxRPHHpHCHTDBI7k57QSmLeaBFZYF_NB-Aj99rmQLuaL_T65GZEkIJvZMt4Z3SAkQnqw7oT7-5gHnMw9NKgn2HSyPTXrBO63dbIegeE7Qn1t-GwZ_7GTBlnfJJeRaOFkiJq0a8Ofd4WQfLwuarAnoXltVvJ0QtotOtRs"
        return axios.get(API_URL + 'getProfile', {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    getProfilePng() {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user)
        // const token ="eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI5MS0xNjAxLTQ0NjYtNzA0NyIsImNsaWVudElkIjoiU0JYXzAwMTg0OSIsInN5c3RlbSI6IkFCSEEtTiIsIm1vYmlsZSI6IjkzMjY2ODQ2MDYiLCJoZWFsdGhJZCI6ImFtaXRtaXNocmFweUBzYngiLCJleHAiOjE2NjIwNTk2ODksImhlYWx0aElkTnVtYmVyIjoiOTEtMTYwMS00NDY2LTcwNDciLCJpYXQiOjE2NjIwNTc4ODl9.UuEFhYJxME25FOfMJ-O308DNoGXbZKMoY22B2bWEx5xG7ehq7jkE4cWNY38h7WpSNO-pvrxyRxyYxDp9h5M9Y97mz4ZbzvS7KwwYC8bYILnS4as2sWRkcW2EiVdRjXlPsee1vsnPDu19fLVVLTF4mUeahi3whUW5icVCzIbFCL-cobn67QrKCA5cyQyt2es_zg3Xx5aZ8l9jaMaIsuPA0a73FJNkcgsJrbzIpNdIAaxwHxq1cby4Md9faM6B1kqr825BXArCZbkzgAKHLMCY7mtHnuv-g9dTFo8vp2vEHgYwk-vAocL_8t1HHKwrEy4DYPQ5lDfQ8d0fzxN2750n5UEevjxoCvypwh5u1Ie3UDMJJJ8XL-ClpoqJ8cS2P9wmCjA_tsaWKseglavYAsyqiu-w4q0F2zebFI81_fb-Gci71nzJpaVsEVFY-UiWBcsM5hIGMu5I-UQCKMGEmDtnzDJiQ25vOf6L645JAbVPmAtNFGk7K1CkQWyb55cvLhSA7n0M9_hpW4vcnl5mMZ9c3LvDJLE-AA0NxImgsb_epmAOONxAhSuNOcjvlcGJ_STrm3kDyPXVu4P9GwKYcIiy47lgC-GQZTUzvDYL_nMXBB2h6UTWCHEe7n8b_VEdgWrj8u7w9y_is4YMeRtleWG6AdaApk-x47AfIs0JgFqnLEM"

        // const token = "eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI5MS0xNjAxLTQ0NjYtNzA0NyIsImNsaWVudElkIjoiU0JYXzAwMTg0OSIsInN5c3RlbSI6IkFCSEEtTiIsIm1vYmlsZSI6IjkzMjY2ODQ2MDYiLCJoZWFsdGhJZCI6ImFtaXRtaXNocmFweUBzYngiLCJleHAiOjE2NjIwNTg0MjEsImhlYWx0aElkTnVtYmVyIjoiOTEtMTYwMS00NDY2LTcwNDciLCJpYXQiOjE2NjIwNTY2MjF9.mEsz-bzCJPgW0BI0erWv2UcQbrzREYWUfzUzkaVSycKYFPZGxPyw1iXfAQx4RfTPs33BnN3AWgtNUIBB7oszDh03S4iWW5cyBZLYV_WKXOznoORr1BOr7q4ewM_zdhk8PQtHucTJYyStSccgXTn8QupLk6-eDTthoDoUN0uah0kWy9mHQQL1VT43SZluxUHz77E3as0QJGbYjc_NWIB62XbHW8JKS9aEc3YHFblgvZSlfnmqjJlGLyRqx7kqCV6R5MHIp43jF5xYG30cFclqSR4P9lNYm6LB_MzDc1uc_nyzTbzT1gky8VPdAgvqt92IHF1ih7HsH-MGQ92tKKBydkEqGclawC22A_U5gG4a4FZUrTUgV5ddWUmBNO9S6uSvKy03thjf5C8u6x1jUuBL5UCOJKaT6qhjO8bS3ih7h8Aug66g0UB0w7aieh7XCzOLmr2tZOaBNDIQ6dIJLAcahlu1kPuc6m9DFEERhkjnbNQxFXu1WAiaol-PRJessg9Ws-ScXNR3u3euf7z8Mx3cAAe6DmLdgSOtzAUeiuZ9-sDw01HA32IIMR5GfQ-xrYxg8D5-tTD8tP3ebBUtuTZnhA83GvgUmFHckLNEV3xrK7-676DsMk6A9gKw6WRDz2b5DJr2SHk98fJ3u0jrcVT5V8IPCRAGfHwsL0kziWIaqJo"
        return axios.get(API_URL + 'getPngCard', {
            responseType: "arraybuffer",
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    getQRPng() {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user)
        // const token ="eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiI5MS0xNjAxLTQ0NjYtNzA0NyIsImNsaWVudElkIjoiU0JYXzAwMTg0OSIsInN5c3RlbSI6IkFCSEEtTiIsIm1vYmlsZSI6IjkzMjY2ODQ2MDYiLCJoZWFsdGhJZCI6ImFtaXRtaXNocmFweUBzYngiLCJleHAiOjE2NjIwNTk2ODksImhlYWx0aElkTnVtYmVyIjoiOTEtMTYwMS00NDY2LTcwNDciLCJpYXQiOjE2NjIwNTc4ODl9.UuEFhYJxME25FOfMJ-O308DNoGXbZKMoY22B2bWEx5xG7ehq7jkE4cWNY38h7WpSNO-pvrxyRxyYxDp9h5M9Y97mz4ZbzvS7KwwYC8bYILnS4as2sWRkcW2EiVdRjXlPsee1vsnPDu19fLVVLTF4mUeahi3whUW5icVCzIbFCL-cobn67QrKCA5cyQyt2es_zg3Xx5aZ8l9jaMaIsuPA0a73FJNkcgsJrbzIpNdIAaxwHxq1cby4Md9faM6B1kqr825BXArCZbkzgAKHLMCY7mtHnuv-g9dTFo8vp2vEHgYwk-vAocL_8t1HHKwrEy4DYPQ5lDfQ8d0fzxN2750n5UEevjxoCvypwh5u1Ie3UDMJJJ8XL-ClpoqJ8cS2P9wmCjA_tsaWKseglavYAsyqiu-w4q0F2zebFI81_fb-Gci71nzJpaVsEVFY-UiWBcsM5hIGMu5I-UQCKMGEmDtnzDJiQ25vOf6L645JAbVPmAtNFGk7K1CkQWyb55cvLhSA7n0M9_hpW4vcnl5mMZ9c3LvDJLE-AA0NxImgsb_epmAOONxAhSuNOcjvlcGJ_STrm3kDyPXVu4P9GwKYcIiy47lgC-GQZTUzvDYL_nMXBB2h6UTWCHEe7n8b_VEdgWrj8u7w9y_is4YMeRtleWG6AdaApk-x47AfIs0JgFqnLEM"

        return axios.get(API_URL + 'qrCode', {
            responseType: "arraybuffer",
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    mobileGenerateOTP(data: any) {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user);

        return axios.post(API_URL + 'account/mobile/generateOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    aadhaarGenerateOTP(data: any) {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user);

        return axios.post(API_URL + 'account/aadhaar/generateOTP', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }

    profileDelete(data: any) {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user);

        return axios.post(API_URL + 'account/profile/delete', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }
    profileDeactivate(data: any) {
        let user = localStorage.getItem("abdm_user");

        if (!user) return Promise.reject();
        const { token } = JSON.parse(user);

        return axios.post(API_URL + 'account/profile/deactivate', data, {
            headers: {
                'Authorization': `Bearer ${this.session.accessToken}`,
                "X-TOKEN": `Bearer ${token}`
            }
        });
    }
}


export default new ABDMService();