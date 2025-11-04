// Helper function to extract and validate HTML code
export function extractAndValidateHTML(
  rawCode: string,
  appName: string,
  attempt: number
): string {
  let code = rawCode.trim();

  // Remove any markdown code blocks if present
  const codeBlockMatch = code.match(/```html\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    code = codeBlockMatch[1].trim();
  }

  // Look for HTML document within the response
  const htmlMatch = code.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
  if (htmlMatch) {
    code = htmlMatch[0];
  }

  // Simplified validation - only check essential structure
  const validationErrors: string[] = [];

  // Check if it starts with DOCTYPE
  if (!code.includes("<!DOCTYPE html>")) {
    validationErrors.push("Missing DOCTYPE declaration");
  }

  // Check if it has opening and closing HTML tags
  if (!code.includes("<html") || !code.includes("</html>")) {
    validationErrors.push("Missing HTML tags");
  }

  // Check if it ends with </html>
  if (!code.trimEnd().endsWith("</html>")) {
    validationErrors.push(
      "Code appears to be truncated - doesn't end with </html>"
    );
  }

  // Check for minimum reasonable length (less strict)
  if (code.length < 1000) {
    validationErrors.push(
      `Code too short (${code.length} chars) - likely incomplete`
    );
  }

  // If validation fails, throw error for retry
  if (validationErrors.length > 0) {
    throw new Error(
      `Generated code validation failed (attempt ${attempt}): ${validationErrors.join(
        ", "
      )}`
    );
  }

  // Ensure the code includes the app name in title if missing
  if (!code.toLowerCase().includes(appName.toLowerCase())) {
    code = code.replace(/(<title[^>]*>)[^<]*(<\/title>)/i, `$1${appName}$2`);
  }

  return code;
}
