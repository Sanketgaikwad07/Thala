import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface Props<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
  rules?: Record<string, unknown>;
}

export function FormTextInput<T extends FieldValues>({ control, name, rules, ...inputProps }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextInput
            mode="outlined"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={!!error}
            style={{ marginBottom: 4 }}
            {...inputProps}
          />
          {error ? <HelperText type="error">{error.message}</HelperText> : null}
        </>
      )}
    />
  );
}
