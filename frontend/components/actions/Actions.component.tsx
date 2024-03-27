import { useState } from "react";
import Link from "next/link";
import cn from "classnames";
import styles from "./Actions.module.sass";
import { TransferWallet } from "../transfer/TransferWallet.component";
import { ImageItem } from "components/images";
import useTranslation from "next-translate/useTranslation";
import Icon from "components/icon/Icon.component";
import { CustomModal } from "components/modal/CustomModal.component";

const items = [
  {
    title: "Bank deposit",
    content:
      "Deposit crypto or cash currency to your wallet and start trading on the world largest exchange!",
    color: "var(--s2)",
    image: "/images/content/actions-pic-1.png",
    image2x: "/images/content/actions-pic-1@2x.png",
    buttonText: "Bank deposit",
    url: "/deposit/fiat",
  },
  {
    title: "Transfer",
    content: "Internal transfers are free on Bitcloud.",
    color: "var(--s4)",
    image: "/images/content/actions-pic-2.png",
    image2x: "/images/content/actions-pic-2@2x.png",
    buttonText: "Transfer coin",
  },
];

const Actions = ({ className }: { className: string }) => {
  const { t } = useTranslation("common");
  const [visibleTransfer, setVisibleTransfer] = useState(false);

  return (
    <>
      <div className={cn(className, styles.actions)}>
        <div className={styles.list}>
          {items.map((x, index) => (
            <div className={styles.item} key={index}>
              <div
                className={styles.preview}
                style={{ backgroundColor: x.color }}
              >
                <ImageItem src={x.image} layout="intrinsic" alt={t("Cards")} />

                {/* <img srcSet={`${x.image2x} 2x`} src={x.image} alt={x.title} /> */}
              </div>
              <div className={styles.details}>
                <div className={styles.title}>{x.title}</div>
                <div className={styles.content}>{x.content}</div>
                {x.url ? (
                  <Link href={x.url}>
                    <a
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                    >
                      <span>{x.buttonText}</span>
                      <Icon name="arrow-next" size="10" />
                    </a>
                  </Link>
                ) : (
                  <button
                    className={cn("button-stroke button-small", styles.button)}
                    onClick={() => setVisibleTransfer(true)}
                  >
                    <span>{x.buttonText}</span>
                    <Icon name="arrow-next" size="10" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CustomModal
        visible={visibleTransfer}
        onClose={() => setVisibleTransfer(false)}
      >
        <TransferWallet />
      </CustomModal>
    </>
  );
};

export default Actions;
