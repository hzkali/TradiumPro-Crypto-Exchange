import cn from "classnames";
import styles from "./Switch.module.sass";

interface SwitchProps {
  className: string;
  value: boolean;
  onChange: () => void;
}

const Switch = ({ className, value, onChange }: SwitchProps) => {
  return (
    <label className={cn(styles.switch, className)}>
      <input
        className={styles.input}
        type="checkbox"
        checked={value}
        onChange={onChange}
      />
      <span className={styles.inner}>
        <span className={styles.box}></span>
      </span>
    </label>
  );
};

export default Switch;
