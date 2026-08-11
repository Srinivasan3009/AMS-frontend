export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="form-control mb-3"
      style={{ maxWidth: "320px" }}
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
