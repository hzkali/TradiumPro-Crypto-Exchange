export interface SwalAlertType {
  className?: string;
  data: SwalDataType;
  btnText: string | React.ReactNode;
  onConfirm?: Function;
  onCancel?: Function;
  link?: boolean;
  style?: object;
  disabled?: boolean;
}

export interface SwalDataType {
  icon?: string;
  title?: string;
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
}
