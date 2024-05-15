import Button from "@/components/Button";
import Colors from "@/constants/Colors";
// import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/superbase";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View,StyleSheet, TextInput, Alert } from "react-native"

const index=()=>{
     const [phone,setPhone]=useState("");
     const [password,setPassword]=useState("");
     const [error,setError]=useState("");
     const [loading,setLoading]=useState(false);
     const validate=()=>{
        if(!phone){
            setError("Email is required");
            return false;
        }
        if(!password){
            setError("Password is required");
            return false;
        }
        return true;
     }

     const checkUserExist=async(number:String)=>{
        try {
            //@ts-ignore
            const { data, error } = await supabase.from('Users').select("*").eq("Phone",phone)
            if(error){
                throw error
            }
            // console.log('data',data)
            return data!==null
        } catch (error) {
            console.error('Error checking user existence:', error);
            return false; // Return false if an error occurs
        }
     }
     
     const onSubmit=async()=>{
        if(!validate())return;
        setLoading(true);
        const user=await checkUserExist(phone);
        // console.log(user);
        // if(!user){
        //     Alert.alert('Error', 'User not Exist create new account');
        //     setLoading(false);
        //     return;
        // }
        const {error}=await supabase.auth.signInWithPassword({phone,password});
        if(error){
            Alert.alert(error.message)
            setLoading(false);
            return;
        }
        setLoading(false);
     }
    return(
    <View style={styles.container}>
        <Text style={styles.label}>Email</Text>

        <TextInput style={styles.input} placeholder="Enter number" onChangeText={setPhone}/>

        <Text style={styles.label}>Password</Text>

        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your Password" onChangeText={setPassword}/>

        <Text style={{ color: 'red' }}>{error}</Text>

        <Button onPress={onSubmit} disabled={loading} text={loading?"Sign in...":"Sign in"}/>
        <Text style={styles.textButton} onPress={()=>router.push('/(auth)/')}>Create new Account</Text>
    </View>
    )
 }

 export default index;

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