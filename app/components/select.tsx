import React from 'react';
import Select from 'react-select';

const options = [{ value: 'SP', label: 'SP' }, { value: 'MAIN', label: 'MAIN' }];

function CustomDropdown({ formData, setFormData }: any) {
  const handleChange = (selectedOption: any) => {
    setFormData({ ...formData, spMain: selectedOption.value });
  };

  return (
    <div style={{ width: '150px' }}>
      <Select
        value={options.find(option => option.value === formData.spMain)}
        onChange={handleChange}
        options={options}
        placeholder=""
      />
    </div>
  );
}

export default CustomDropdown;
