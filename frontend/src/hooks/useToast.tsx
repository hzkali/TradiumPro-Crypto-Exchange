import Icon from "components/icon/Icon.component";
import toast from "react-hot-toast";
import { TOASTER_MSG_TYPE } from "src/helpers/coreconstants";
import { ToastMessageType } from "types/globalTypes";

export const useToast = () => {
  const customToast = (data: any, type: ToastMessageType) => {
    if (!data || data == "undefined") return;
    if (type === TOASTER_MSG_TYPE.ERROR_OBJ) {
      let newdata;
      try {
        newdata = JSON.parse(data.message);
      } catch (e) {
        if (typeof data === "string") {
          toast.error(data);
        }
        return;
      }

      if (newdata.messages.length) {
        newdata.messages.forEach((message: string) => toast.error(message));
      } else {
        toast.error(newdata.message);
      }
    } else if (type === TOASTER_MSG_TYPE.ERROR_MSG) {
      if (!data) {
        return;
      } else {
        toast.error(String(data));
      }
    } else if (type === TOASTER_MSG_TYPE.SUCCESS_MSG) {
      if (!data) {
        return;
      } else {
        toast.success(String(data));
      }
    } else if (type === TOASTER_MSG_TYPE.WARNING_MSG) {
      if (!data) {
        return;
      } else {
        toast((t) => (
          <span>
            <Icon name="warning" className={"warningIcon"} size={20} />
            {data}
          </span>
        ));
      }
    } else if (type === TOASTER_MSG_TYPE.INFO_MSG) {
      if (!data) {
        return;
      } else {
        toast((t) => (
          <span>
            <Icon name="info" className={"iconIcon"} size={20} />
            {data}
          </span>
        ));
      }
    } else {
      toast.error("Type is not found!");
    }
  };
  return { customToast };
};
