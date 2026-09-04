import type { ReactNode } from 'react';
import { InputNumber, Select, Typography } from 'antd';
import type { InputNumberProps, SelectProps } from 'antd';

export function SpinnerNumberInput({ className, style, ...props }: InputNumberProps<number>) {
  const mergedClassName = ['numeric-spinner-input', className].filter(Boolean).join(' ');
  return <InputNumber mode="spinner" className={mergedClassName} style={style} {...props} />;
}

export function FixedUnitNumberInput({ unit, ...props }: InputNumberProps<number> & { unit: ReactNode }) {
  return (
    <div className="numeric-unit-field">
      <SpinnerNumberInput {...props} />
      <Typography.Text className="numeric-unit-label">{unit}</Typography.Text>
    </div>
  );
}

export function SelectUnitNumberInput({
  unitOptions = [
    { value: 'MiB', label: 'MiB' },
    { value: 'GiB', label: 'GiB' },
    { value: 'TiB', label: 'TiB' },
  ],
  unitDefaultValue = 'MiB',
  unitSelectProps,
  ...props
}: InputNumberProps<number> & {
  unitOptions?: SelectProps['options'];
  unitDefaultValue?: string;
  unitSelectProps?: SelectProps;
}) {
  return (
    <div className="numeric-unit-field has-select-unit">
      <SpinnerNumberInput {...props} />
      <Select
        className="numeric-unit-select"
        defaultValue={unitDefaultValue}
        options={unitOptions}
        {...unitSelectProps}
      />
    </div>
  );
}
