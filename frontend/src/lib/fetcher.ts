import APIConfig from "../config/api";
import { getCookie, removeCookies } from "cookies-next";
import { CODE } from "src/helpers/backend/backend.coreconstants";
import {
  coreLogoutTask,
  logoutHandler,
  redirectToFromClientEnd,
} from "src/helpers/corefunctions";
import { RESTRICTED_ENTITY_TYPE } from "src/helpers/corearrays";
import { getLangFromUrl } from "src/helpers/corefunctions";
import { TOASTER_MSG_TYPE } from "src/helpers/coreconstants";

export function graphqlFetcher<TData, TVariables>(
  query: string,
  variables?: TVariables,
  customHeaders?: any,
  fileKeys?: string[]
) {
  const { formData, isFile } = prepareFormData(query, variables, fileKeys);
  return async (ctx?: any): Promise<any> => {
    const accessToken = getCookie("token", ctx);
    const deviceToken = getCookie("dvctk", ctx);
    customHeaders = customHeaders ?? {};
    if (ctx?.locale && !customHeaders.lang) customHeaders.lang = ctx?.locale;

    if (ctx) {
      const currency = getCookie("currency", ctx);
      currency &&
        !customHeaders.currency &&
        (customHeaders.currency = currency);
    }

    return await callFetcher(
      accessToken,
      deviceToken,
      isFile,
      query,
      variables,
      formData,
      customHeaders,
      ctx
    );
  };
}

const processFileKeys = (filekey: string): string[] => {
  return filekey.split(".");
};

const prepareFormData = (
  query: string,
  variables?: any,
  fileKeys?: string[]
) => {
  let formData: any;
  formData = null;
  let map = "";

  const fileLength = fileKeys?.length ?? 0;
  let isFile = Boolean(fileLength);

  if (typeof FormData !== "undefined") {
    formData = new FormData();
    if (typeof variables === "object") {
      // @ts-ignore
      let counter = 0;
      const operation = JSON.stringify({
        query,
        variables,
        operationName: null,
      });
      formData.append("operations", operation);

      for (let i = 0; fileKeys && i < fileLength; i++) {
        const processedKeys = processFileKeys(fileKeys[i]);
        if (!processedKeys.length) break;
        let file = variables;
        processedKeys.forEach((el, idx) => {
          file = file[el];
          if (file instanceof File) {
            // @ts-ignore
            const index = `"${counter}"`;
            map +=
              counter > 0
                ? `,${index}:["variables.${fileKeys[i]}"]`
                : `${index}:["variables.${fileKeys[i]}"]`;
            counter++;
          }
        });
      }
      map = `{${map}}`;
      formData.append("map", map);
      let newCounter = 0;
      for (let i = 0; fileKeys && i < fileLength; i++) {
        const processedKeys = processFileKeys(fileKeys[i]);
        if (!processedKeys.length) break;
        let file = variables;
        processedKeys.forEach((el, idx) => {
          file = file[el];
          if (file instanceof File) {
            // @ts-ignore
            formData.append(`${newCounter.toString()}`, file);
            newCounter++;
          }
        });
      }
    }
  }
  return {
    formData,
    isFile,
  };
};

// const prepareFormData = (query: string, variables?: any, fileKeys?: string[]) => {
//   console.log(query);
//   let formData: any;
//   formData = null;
//   let isFile = false;
//   if (typeof FormData !== "undefined") {
//     formData = new FormData();
//     if (typeof variables === "object") {
//       // @ts-ignore
//       let counter = 0;
//       const operation = JSON.stringify({
//         query,
//         variables,
//         operationName: null,
//       });
//       formData.append("operations", operation);
//       let map = "";
//       for (const x in variables) {
//         if (variables[x] instanceof File) {

//           // @ts-ignore
//           const index = `"${counter}"`;
//           map +=
//             counter > 0
//               ? `,${index}:["variables.${x}"]`
//               : `${index}:["variables.${x}"]`;
//           isFile = true;
//           counter++;
//         }
//       }
//       map = `{${map}}`;
//       formData.append("map", map);
//       let newCounter = 0;
//       for (const x in variables) {
//         if (variables[x] instanceof File) {
//           // @ts-ignore
//           formData.append(`${newCounter.toString()}`, variables[x]);
//           newCounter++;
//         }
//       }
//     }
//   }
//   return {
//     formData,
//     isFile,
//   };
// };

const callFetcher = async (
  accessToken: any,
  deviceToken: any,
  isFile: boolean,
  query: string,
  variables: any,
  formData: any,
  customHeaders?: any,
  ctx?: any
) => {
  let header: any = isFile
    ? {
        Accept: "application/json, text/plain, */*",
        Authorization: "Bearer " + accessToken,
      }
    : {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      };

  header["lang"] = getLangFromUrl();
  header["currency"] = getCookie("currency", ctx);
  header["dvctk"] = deviceToken ?? "";
  header = { ...header, ...customHeaders };

  const res = await fetch(APIConfig.endpoint as string, {
    method: "POST",
    // @ts-ignore
    headers: header,
    body: isFile ? formData : JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    // console.log(json.errors);
    const code = json.errors[0].code;
    const message = json.errors[0].message;

    if (
      [
        CODE.UNAUTHORIZED,
        CODE.USER_SUSPENDED,
        CODE.ACCOUNT_NOT_ACTIVE,
        CODE.USER_DISABLED,
        CODE.VERIFY_DEVICE,
      ].includes(code)
    ) {
      logoutHandler(message, TOASTER_MSG_TYPE.ERROR_MSG);
      return;
    }

    if (code == CODE.COUNTRY_RESTRICTED) {
      coreLogoutTask(message);
      redirectToFromClientEnd(
        `/restricted?entity=${RESTRICTED_ENTITY_TYPE.COUNTRY}`
      );
      return;
    }

    const errorObj = {
      code: json.errors[0].code,
      message: json.errors[0].message,
      data: json.errors[0].data,
      messages: json.errors[0].messages,
    };
    throw new Error(JSON.stringify(errorObj));
    // return json.errors[0];
  }

  return json.data;
};
