import React, { useState } from "react";
import TextField from "@mui/material/TextField";

interface NumberTextFieldProps {
  label: string;
  value?: string;
  color?: string;
  onChange?: (value: string) => void;
  disabled?: boolean
}

const formatNumber = (value: string) => {
  const numericValue = value.replace(/\D/g, ""); // Hanya angka
  if (!numericValue) return "0,00"; // Default jika kosong

  const integerPart = numericValue.slice(0, -2) || "0"; // Ambil bagian sebelum desimal
  const decimalPart = numericValue.slice(-2); // Ambil dua angka terakhir sebagai desimal

  // Format angka dengan titik pemisah ribuan
  const formattedInteger = parseInt(integerPart, 10).toLocaleString("id-ID");

  return `${formattedInteger},${decimalPart}`;
};

const NumberTextField: React.FC<NumberTextFieldProps> = ({ label, value, onChange, color, disabled }) => {
  const [inputValue, setInputValue] = useState(value || "0,00");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\./g, "").replace(",", ""); // Hapus format
    if (!rawValue) rawValue = "0"; // Default jika kosong
    const formattedValue = formatNumber(rawValue);
    setInputValue(formattedValue);
    onChange?.(formattedValue);
  };

  const handleBlur = () => {
    setInputValue(formatNumber(inputValue));
  };

  return (
    <TextField
      label={label}
      variant="standard"
      fullWidth
      color={color as "primary" | "secondary" | "error" | "info" | "success" | "warning"}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );
};

export default NumberTextField;
