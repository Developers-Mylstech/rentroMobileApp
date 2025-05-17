import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
  label,
  name,
  control,
  placeholder,
  secureTextEntry = false,
  rules = {},
  iconName = 'search',
  keyboardType = 'default',
  containerClassName = '',
  inputClassName = '',
  labelClassName = ''
}) => {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View className={`mb-4 w-full ${containerClassName}`}>
      {label && (
        <Text className={`text-subheading font-semibold uppercase text-gray-700 mb-2 ${labelClassName}`}>
          {label}
        </Text>
      )}

      <Controller
        control={control}
        rules={rules}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <View
              className={`flex-row items-center border rounded-lg px-4 py-3 bg-white ${
                error ? 'border-red-500' : 'border-gray-300'
              } ${inputClassName}`}
            >
                
              <Ionicons
                name={iconName}
                size={22}
                color={error ? '#FF3B30' : '#888'}
                style={{ marginRight: 10 }}
              />
              <TextInput
                className="flex-1 text-base text-gray-800"
                style={{ height: 24, lineHeight: 24 }} // Fixed height to prevent jerking
                placeholder={placeholder}
                placeholderTextColor="#999"
                secureTextEntry={hidePassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={keyboardType}
              />
              {secureTextEntry && (
                <Pressable onPress={() => setHidePassword(!hidePassword)}>
                  <Ionicons
                    name={hidePassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#888"
                  />
                </Pressable>
              )}
            </View>
            <Text className="text-red-500 text-xs mt-1 min-h-[16px]">
              {error?.message || ' '}
            </Text>
          </>
        )}
      />
    </View>
  );
};

export default InputField;
