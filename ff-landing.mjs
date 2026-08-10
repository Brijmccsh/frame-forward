import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const base = "http://localhost:3100";
const ref = new URL(url).hostname.split(".")[0];
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const ids = [];
const cookieFor = (s) => {
  const v = `base64-${Buffer.from(JSON.stringify(s)).toString("base64")}`;
  const n = `sb-${ref}-auth-token`, M = 3180;
  return v.length <= M ? `${n}=${encodeURIComponent(v)}`
    : Array.from({length: Math.ceil(v.length/M)}, (_,i)=>`${n}.${i}=${encodeURIComponent(v.slice(i*M,(i+1)*M))}`).join("; ");
};
async function mk(email) {
  const { data: c } = await admin.auth.admin.createUser({ email, email_confirm: true });
  ids.push(c.user.id);
  const { data: l } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const cl = createClient(url, anon, { auth: { persistSession: false } });
  const { data: v } = await cl.auth.verifyOtp({ token_hash: l.properties.hashed_token, type: "magiclink" });
  return { id: c.user.id, email, client: cl, cookie: cookieFor(v.session) };
}
const hop = async (path, cookie) => {
  let at = path; const chain = [];
  for (let i = 0; i < 5; i++) {
    const r = await fetch(`${base}${at}`, { headers: cookie ? { cookie } : {}, redirect: "manual" });
    chain.push(`${at}(${r.status})`);
    if (r.status !== 307 && r.status !== 308) break;
    at = new URL(r.headers.get("location"), base).pathname;
  }
  return { chain: chain.join(" -> "), final: at };
};
try {
  const out = await hop("/");
  console.log(`  signed out  ${out.chain}`);

  const u = await mk(`ff-land-${randomUUID().slice(0,8)}@example.com`);
  await u.client.from("photographers").insert({ id: u.id, email: u.email, name: "Landing Test" });
  console.log(`  pending     ${(await hop("/", u.cookie)).chain}`);

  await admin.from("photographers").update({ status: "approved" }).eq("id", u.id);
  console.log(`  approved    ${(await hop("/", u.cookie)).chain}`);

  const n = await mk(`ff-land2-${randomUUID().slice(0,8)}@example.com`);
  console.log(`  no profile  ${(await hop("/", n.cookie)).chain}`);
} finally {
  for (const id of ids) {
    await admin.from("photographers").delete().eq("id", id);
    await admin.from("nonprofits").delete().eq("id", id);
    await admin.auth.admin.deleteUser(id);
  }
  console.log("  cleaned up");
}
