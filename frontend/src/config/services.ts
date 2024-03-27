import { ServicesConfigType } from "./config";

const ServicesConfig: ServicesConfigType = {
  ether_scan_url:
    process.env.NEXT_PUBLIC_ETHERSCAN_URL || "https://etherscan.io",
};
export default ServicesConfig;
