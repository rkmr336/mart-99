// Phone validation
export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

// Pincode validation
export const validatePincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

// Serviceable pincodes — sirf 811311 (Lakhisarai, Bihar)
export const isServiceable = (pincode) => {
  return pincode === "811311";
};

// Serviceable villages list
export const DELIVERY_AREAS = [
  { village: "Kaindi", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Baghaur", post: "Baghaur", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Manpur", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Giddha", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Mohiya", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Hajari Mod", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Kakraudi", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
  { village: "Singhpur", post: "Kaindi", ps: "Halsi", dist: "Lakhisarai", state: "Bihar" },
];

// Name validation
export const validateName = (name) => {
  return typeof name === 'string' && name.trim().length >= 3;
};
