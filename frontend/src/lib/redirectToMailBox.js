const redirectToMailBox = (email) => {
  let emailDomain = email.split("@")[1];
  window.open(`http://${emailDomain}`, "_blank");
};
export default redirectToMailBox;
