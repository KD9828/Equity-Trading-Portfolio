import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/superbase";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Text, View,StyleSheet, TextInput, Alert } from "react-native"
import { useNavigation } from '@react-navigation/native';
// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
//   } from '@react-native-google-signin/google-signin'
const Login=()=>{
    // GoogleSignin.configure()
    
    const navigation = useNavigation();
    const {phoneNumber,setNumber}=useAuth();
     const [phone,setPhone]=useState("");
     const [password,setPassword]=useState("");
     const [error,setError]=useState("");
     const [loading,setLoading]=useState(false);
     const validate=()=>{
        setError('');
        if(!phone){
            setError("Mobile number is required");
            return false;
        }
        // if(!password){
        //     setError("Password is required");
        //     return false;
        // }
        return true;
     }
    //  const checkUserExist=async(number:String)=>{
    //     try {
    //         //@ts-ignore
    //         const { data: { users }, error } = await supabase.auth.admin.listUsers()
    //         console.log("users",users);
    //         return false
    //     } catch (error) {
    //         console.error('Error checking user existence:', error);
    //         return false; // Return false if an error occurs
    //     }
    //  }
     const onSubmit=async()=>{
        if(!validate())return;
        setLoading(true)
        // if(await checkUserExist(phone)){
        //     Alert.alert('Error', 'User Already Exist Try to signup');
        //     setLoading(false)
        //     return;
        // }
        const {data,error}=await supabase.auth.signInWithOtp({phone});
        if(error){
            console.log('error',error);
            Alert.alert(error.message)
            return;
        }
        // console.log('data',data);
        setLoading(false)
        setNumber(phone);
        router.push('/(auth)/otpScreen')
     }
    return(
    <View style={styles.container}>
        <Text style={styles.label}>Mobile Number</Text>

        <TextInput style={styles.input} placeholder="Enter number" onChangeText={setPhone}/>

        <Text style={styles.label}>Password</Text>

        {/* <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your Password" onChangeText={setPassword}/> */}

        <Text style={{ color: 'red' }}>{error}</Text>

        <Button onPress={onSubmit} disabled={loading} text={loading?"Sign in...":"Sign in"}/>

{/* <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          if (userInfo.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.idToken,
            })
            console.log(error, data)
          } else {
            throw new Error('no ID token present!')
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    /> */}
        {/* <Text style={styles.textButton} onPress={()=>router.push('/(auth)/sign-in')}>Account Already Exist</Text> */}
    </View>
    )
 }

 export default Login;

 const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20,
    },
    label:{
        fontSize:20,
    },
    input:{
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 20,
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
      },
 })