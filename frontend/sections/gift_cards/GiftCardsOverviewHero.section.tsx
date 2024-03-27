import cn from "classnames";
import styles from "./GiftCards.section.module.sass";
import useTranslation from "next-translate/useTranslation";
import { ImageItemFill } from "components/images";
import { DEFAULT_ASSETS } from "src/helpers/coreconstants";
import { F_ComponentSection } from "src/graphql/generated";
import { ButtonAndLink } from "components/button_and_link/ButtonAndLink.component";

export const GiftCardsOverviewHero: React.FC<{
  data: null | F_ComponentSection;
}> = ({ data }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <section className={cn("section ")}>
        <div className={cn("container")}>
          <div className={cn(styles.main)}>
            <label className={cn(styles.label)}>{data?.subtitle}</label>

            <h2 className="h2 mb-3">{data?.title}</h2>

            {data?.short_description && (
              <p className={cn("mb-3", styles.shortDesc)}>
                {data?.short_description}
              </p>
            )}

            {data?.button_link && (
              <div className="text-center">
                <ButtonAndLink
                  link={data?.button_link}
                  text={data?.button_title}
                  className={cn("button my-3 px-5")}
                />
              </div>
            )}

            <div className={cn(styles.bannerWrapper)}>
              <div className={cn(styles.bg)} />

              <div className={cn(styles.imageWrapper)}>
                <ImageItemFill
                  src={data?.image || ""}
                  alt={data?.title || ""}
                  onClick={() => {
                    if (data?.image_click_link) {
                      window.open(data.image_click_link, "_blank");
                    }
                  }}
                  className={cn({
                    ["cursorPointer"]: !!data?.image_click_link,
                  })}
                />
              </div>
            </div>

            {/* icons */}
            {["✨", "🎁", "🎉"].map((icon, idx) => (
              <span
                key={idx}
                className={cn(styles.icon, styles[`icon-${idx}`])}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
