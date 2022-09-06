import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://1be6-34-139-167-51.ngrok.io/';

class AadharService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
}

  getAadharDetails(aadharnumber: string) {
    return axios.get(API_URL + 'aadhaar_data_retrieval?aadhaar_num=' + aadharnumber, { headers: authHeader() });
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
}

export default new AadharService();
