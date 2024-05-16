import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";
export default function authLayout(){
    const {session}=useAuth();
    if(session){
        return<Redirect href={'/(tabs)/'}/>
    }
    return(
    <Stack>
        <Stack.Screen name="index" options={{title:"Login with Phone"}}/>
        <Stack.Screen name="otpScreen" options={{title:"Verify OTP"}}/>
        <Stack.Screen name="sign-in" options={{title:"Login with Email"}}/>
    </Stack>
    )
}