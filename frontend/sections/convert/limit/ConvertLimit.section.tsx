import useTranslation from "next-translate/useTranslation";
import { DAYS, WALLET_TYPE } from "src/helpers/backend/backend.coreconstants";
import { ConvertLimitChart } from "./ConvertLimitChart.section";
import { ConvertLimitForm } from "./ConvertLimitForm.section";
import { useConvertLimit } from "./useConvertLimit.section";

export const ConvertLimit: React.FC<{
  refetchBalance: boolean;
}> = ({ refetchBalance }) => {
  const { t } = useTranslation("common");

  const { state, dispatch, isLoadingValidData, decimalConvert, updatePair } =
    useConvertLimit(refetchBalance);

  return (
    <>
      <ConvertLimitChart state={state} dispatch={dispatch} />

      <ConvertLimitForm
        state={state}
        dispatch={dispatch}
        isLoadingValidData={isLoadingValidData}
        updatePair={updatePair}
        decimalConvert={decimalConvert}
      />
    </>
  );
};
