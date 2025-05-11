import Select, { components } from 'react-select';
import { useState } from 'react';

const languageOptions = [
  { value: 'English', label: 'EN', flag: 'us' },
  { value: '한국어', label: 'KR', flag: 'kr' },
  { value: '日本語', label: 'JP', flag: 'jp' },
  { value: '中文（简体）', label: 'ZH-CN', flag: 'cn' },
  { value: '中文（繁體）', label: 'ZH-TW', flag: 'tw' },
  { value: 'Español', label: 'ES', flag: 'es' },
  { value: 'Français', label: 'FR', flag: 'fr' },
  { value: 'Deutsch', label: 'DE', flag: 'de' },
];

// 커스텀 Option 렌더링
const CustomOption = (props: any) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
      <span className={`flag-icon flag-icon-${data.flag}`} />
      <span>{data.label}</span>
    </div>
  );
};

// 커스텀 SingleValue 렌더링
const CustomSingleValue = (props: any) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <span className={`flag-icon flag-icon-${data.flag}`} />
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}) => {
  return (
    <div className="absolute top-4 left-4 z-50 w-[130px]">
      <Select
        options={languageOptions}
        value={languageOptions.find((opt) => opt.value === selectedLanguage)}
        onChange={(selected) => setSelectedLanguage(selected?.value || '')}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        styles={{
            control: (base, state) => ({
              ...base,
              minHeight: '28px',
              height: '28px',
              fontSize: '0.75rem',
              paddingLeft: '4px',
              boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : 'none',
              borderColor: state.isFocused ? '#B5CC88' : base.borderColor,
              '&:hover': {
                borderColor: '#B5CC88',
              },
            }),
            valueContainer: (base) => ({
              ...base,
              padding: '0px 6px',
              height: '28px',
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: '28px',
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: '2px 4px',
            }),
            option: (base) => ({
              ...base,
              fontSize: '0.75rem',
              padding: '4px 8px',
            }),
            singleValue: (base) => ({
              ...base,
              display: 'flex',
              alignItems: 'center',
            }),
          }}
          
        isSearchable={false}
      />
    </div>
  );
};

export default LanguageSelector;
