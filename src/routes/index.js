import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import TabRoutes from "./tab.routes";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [telaInicial, SetTelaInicial] = useState(null);

  useEffect(() => {
    async function verificar() {
      await AsyncStorage.clear();
      SetTelaInicial("Cadastro");
    }
    verificar();
  }, []);

  if (!telaInicial) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={TabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}