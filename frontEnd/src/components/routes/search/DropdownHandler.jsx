import { useState } from "react";
import { Dropdown } from "./Dropdown";

export function DropdownHandler({ dropdownData, handleLogoSelect }) {
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

    // Call the parent function when the logo dropdown is selected
    if (label === "Job Source") {
      handleLogoSelect(value); // This will send the selected logo value to the parent component
    }
  };

  return (
    <>
      {dropdownData.map((dropdown, index) => (
        <Dropdown
          key={index}
          label={dropdown.label}
          options={dropdown.options}
          selectedValue={dropdownState[dropdown.label]} // Track selected value
          onSelect={(value) => handleDropdownSelect(dropdown.label, value)}
        />
      ))}
    </>
  );
}
