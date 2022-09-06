from email import header
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from pydantic import BaseModel
from fastapi import FastAPI, Header
from fastapi.responses import FileResponse
from fastapi.responses import StreamingResponse
from io import BytesIO

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ABDM = {
  "clientId": "SBX_001849",
  "clientSecret": "308cffd8-f9a2-455b-a1b8-5947f95acea8"
}

# https://dev.abdm.gov.in/gateway/v0.5/sessions
# https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/generateOtp
# https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/verifyOTP
# https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/generateMobileOTP
# https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/verifyMobileOTP
# https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/createHealthIdWithPreVerified
# https://healthidsbx.abdm.gov.in/api/v1/search/existsByHealthId



class Addhaar(BaseModel):
    aadhaar: str

class Mobile(BaseModel):
    mobile: str

class VerifyOtp(BaseModel):
    otp: str
    txnId: str

class GenerateOtp(BaseModel):
    mobile: str
    txnId: str

class HealthID(BaseModel):
    healthId: str

class AuthInit (BaseModel):
    authMethod: str
    healthid: str
    
class UpdateInitiate (AuthInit):
    emailAddress: str

class HealthData(BaseModel):
    email: str
    firstName: str
    healthId: str
    lastName: str
    middleName: str
    password: str
    txnId: str

class ForgetHealth(BaseModel):
    otp:str
    gender:str
    firstName:str
    name:str
    yearOfBirth:str
    txnId: str

class AuthMethod(VerifyOtp):
    authMethod:str

@app.post("/sessions")
def read_root():
    endpoint = "https://dev.abdm.gov.in/gateway/v0.5/sessions"
    headers={}
    return requests.post(endpoint, json=ABDM, headers=headers).json()

# Register through aadhaar

@app.post("/generateotp")
def read_root(item:Addhaar,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/generateOtp"
    data = {"aadhaar": item.aadhaar}
    headers = {"Authorization": Authorization}
    return requests.post(endpoint, json=data, headers=headers).json()


@app.post("/verifyaadhaarotp")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/verifyOTP"
    data = {"otp": item.otp,"txnId":item.txnId}
    headers = {"Authorization": Authorization}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/generatemobileotp")
def read_root(item:GenerateOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/generateMobileOTP"
    data = {"mobile": item.mobile,"txnId":item.txnId}
    headers = {"Authorization": Authorization}
    return requests.post(endpoint, json=data, headers=headers).json()
    
@app.post("/verifymobileotp")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/verifyMobileOTP"
    data = {"otp": item.otp,"txnId":item.txnId}
    headers = {"Authorization": Authorization}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/createhealthidwithpreverified")
def read_root(item:HealthData,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/registration/aadhaar/createHealthIdWithPreVerified"
    data = {"email": item.email,"firstName": item.firstName, "healthId": item.healthId, "lastName": item.lastName,"middleName": item.middleName,
    "password": item.password,"txnId":item.txnId}
    headers = {"Authorization": Authorization}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/existsbyhealthid")
def read_root(item:HealthID,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/search/existsByHealthId"
    headers = {"Authorization": Authorization}
    data = {"healthId":item.healthId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.get("/getPngCard")
def read_root(*,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/health/facility/getPngCard"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    res = requests.get(endpoint,  headers=headers).content
    file = open("sample_image.png", "wb")
    file.write(res)
    return StreamingResponse(BytesIO(res))

@app.get("/qrCode")
def read_root(*,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/account/qrCode"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    res = requests.get(endpoint,  headers=headers).content
    file = open("sample_image.png", "wb")
    file.write(res)
    return StreamingResponse(BytesIO(res))

@app.get("/getProfile")
def read_root(*,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/account/profile"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    return requests.get(endpoint, headers=headers).json()

#update email
@app.post("/initiate/send")
def read_root(item:UpdateInitiate,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/email/verification/auth/initiate/send"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    data = {"emailAddress": item.emailAddress,"authMethod": item.authMethod}
    return requests.post(endpoint, json=data, headers=headers).json()

#Update Mobile number 
@app.post("/mobile/new/generateOTP")
def read_root(newMobileNumber,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/change/mobile/new/generateOTP"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    data = {"newMobileNumber":newMobileNumber}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/mobile/new/verifyOTP")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/change/mobile/new/verifyOTP"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    data = {"otp":item.otp, "txnId":item.txnId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/mobile/old/generateOTP")
def read_root(txnId,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/change/mobile/old/generateOTP"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    data = { "txnId":txnId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/mobile/update/authentication")
def read_root(item:AuthMethod,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/change/mobile/update/authentication"
    headers = {"Authorization":Authorization,"X-Token": x_token}
    data = {"otp":item.otp, "txnId":item.txnId, "authMethod":item.authMethod}
    return requests.post(endpoint, json=data, headers=headers).json()


# Verification or login
@app.post("/searchByHealthId")
def read_root(item:HealthID,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/search/searchByHealthId"
    headers = {"Authorization":Authorization}
    data={"healthId":item.healthId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/authInit")
def read_root(item:AuthInit ,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/auth/init"
    headers = {"Authorization":Authorization}
    data = {"authMethod": item.authMethod,"healthid":item.healthid}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/confirmWithAadhaarOtp")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/auth/confirmWithAadhaarOtp"
    headers = {"Authorization":Authorization}
    data = {"otp": item.otp,"txnId":item.txnId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/confirmWithMobileOTP")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/auth/confirmWithMobileOTP"
    headers = {"Authorization":Authorization}
    data = {"otp": item.otp,"txnId":item.txnId}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/confirmWithMobileOTP")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/auth/confirmWithMobileOTP"
    headers = {"Authorization":Authorization}
    data = {"otp": item.otp,"txnId":item.txnId}
    return requests.post(endpoint, json=data, headers=headers).json()

# mobile registration

@app.post("/mobile/generateOtp")
def read_root(item:Mobile,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/forgot/healthId/mobile/generateOtp"
    data = {"mobile": item.mobile}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/healthId/mobile")
def read_root(item:ForgetHealth,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v1/forgot/healthId/mobile"
    data = { "otp":item.otp,"gender":item.gender,"firstName":item.firstName,"name":item.name,"yearOfBirth":item.yearOfBirth,
    "txnId": item.txnId}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()

# Delete HID Using Aadhaar/Mobile

@app.post("/account/aadhaar/generateOTP")
def read_root(item:Addhaar,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/aadhaar/generateOTP"
    data = { "aadhaar": item.aadhaar}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()

@app.post("/account/profile/delete")
def read_root(item:VerifyOtp,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/profile/delete"
    data = { "otp":item.otp,"txnId": item.txnId}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()


@app.post("/account/mobile/generateOTP")
def read_root(*,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/mobile/generateOTP"
    data = {}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()

# Deactive HID Using Aadhaar/Mobile

@app.post("/account/profile/deactivate")
def read_root(item:AuthMethod,Authorization: Union[str, None] = Header(default=None),x_token: Union[str, None] = Header(default=None)):
    endpoint = "https://healthidsbx.abdm.gov.in/api/v2/account/profile/deactivate"
    data = {"otp":item.otp, "txnId":item.txnId, "authMethod":item.authMethod}
    headers = {"Authorization": Authorization,"X-Token": x_token}
    return requests.post(endpoint, json=data, headers=headers).json()