export function convertUrlToHttps(url: string): string | boolean {
  if (!url) return false;

  return url
    .replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schema, nonSchemaUrl) =>
      schema ? match : `https://${nonSchemaUrl}`,
    )
    .replace(/^http:\/\//i, 'https://');
}
