"use client";

export default function Filters({ selectedType, setSelectedType, types }) {
  return (
    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="input"
    >
      <option value="">Wszystkie typy</option>
      {types.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}