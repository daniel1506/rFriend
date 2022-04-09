import { ContentSecurityPolicyOptions } from "helmet/dist/types/middlewares/content-security-policy";

const policy: ContentSecurityPolicyOptions = {
  directives: {
    connectSrc: [`'self'`, `rfriend.herokuapp.com`],
    imgSrc: [`'self'`, `data:`, `*`],
    scriptSrc: [`'self'`, `maps.googleapis.com`],
  },
};

export default policy;
