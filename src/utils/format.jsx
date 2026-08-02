export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const DEPT_PALETTE = [
  { bg: "rgba(34, 211, 238, 0.12)", text: "#22D3EE" },
  { bg: "rgba(233, 61, 227, 0.12)", text: "#E93DE3" },
  { bg: "rgba(168, 85, 247, 0.12)", text: "#A855F7" },
  { bg: "rgba(52, 211, 153, 0.12)", text: "#34D399" },
  { bg: "rgba(251, 191, 36, 0.12)", text: "#FBBF24" },
  { bg: "rgba(240, 98, 95, 0.12)", text: "#F0625F" },
  { bg: "rgba(91, 141, 239, 0.12)", text: "#5B8DEF" },
];

export const getDepartmentColor = (department = "") => {
  let hash = 0;
  for (let i = 0; i < department.length; i++) {
    hash = department.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DEPT_PALETTE[Math.abs(hash) % DEPT_PALETTE.length];
};

export const highlightMatch = (text, query) => {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};