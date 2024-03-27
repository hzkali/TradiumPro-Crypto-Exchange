import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSelector } from "react-redux";
import { F_UserGiftCardTransferHistoryModel } from "src/graphql/generated";
import { formatAmountDecimal, noExponents } from "src/helpers/corefunctions";
import { RootState } from "src/store";
import cn from "classnames";
import styles from "./../GiftCards.section.module.sass";
import { ImageItemFill } from "components/images";
import { ImageCoin } from "components/image_coin/ImageCoin.component";

export const GiftCardHistoryDetails: React.FC<{
  item: F_UserGiftCardTransferHistoryModel;
  refetch: Function;
  closeModal: () => void;
}> = ({ item, refetch, closeModal }) => {
  const { t } = useTranslation("common");
  const userData = useSelector((state: RootState) => state.user);
  return (
    <>
      <div className={cn(styles.detailsWrapper)}>
        <div>
          <div className={cn(styles.item, styles.inModal)}>
            <ImageItemFill
              src={item?.user_gift_card?.template?.image || ""}
              alt={item?.user_gift_card?.template?.title || ""}
            />

            <div className={cn(styles.price)}>
              {item.amount + " " + item.currency?.code}
            </div>
          </div>
        </div>

        <div className={cn(styles.info)}>
          <div className={cn("")}>
            <h4 className="h4 mb-2">{item?.user_gift_card?.template?.title}</h4>

            {item?.user_gift_card?.template?.description && (
              <p className="mb-2">
                {item?.user_gift_card?.template?.description}
              </p>
            )}
            <p className="mb-2">
              <strong>{t("Category: ")}</strong>
              {item?.user_gift_card?.template?.category?.name}
            </p>
            <p className="mb-2 d-flex">
              <strong>{t("Currency: ")}</strong>

              <div className="coinWrapper ml-1">
                <div className={cn("imageWrapper")}>
                  <ImageCoin
                    logo={item.currency?.logo}
                    alt={item.currency?.name || item.currency?.code || ""}
                    placeholder={item.currency?.symbol || item.currency?.code}
                  />
                </div>
                {`${item?.currency?.code} - ${item?.currency?.name}`}
              </div>
            </p>
            <p className="mb-2">
              <strong>{t("From User: ")}</strong>
              {item?.from_user?.usercode == userData?.user?.usercode
                ? t("Me")
                : item?.from_user?.nickname ?? item?.from_user?.usercode}
            </p>

            <p className="mb-2">
              <strong>{t("To User: ")}</strong>
              {item?.to_user?.usercode == userData?.user?.usercode
                ? t("Me")
                : item?.to_user?.nickname ?? item?.to_user?.usercode}
            </p>

            <p className="mb-2">
              <strong>{t("Amount: ")}</strong>
              {noExponents(
                formatAmountDecimal(
                  item.amount,
                  Number(item?.currency?.decimal),
                  true
                )
              ) +
                " " +
                item?.currency?.code}
            </p>

            {item?.fee && (
              <p className="mb-2">
                <strong>{t("Fee: ")}</strong>
                {noExponents(
                  formatAmountDecimal(
                    item?.fee,
                    Number(item?.currency?.decimal),
                    true
                  )
                ) +
                  " " +
                  item?.currency?.code}
              </p>
            )}

            {item?.note && (
              <p style={{ fontStyle: "italic" }} className="mb-2">
                <strong>{t("Note: ")}</strong> {item?.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
