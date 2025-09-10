export function generateBasicAuthToken() {
  const credentials = "admin:qwerty";
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  return `Basic ${encodedCredentials}`;
}
