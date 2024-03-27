import { FC } from "react";
import styles from "./auth.layout.module.sass";
import Header from "components/header/Header.component";
import { Footer } from "components/footer/Footer.component";
import { Notices } from "components/notices/Notices.component";

const BasicLayout: FC<{ data: any; hideFooter?: boolean }> = ({
  data,
  hideFooter = false,
  children,
}) => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <Header settings={data} />

        <main className={styles.main}>
          <Notices />

          {children}
        </main>

        {!hideFooter ? <Footer settings={data} /> : null}
      </div>
    </>
  );
};

export default BasicLayout;
