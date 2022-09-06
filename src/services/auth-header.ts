export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr)
    user = JSON.parse(userStr);

  if (user && user.accessToken) {
    // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    return { 'x-access-token': user.accessToken,"Access-Control-Allow-Origin": "*" };       // for Node.js Express back-end
  } else {
    return {"Access-Control-Allow-Origin": "*"};
  }
}