import { View, Text } from 'react-native';
import React from 'react';
import { Link, Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/superbase';
import Button from '@/components/Button';

const Logout = () => {
  const {session}=useAuth();
  // console.log("session in",session);
  if(!session){
    return <Redirect href={'/(auth)/'}/>
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={`/(tabs)/`} asChild>
        <Button  text="Check stocks" />
      </Link>
      <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
    </View>
  );
};

export default Logout;