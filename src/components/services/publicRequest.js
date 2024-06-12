import axios from "axios";

const publicRequest = axios.create();

export const publicGet = (endPoints) => {
  publicRequest.get(endPoints);
};

export default publicRequest