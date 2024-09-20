import { useState } from "react";
import { Dropdown } from "./Dropdown";

export function DropdownHandler({ dropdownData }) {
  // Initialize state dynamically for all dropdowns
  const [dropdownState, setDropdownState] = useState(
    dropdownData.reduce((acc, dropdown) => {
      acc[dropdown.label] = dropdown.label; // Default value is the label or an initial value
      return acc;
    }, {})
  );

  // Function to update the dropdown state dynamically
  const handleDropdownSelect = (label, value) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [label]: value,
    }));
  };

  return (
    <>
    {/* <div className="flex flex-wrap mb-6 gap-2"> */}
    
      {dropdownData.map((dropdown, index) => (
        <Dropdown
          key={index}
          label={dropdown.label}
          options={dropdown.options}
          selectedValue={dropdownState[dropdown.label]} // Track selected value
          onSelect={(value) => handleDropdownSelect(dropdown.label, value)}
        />
      ))}
    {/* </div> */}
    </>
  );
}
