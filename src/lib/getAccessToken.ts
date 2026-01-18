import { supabaseBrowser } from "./supabaseBrowser";

export async function getAccessToken() {
  const { data } = await supabaseBrowser.auth.getSession();
  return data.session?.access_token || null;
}
