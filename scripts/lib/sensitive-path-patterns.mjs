/**
 * Motifs appliqués au chemin git complet et au basename (voir ship + assert-tracked-files-safe).
 */
export const SENSITIVE_PATH_REGEXES = [
  /^\.env\.local$/i,
  /^\.env\.[^/]+\.local$/i,
  /\.pem$/i,
  /id_rsa/i,
  /\.ppk$/i,
];
