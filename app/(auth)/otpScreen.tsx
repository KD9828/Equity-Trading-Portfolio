import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/superbase';
import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';

const OTPScreen: React.FC = () => {
  const { phoneNumber } = useAuth();
  const [otp, setOTP] = useState<string[]>(Array(6).fill(''));
  const otpInputs = useRef<TextInput[]>([]);

  const handleOTPChange = (text: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = text;
    setOTP(newOTP);

    // Focus next input
    if (text && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      const newOTP = [...otp];
      newOTP[index - 1] = '';
      setOTP(newOTP);
      otpInputs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    // console.log("otp",enteredOTP)
    // Check if OTP is valid (for demonstration, just check if it's 6 digits)
    if (enteredOTP.length === 6 && /^\d+$/.test(enteredOTP)) {
      // console.log("phoneNumber",phoneNumber)
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        //@ts-ignore
        phone: phoneNumber,
        token: enteredOTP,
        type: 'sms',
      });
      console.log("data",session);
      if (error) {
        // console.log("error", error);
        Alert.alert('Error', 'Something went wrong');
      } else {
        //@ts-ignore
        const {error}=await supabase.from('users').insert({
          //@ts-ignore
          user_phone:phoneNumber
        })
        // console.log("Data", session);
        Alert.alert('Success', 'OTP Verified Successfully');
      }
    } else {
      // Invalid OTP
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOTPChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
            ref={(ref) => (otpInputs.current[index] = ref!)}
          />
        ))}
      </View>
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    height: 40,
    width: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 5, // Adjust margin from left and right
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
  },
});

export default OTPScreen;
