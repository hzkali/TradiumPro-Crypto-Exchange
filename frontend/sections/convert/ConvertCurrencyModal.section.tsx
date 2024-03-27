import cn from "classnames";
import { CryptoWalletAmount } from "components/wallet_amounts/CryptoWalletAmount.component";
import { ImageCoin } from "components/image_coin/ImageCoin.component";
import { CustomModal } from "components/modal/CustomModal.component";
import TextInputNoForm from "components/text_input/TextInputNoForm.component";
import useTranslation from "next-translate/useTranslation";
import styles from "./Convert.section.module.sass";
import { useConvertCurrencyModal } from "./useConvertForm.section";
import { getFundingBalance, getSpotBalance } from "src/helpers/corefunctions";

export const ConvertCurrencyModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  type: "from" | "to";
  fromCode: string;
  onItemClick: (x: string) => void;
}> = ({ visible, onClose, type, fromCode, onItemClick }) => {
  const { t } = useTranslation("common");

  const {
    isLoading,
    list,
    handleSearchTextChange,
    handleClearSearchText,
    searchText,
  } = useConvertCurrencyModal(visible, type, fromCode);

  return (
    <>
      <CustomModal
        visible={visible}
        onClose={onClose}
        title={t("Select Currency")}
      >
        <TextInputNoForm
          className={cn("my-4")}
          placeholder={t("Search coin")}
          value={searchText}
          onChange={handleSearchTextChange}
          icon={searchText ? "close" : ""}
          onIconClick={handleClearSearchText}
        />

        {list && list?.length == 0 && (
          <p className="text-center">{t("No Currency Found!")} </p>
        )}

        {list &&
          list?.length != 0 &&
          list?.map((coin: any, idx) => {
            const balanceSpot = getSpotBalance(coin);
            const balanceFunding = getFundingBalance(coin);

            return (
              <div
                key={idx}
                className={cn(styles.coin)}
                onClick={() => onItemClick(coin.code)}
              >
                <div className={cn(styles.imageWrapper)}>
                  <ImageCoin
                    logo={coin.logo}
                    alt={coin.name}
                    placeholder={coin.logo || coin.code}
                  />
                </div>

                <div className={cn("", styles.withdrawalCoinInfo)}>
                  <div>
                    <strong>{coin.code}</strong>
                    <small>{coin.name}</small>
                  </div>

                  {coin.wallets && (
                    <div className={cn()}>
                      <p className={cn("m-0", styles.amount)}>
                        <span>{t("Spot: ")}</span>
                        <strong>
                          <CryptoWalletAmount amount={balanceSpot} abs />
                        </strong>
                      </p>

                      <p className={cn("m-0", styles.amount)}>
                        <span>{t("Funding: ")}</span>
                        <strong>
                          <CryptoWalletAmount amount={balanceFunding} abs />
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </CustomModal>
    </>
  );
};
