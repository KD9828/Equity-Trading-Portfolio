import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { Link, Redirect, Stack, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { supabase } from '@/lib/superbase';

const index = () => {
  const {session}=useAuth();
  // console.log("Session",session);
  if(!session){
    return <Redirect href={'/(auth)/'}/>
  }

  return (
    <Redirect href ={'/(tabs)/'}/>
  );
};

export default index;