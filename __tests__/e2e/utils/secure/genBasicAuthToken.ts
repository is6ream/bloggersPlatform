export function generateBasicAuthToken() {
  const credentials = "admin:admin";
  const encodedCredentials = Buffer.from(credentials).toString("base64");
  return encodedCredentials;
}
