import { useState } from "react";
import styles from "./AccordionItem.component.module.sass";
import cn from "classnames";
import {
  handleStopPropagation,
  nullChecker,
  purifyHtml,
} from "src/helpers/corefunctions";
import Icon from "components/icon/Icon.component";
import { F_PayMethodDetailsModel } from "src/graphql/generated";
import useTranslation from "next-translate/useTranslation";
import { DynamicInputValuesType } from "src/helpers/coreconstants";

export const AccordionItemBank: React.FC<{
  className?: string;
  headClassName?: string;
  item: F_PayMethodDetailsModel;
  onSelect: (item: F_PayMethodDetailsModel) => void;
  selectedId: string | null;
  isLastChild?: boolean;
}> = ({
  className,
  headClassName,
  item,
  onSelect,
  selectedId,
  isLastChild,
}) => {
  const { t } = useTranslation("common");

  const [visible, setVisible] = useState(false);

  const inputValuesParsed: DynamicInputValuesType = !item.input_values
    ? {}
    : JSON.parse(item.input_values);

  return (
    <div className={cn(className, styles.item)}>
      <div
        className={cn(styles.head, styles.bank, headClassName, {
          [styles.active]: visible,
          // [styles.lastChild]: isLastChild,
        })}
      >
        <div
          className={cn(styles.number, styles.bank)}
          onClick={() => {
            onSelect(item);
            setVisible(true);
          }}
        >
          <input
            type="radio"
            name="bank"
            id="bank"
            checked={item?.uid == selectedId}
          />
        </div>

        <div
          className={styles.title}
          onClick={() => {
            onSelect(item);
            setVisible(true);
          }}
        >
          {item?.method?.name}
        </div>

        <button
          className={cn(
            styles.arrow,
            "button-circle button-stroke button-smaller"
          )}
          onClick={() => setVisible(!visible)}
          aria-label={t("view details arrow")}
        >
          <Icon name="arrow-down" size="24" />
        </button>
      </div>

      {/* anser */}
      <div
        className={cn(styles.body, {
          [styles.visible]: visible,
        })}
      >
        {Object?.values(inputValuesParsed)?.map((el, idx) => (
          <p key={el.label + idx} className="input-values">
            <strong className="">
              {el.label} {": "}
            </strong>

            {el.value}
          </p>
        ))}

        <div
          className={cn({
            ["dynamic-html"]: visible,
          })}
          dangerouslySetInnerHTML={{
            __html: purifyHtml(nullChecker(item?.optional_details)),
          }}
        />
      </div>
    </div>
  );
};
