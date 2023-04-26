import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
  });

export const setConnectionHeader = (header: string) => {
  $api.defaults.headers.common['ConnString'] = header;
}

const defaultDB: string = process.env.REACT_APP_DB_URLS?.split(" ")[0]!;
setConnectionHeader(defaultDB);

export default $api;