import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min, max, onPriceChange }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const numberOfMarks = 4;
  const rawStep = max / numberOfMarks;
  const stepValue = Math.round(rawStep); // làm tròn
  const createMarks = useCallback(() => {
    
    const marks: { value: number; label: string }[] = [];
    for (let i = 0; i <= numberOfMarks; i++) {
      const value = min + (rawStep * i);
      marks.push({
        value: Math.round(value),
        label: `${Math.round(value).toLocaleString()}₫`
      });
    }
    return marks;
  }, [min, max]);

  const marks = createMarks();

  const debouncedOnPriceChange = useCallback(
    debounce((min: number, max: number) => onPriceChange(min, max), 300),
    [onPriceChange]
  );

  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
  }, [min, max]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - stepValue);
    setMinVal(value);
    debouncedOnPriceChange(value, maxVal);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + stepValue);
    setMaxVal(value);
    debouncedOnPriceChange(minVal, value);
  };

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  return (
    <div className="price-range-container">
      <div className="range-slider">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={stepValue}
          onChange={handleMinChange}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={stepValue}
          onChange={handleMaxChange}
          className="thumb thumb--right"
          style={{ zIndex: "4" }}
        />
        <div className="slider-track" />
        <div 
          className="slider-range"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`
          }}
        />
        <div className="slider-markers">
          {marks.map((mark) => (
            <div 
              key={mark.value}
              className="slider-mark"
              style={{
                left: `${getPercent(mark.value)}%`
              }}
            >
              <div className="slider-mark-label">{mark.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="price-inputs">
        <input
          type="number"
          min={min}
          max={maxVal - stepValue}
          value={minVal}
          step={stepValue}
          onChange={handleMinChange}
        />
        <span>–</span>
        <input
          type="number"
          min={minVal + stepValue}
          max={max}
          value={maxVal}
          step={stepValue}
          onChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
