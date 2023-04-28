import { useState } from "react";

interface localParams {
  label: string;
  from: number | undefined;
  setFrom: React.Dispatch<React.SetStateAction<number | undefined>>;
  to: number | undefined;
  setTo: React.Dispatch<React.SetStateAction<number | undefined>>;
  min?: number;
  max?: number;
}

const style = "flex flex-col p-2 bg-gray-200 rounded drop-shadow-lg";

const RangeSelector = ({
  label,
  from,
  setFrom,
  to,
  setTo,
  min,
  max,
}: localParams) => {
  const minValue: number = min ?? 0;
  const maxValue: number = max ?? 10000;

  const changeFromHandler = (event: any) => {
    const newValue: number = Number(event.target.value);
    if (to !== undefined) {
      if (newValue < minValue || newValue > maxValue) return;
      if (to > 0 && newValue >= to) return;
    }
    setFrom(newValue);
  };

  const changeToHandler = (event: any) => {
    const newValue: number = Number(event.target.value);
    if (from !== undefined) {
      if (newValue < minValue || newValue > maxValue) return;
      if (newValue < from + 1) {
        setTo(Number(from) + 1);
        return;
      }
    }
    setTo(newValue);
  };

  return (
    <div className={style}>
      <div>{label}:</div>
      <label>Від:</label>
      <input
        type="number"
        onChange={(e) => changeFromHandler(e)}
        value={from ?? 0}
      />
      <label>До:</label>
      <input
        type="number"
        onChange={(e) => changeToHandler(e)}
        value={to ?? 0}
      />
    </div>
  );
};

export default RangeSelector;
