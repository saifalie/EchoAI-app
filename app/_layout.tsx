import { Stack } from "expo-router";

export default function RootLayout() {

  
  
  return <Stack>
    <Stack.Screen name="index" options={{headerShown:false}} />
    <Stack.Screen name="login"  options={{headerShown:false}}/>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="resume-uploader" options={{presentation:
      'modal',
      headerTitle:'Upload Resume'
    }}/>
       <Stack.Screen name="selection" options={{presentation:
      'modal',
      headerTitle:''
    }}/>
  </Stack>;
}
