import { FC } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import styles from "./SwalAlert.module.sass";
import cn from "classnames";
import { SwalAlertType } from "./SwalAlert.component.type";
import useDarkMode from "use-dark-mode";
import useTranslation from "next-translate/useTranslation";

const swalWithCustomButtons: any = Swal.mixin({
  customClass: {
    confirmButton: cn(styles.button, "button button-small"),
    cancelButton: cn(styles.button, "button button-stroke button-small"),
  },
  buttonsStyling: false,
});

export const SwalAlert: FC<SwalAlertType> = ({
  data,
  className,
  btnText,
  onConfirm,
  onCancel,
  link = false,
  style,
  disabled = false,
}) => {
  const { t } = useTranslation("common");

  const darkMode = useDarkMode(false);

  const handleClick = (e: any) => {
    swalWithCustomButtons
      .fire({
        title: t("Are you sure?"),
        confirmButtonText: t("Confirm"),
        background: darkMode.value ? "#23262F" : "",
        color: darkMode.value ? "#FCFCFD" : "",
        allowOutsideClick: true,
        allowEscapeKey: true,
        ...data,
      })
      .then((res: SweetAlertResult) => {
        if (res.isConfirmed && onConfirm) {
          onConfirm(e);
        }

        if (res.isDismissed && onCancel) {
          onCancel();
        }
      });
  };

  return (
    <button
      type="button"
      className={link ? className : "button " + className}
      style={style}
      disabled={disabled}
      onClick={handleClick}
    >
      {btnText ? btnText : t("Confirm")}
    </button>
  );
};

// Usage
/*
import { SwalAlert } from "components/swal_alert/SwalAlert.component";
import toast from "react-hot-toast";

const SwalData = {
  icon: "",
  title: "This is the title...",
  text: "You won't be able to revert this!",
  showCancelButton: true,
  showConfirmButton: true,
  confirmButtonText: "Enable",
  allowOutsideClick: false,
  allowEscapeKey: false,
};

const handleConfirm = async (id: number) => {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const data = await res.json();
    console.log(data);

    toast.success("Fetched: " + data.title);
  } catch (err: any) {
    toast.error(err.message);
  }
};

const handleCancel = () => {
  toast.error("Cancelled");
};

<SwalAlert
  data={SwalData}
  btnText="Enable feature"
  className="button-red"
  onConfirm={() => handleConfirm(2)}
  onCancel={handleCancel}
/>
*/
