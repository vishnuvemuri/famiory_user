import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  enableTime?: boolean;
  className?: string;
  minDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  enableTime = false,
  className = "",
  minDate
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: enableTime ? "h:i K" : "F j, Y",
        enableTime,
        noCalendar: enableTime,
        defaultHour: enableTime ? 12 : undefined,
        defaultMinute: 0,
        minDate: minDate ? minDate : "today",
        onChange: (selectedDates) => {
          onChange(selectedDates[0] || null);
        }
      });

      if (value) {
        flatpickrInstance.current.setDate(value);
      }
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, [enableTime, minDate]);

  useEffect(() => {
    if (flatpickrInstance.current && value) {
      flatpickrInstance.current.setDate(value);
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 outline-none transition-all duration-300 ${className}`}
      readOnly
    />
  );
};

export default DatePicker;