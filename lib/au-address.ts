export const AU_COUNTRY_CODE = "AU" as const;

export const AU_STATES = [
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NSW", name: "New South Wales" },
  { code: "NT", name: "Northern Territory" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "VIC", name: "Victoria" },
  { code: "WA", name: "Western Australia" },
] as const;

export const AU_STATE_CODES = AU_STATES.map((state) => state.code);

export type AuStateCode = (typeof AU_STATE_CODES)[number];

export const AU_STATE_CODE_ENUM = AU_STATE_CODES as [
  AuStateCode,
  ...AuStateCode[],
];

export const AU_POSTCODE_REGEX = /^\d{4}$/;
