const PC_BASE = "https://api.planningcenteronline.com";

export async function pcFetch(path: string, revalidate = 3600) {
  const credentials = Buffer.from(
    `${process.env.PLANNING_CENTER_APP_ID}:${process.env.PLANNING_CENTER_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PC_BASE}${path}`, {
    headers: { Authorization: `Basic ${credentials}` },
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`Planning Center API error: ${res.status}`);
  return res.json();
}
