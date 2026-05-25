export function googleFormUtils(googleFormUrl: string): string | null {
  if (!googleFormUrl) return null;

  // Remove query params
  const cleanUrl = googleFormUrl.split("?")[0];

  return cleanUrl.replace("/viewform", "/viewanalytics");
}
