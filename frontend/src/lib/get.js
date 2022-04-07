//This function accepts api and token to send get request, and return the response object from server. Moreover, the status code is added to data.status for further use.
//The token is an optional parameter.
function get(url) {
  const token = localStorage.getItem("token") || "";
  let status;

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      data.status = status;
      return data;
    });
}
export default get;
