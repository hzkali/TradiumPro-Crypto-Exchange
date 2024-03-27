import React, { ReactElement } from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";

class MainDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): ReactElement {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />

          {/*Below we add the modal wrapper*/}
          <div id="modal-root" />
          <div id="sidebar-root" />
        </body>
      </Html>
    );
  }
}

export default MainDocument;
