// @ts-ignore
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import cn from "classnames";
import styles from "./Convert.section.module.sass";
import { FaqsByKeyword } from "components/faqs_by_keyword/FaqsByKeyword.component";
import {
  CONVERT_TYPE,
  WALLET_TYPE,
} from "src/helpers/backend/backend.coreconstants";
import { State_Convert, Action_Convert } from "./Convert.type";
import useTranslation from "next-translate/useTranslation";
import { useReducer, useState } from "react";
import { ConvertMarket } from "./market/ConvertMarket.section";
import { ConvertLimit } from "./limit/ConvertLimit.section";
import { useSubscription } from "@apollo/client";
import { BalanceUpdateEventDocument } from "src/graphql/subscription/wallet.subscriptions";
import { nullChecker } from "src/helpers/corefunctions";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { FAQ_KEYWORD } from "src/helpers/corearrays";

const initState: State_Convert = {
  type: CONVERT_TYPE.MARKET,
};

function reducerFn(state: State_Convert, action: Action_Convert) {
  switch (action.type) {
    case "setType":
      return { ...state, type: action.v };
    default:
      return { ...state };
  }
}

export const ConvertSection = () => {
  const { t } = useTranslation("common");

  const [state, dispatch] = useReducer(reducerFn, initState);

  const userData = useSelector((stateUser: RootState) => stateUser.user.user);
  const [refetchBalance, setRefetchBalance] = useState<boolean>(false);

  // balance update subscriptions
  useSubscription(BalanceUpdateEventDocument, {
    variables: {
      usercode: userData?.usercode || undefined,
    },
    onSubscriptionData: ({ subscriptionData }) => {
      setRefetchBalance(true);
      setTimeout(() => {
        setRefetchBalance(false);
      }, 30);
    },
  });

  // console.log("conv: state - main ", state);

  return (
    <>
      <div className={cn("pb-5", styles.wrapper)}>
        <div className={cn("container", styles.container)}>
          <div
            className={cn(styles.contentWrapper, {
              [styles.isLimitVisible]: state.type == CONVERT_TYPE.LIMIT,
            })}
          >
            <div className={cn("", styles.leftSide)}>
              {/* <ConvertForm /> */}
              <Tabs>
                {/* convert type */}
                <TabList
                  className={cn(
                    "react-tabs__tab-list mb-3",
                    styles.tabList,
                    styles.maxContent
                  )}
                >
                  <Tab
                    onClick={() =>
                      dispatch({ type: "setType", v: CONVERT_TYPE.MARKET })
                    }
                    tabIndex="null"
                  >
                    {t("Market")}
                  </Tab>
                  <Tab
                    onClick={() =>
                      dispatch({ type: "setType", v: CONVERT_TYPE.LIMIT })
                    }
                    tabIndex="null"
                    // disabled
                  >
                    {t("Limit")}
                  </Tab>
                </TabList>

                {/* convert market */}
                <TabPanel className={cn(styles.maxContent)}>
                  <ConvertMarket refetchBalance={refetchBalance} />
                </TabPanel>

                {/* convert limit */}
                <TabPanel className={cn(styles.limitSection)}>
                  <ConvertLimit refetchBalance={refetchBalance} />
                </TabPanel>
              </Tabs>
            </div>

            <div
              className={cn("", styles.rightSide, {
                [styles.inLimit]: state.type == CONVERT_TYPE.LIMIT,
              })}
            >
              <FaqsByKeyword keywords={FAQ_KEYWORD.CONVERT} className="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
