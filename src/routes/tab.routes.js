import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from '@expo/vector-icons';
import Home from "../screens/Home";
import Vacinas from "../screens/vacinas";
import Perfil from "../screens/Perfil";
import Consultas from "../screens/Consultas";
import Sobre from "../screens/Sobre";
import IoT from "../screens/IoT";
import { useTheme } from "../theme";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
  const { t } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.bg,
          borderTopColor: t.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Início"
        component={Home}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Vacinas"
        component={Vacinas}
        options={{
          tabBarLabel: "Vacinas",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="vaccines" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="IoT"
        component={IoT}
        options={{
          tabBarLabel: "IoT",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="sensors" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Consultas"
        component={Consultas}
        options={{
          tabBarLabel: "Consultas",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="local-hospital" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sobre"
        component={Sobre}
        options={{
          tabBarLabel: "Sobre",
          tabBarIcon: ({ color, size }) => <AntDesign name="book" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="emoji-emotions" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}