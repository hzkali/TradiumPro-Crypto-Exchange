import Icon from "components/icon/Icon.component";
import Link from "next/link";
import React, { FC } from "react";
import styles from "./BackButton.module.sass";

interface BackButtonProps {
  title: string;
  link: string;
  marginBottom?: number;
}

export const BackButton: FC<BackButtonProps> = ({
  title,
  link,
  marginBottom,
}) => {
  return (
    <div
      style={{ marginBottom: `${marginBottom ? marginBottom : 0}px` }}
      className={styles.backButton}
    >
      <Icon name="arrow-left" size={30} className={styles.icon} />
      <Link href={link || "/"}>
        <a className={styles.backButtonTitle}>{title || "Title"}</a>
      </Link>
    </div>
  );
};
