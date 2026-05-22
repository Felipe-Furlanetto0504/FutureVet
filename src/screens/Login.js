import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Text, View, StyleSheet, Alert, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, SetEmail] = useState("");
  const [senha, SetSenha] = useState("");
  const [mostrarSenha, SetMostrarSenha] = useState(false);

  async function logar() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const dados = await AsyncStorage.getItem("INFORMACOES");

    if (!dados) {
      Alert.alert("Erro", "Nenhum cadastro encontrado");
      return;
    }

    const obj = JSON.parse(dados);

    if (obj.email === email && obj.senha === senha) {
      await AsyncStorage.setItem("LOGADO", "true");
      navigation.reset({
        index: 0,
        routes: [{ name: "App" }], 
      });
    } else {
      Alert.alert("Erro", "Email ou senha incorretos");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={SetEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Digite seu email"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.senhaContainer}>
        <TextInput
          value={senha}
          onChangeText={SetSenha}
          style={styles.senhaInput}
          secureTextEntry={!mostrarSenha}
          placeholder="Digite sua senha"
        />
        <TouchableOpacity onPress={() => SetMostrarSenha(!mostrarSenha)} style={styles.olho}>
          <Ionicons
            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botao} onPress={logar}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    width: "100%",
  },
  senhaInput: {
    flex: 1,
    padding: 10,
  },
  olho: {
    paddingHorizontal: 10,
  },
  botao: {
    marginTop: 24,
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});