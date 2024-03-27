import { ActionDropdown } from "components/dropdown/actions/ActionDropdown.component";
import { CustomModal } from "components/modal/CustomModal.component";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import {
  F_UserGiftCardTransferHistoryModel,
} from "src/graphql/generated";
import { GiftCardHistoryDetails } from "./GiftCardHistoryDetails.section";
import cn from "classnames";
import styles from "../GiftCards.section.module.sass";

export const GiftCardHistoryActions: React.FC<{
  item: F_UserGiftCardTransferHistoryModel;
  refetch: Function;
}> = ({ item, refetch }) => {
  const { t } = useTranslation("common");

  const [show, setShow] = useState(false);

  return (
    <>
      <ActionDropdown>
        <button type="button" onClick={() => setShow(true)}>
          {t("View Details")}
        </button>
      </ActionDropdown>

      <CustomModal
        visible={show}
        onClose={(e) => {
          // handleStopPropagation(e);
          setShow(false);
        }}
        outSideClose={false}
        outerClassName={cn(styles.detailsModal)}
        title={t("Transfer Details")}
        // isWider
      >
        <GiftCardHistoryDetails
          item={item}
          refetch={refetch}
          closeModal={() => setShow(false)}
        />
      </CustomModal>
    </>
  );
};
