//This function accepts api and data to send put request, and return the response object from server. Moreover, the status code is added to the response object for further use.
function put(url, data) {
  let status;
  const token = localStorage.getItem("token") || "";
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify(data),
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
export default put;
