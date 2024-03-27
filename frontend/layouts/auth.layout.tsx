import { FC } from "react";
import { AuthPageType, LoginType } from "types/authTypes";
import Link from "next/link";
import cn from "classnames";
import styles from "./auth.layout.module.sass";
import Theme from "components/theme/Theme.component";
import { AUTH_PAGE_TYPE } from "src/helpers/coreconstants";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import CustomImage from "components/CustomImage";
import { SETTINGS_SLUG } from "src/helpers/backend/backend.slugcontanst";

const AuthLayout: FC<AuthPageType> = ({
  className,
  content,
  linkText,
  linkUrl,
  children,
  data,
  type,
}) => {
  const { t } = useTranslation("common");

  const authLeftImage = data[SETTINGS_SLUG.AUTH_LEFT_IMAGE];

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const pageTypeLogin = (
    <>
      <span>{content}</span>
      <Link href={String(linkUrl)}>
        <a className={styles.link}> {linkText} </a>
      </Link>{" "}
    </>
  );

  const pageTypeVerification = (
    <>
      <Link href={"/login"}>
        <a className={styles.link}> {t("Login")} </a>
      </Link>{" "}
      <div> | </div>
      <Link href={"/sign-up"}>
        <a className={styles.link}> {t("Sign Up")} </a>
      </Link>{" "}
    </>
  );

  return (
    <>
      <div className={cn(className, styles.login)}>
        <div
          className={styles.col}
          style={{
            backgroundImage: authLeftImage
              ? `url(${authLeftImage})`
              : "url(/images/content/bg-login.png)",
          }}
        >
          <Link href="/">
            <a className={styles.logo}>
              {data && (
                <CustomImage
                  src={data[SETTINGS_SLUG.APP_LOGO_SMALL]}
                  srcDark={data[SETTINGS_SLUG.APP_LOGO_SMALL]}
                  alt={data[SETTINGS_SLUG.APPLICATION_TITLE]}
                />
              )}

              {data && (
                <img
                  src={data[SETTINGS_SLUG.APP_LOGO_LARGE]}
                  alt={data[SETTINGS_SLUG.APPLICATION_TITLE]}
                />
              )}
            </a>
          </Link>
        </div>

        <div className={styles.col}>
          <div className={styles.head}>
            {!isLoggedIn ? (
              <>
                {type == AUTH_PAGE_TYPE.LOGIN && pageTypeLogin}
                {type == AUTH_PAGE_TYPE.VERIFICATION && pageTypeVerification}
                <div> | </div>
              </>
            ) : null}

            <Theme className={styles.theme} icon />
          </div>

          <div className={styles.wrap}>{children}</div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
