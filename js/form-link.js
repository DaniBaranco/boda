const GOOGLE_FORM_URL_REGEX = /^https:\/\/(docs\.google\.com\/forms\/d\/e\/.+|forms\.gle\/.+)/i;

export function isValidGoogleFormUrl(url) {
  if (typeof url !== "string") {
    return false;
  }

  return GOOGLE_FORM_URL_REGEX.test(url.trim());
}

export function ensureGoogleFormUrl(url) {
  if (!isValidGoogleFormUrl(url)) {
    throw new Error("La URL de registro debe apuntar a Google Forms (forms.gle o docs.google.com/forms).");
  }

  return url.trim();
}

export function mapRegistrationLinks(formUrl, links) {
  const safeUrl = ensureGoogleFormUrl(formUrl);

  links.forEach((link) => {
    link.setAttribute("href", safeUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer noopener");
  });
}
