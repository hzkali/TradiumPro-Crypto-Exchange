import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import { FaqsByKeyword } from "components/faqs_by_keyword/FaqsByKeyword.component";
import { FAQ_KEYWORD } from "src/helpers/corearrays";

export const GiftCardsFaq: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <section className={cn("section ")}>
        <div className={cn("container ")}>
          <div className={cn(styles.faqWrapper)}>
            <FaqsByKeyword keywords={FAQ_KEYWORD.GIFT_CARD} />
          </div>
        </div>
      </section>
    </>
  );
};
