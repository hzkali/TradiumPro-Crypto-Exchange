import { APIConfigType } from "./config";
const APIConfig: APIConfigType = {
  endpoint: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql",
  fetchParams: {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
};
export default APIConfig;
