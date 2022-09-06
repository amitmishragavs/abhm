import JSEncrypt from 'jsencrypt';

export function publicRsaEncrypt(data){
    var encrypt = new JSEncrypt();
    return encrypt.setPublicKey(data);
}