export async function get(url, json=true) {
  const response = await fetch(url);
  if (json) {
    return await response.json();
  } else {
    return await response.text();
  }
}
