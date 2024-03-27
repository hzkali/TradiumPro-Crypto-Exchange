import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { F_GiftCardTemplateModel } from "src/graphql/generated";
import { ImageItemFill } from "components/images";

export const GiftCardsTemplateItem: React.FC<{
  item: F_GiftCardTemplateModel;
}> = ({ item }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <div className={cn(styles.item)}>
        <ImageItemFill src={item.image || ""} alt={item.title || ""} />

        <Link href={`/gift-cards/buy/${item.uid}`} passHref>
          <div className={cn(styles.infoBox)}>
            <h5 className="h5 mb-1">{item.title}</h5>

            <p>
              <strong>{t("Category: ")}</strong>
              {item.category?.name}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};
