"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";
import { createAdminClient } from "./appwrite";

export async function signUpWithGoogle() {
  const { account } = await createAdminClient();

  // const origin = headers().get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${process.env.NEXT_PUBLIC_APP}/oauth`,
    `${process.env.NEXT_PUBLIC_APP}/sing-up`
  );

  return redirect(redirectUrl);
}
