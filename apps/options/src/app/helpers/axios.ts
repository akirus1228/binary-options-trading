import axios from "axios";
import { baseServerUrl } from "../core/constants/basic";

export const backendInstance = axios.create({
  baseURL: baseServerUrl,
});
