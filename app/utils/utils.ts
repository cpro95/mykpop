import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";
import { DEFAULT_REDIRECT, ITEMSPERPAGE } from "./consts";

export function getMyParams(myParams: any) {
  type paramsType = {
    [key: string]: string;
  };
  let paramsArray: paramsType[] = [];
  myParams.forEach((value: string, name: string) => paramsArray.push({ [name]: value }));

  // remove weird index params 
  // paramsArray.map((p, i) => (p.index === "" ? paramsArray.splice(i, 1) : {}));

  let q: string = "";
  let page: number = 1;
  let itemsPerPage: number = ITEMSPERPAGE;
  let sorting = "date";
  let id: string = "";
  let role: string = "all";
  
  paramsArray.map((p) =>
    p.hasOwnProperty("q") ? (q = p.q as string) : {}
  );

  paramsArray.map((p) =>
    p.hasOwnProperty("page") ? (page = Number(p.page)) : {}
  );

  paramsArray.map((p) =>
    p.hasOwnProperty("itemsPerPage")
      ? (itemsPerPage = Number(p.itemsPerPage))
      : {}
  );

  paramsArray.map((p) =>
    p.hasOwnProperty("sorting") ? (sorting = p.sorting as string) : {}
  );

  paramsArray.map((p) =>
    p.hasOwnProperty("id") ? (id = p.id as string) : {}
  );

  paramsArray.map((p) =>
    p.hasOwnProperty("role") ? (role = p.role as string) : {}
  );

  if (isNaN(page)) page = 1;
  if (isNaN(itemsPerPage)) itemsPerPage = ITEMSPERPAGE;

  return { q, page, itemsPerPage, sorting, id, role }
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

function getRequiredEnvVarFromObj(
  obj: Record<string, string | undefined>,
  key: string,
  devValue: string = `${key}-dev-value`
) {
  let value = devValue;
  const envVal = obj[key];
  if (envVal) {
    value = envVal;
  } else if (obj.NODE_ENV === "production") {
    throw new Error(`${key} is a required env variable`);
  }
  return value;
}

export function getRequiredServerEnvVar(key: string, devValue?: string) {
  return getRequiredEnvVarFromObj(process.env, key, devValue);
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최소값은 포함
}

