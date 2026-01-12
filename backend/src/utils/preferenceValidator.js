const ALLOWED_CHANNELS = ["EMAIL", "SMS", "PUSH"];

const isValidPreferenceValue = (value) => {
  if (!value) return false;
  if (value === "OFF") return true;

  const parts = value.split(",");

  if (parts.length === 0) return false;

  const unique = new Set(parts);
  if (unique.size !== parts.length) return false;

  return parts.every((p) => ALLOWED_CHANNELS.includes(p));
};

module.exports = {
  ALLOWED_CHANNELS,
  isValidPreferenceValue,
};
