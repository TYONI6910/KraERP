(async function(){
  const sb = window.supabase.createClient(window.KRA_SUPABASE.url, window.KRA_SUPABASE.publishableKey);
  const { data, error } = await sb.auth.getSession();
  if (error || !data || !data.session) {
    location.replace("login.html");
    return;
  }
  window.KRA_SUPABASE_CLIENT = sb;
  window.KRA_SESSION = data.session;
  window.kraLogout = async function(){
    await sb.auth.signOut();
    location.replace("login.html");
  };
  window.dispatchEvent(new CustomEvent("kra-auth-ready", { detail: { session: data.session }}));
})();
