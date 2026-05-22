import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Perfil({navigation}) {
  const [dados, SetDados] = useState(null);
  const [pets, SetPets] = useState([]);
  const [modalVisivel, SetModalVisivel]= useState(false);
  const [nomePet, SetNomePet] =useState("");
  const [idadePet, SetIdadePet] = useState("");
  const [tamanhoPet,SetTamanhoPet] = useState("");
  const [pesoPet, SetPesoPet] = useState("");

  useEffect(() => {
    async function carregar() {
      const dadosSalvos = await AsyncStorage.getItem("INFORMACOES");
      if (dadosSalvos) SetDados(JSON.parse(dadosSalvos));

      const petsSalvos = await AsyncStorage.getItem("PETS");
      if (petsSalvos) SetPets(JSON.parse(petsSalvos));  
      
    }
    carregar();
  }, []);

  async function sair() {
    Alert.alert("Sair", "Deseja sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("LOGADO");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  }

  async function salvarPet() {
    if (!nomePet || !idadePet || !tamanhoPet || !pesoPet){
      Alert.alert("Erro", "Preencha todos os campos do pet");
    return;
  }

  const novoPet = {
    id: Date.now().toString,
    nome: nomePet,
    idade: idadePet,
    tamanho: tamanhoPet,
    peso: pesoPet,
  };


  const novaLista = [...pets, novoPet];
  SetPets(novaLista);
  await AsyncStorage.setItem("PETS", JSON.stringify(novaLista));


  SetNomePet("");
  SetIdadePet("");
  SetTamanhoPet("");
  SetPesoPet("");
  SetModalVisivel(false);

}

async function excluirPet(id) {
  Alert.alert("Excluir",  "Deseja excluir este pet?",[
    {text: "Cancelar", style: "cancel"},
    {
      text:"Excluir", style: "destructive",
      onPress: async () =>{
        const novaLista = pets.filter((p) => p.id !== id);
        SetPets(novaLista);
        await AsyncStorage.setItem("PETS", JSON.stringify(novaLista));
      },
    },
  ]);
  
}

  if (!dados) return <Text style={styles.loading}>Carregando...</Text>;

  return (
    <ScrollView style={{backgroundColor:"#fff"}} contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Seu Perfil</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarLetra}>
          {dados.nome.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.nome}>{dados.nome}</Text>

      <View style={styles.card}>
        <View style={styles.linha}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.valor}>{dados.email}</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.linha}>
          <Text style={styles.label}>CPF</Text>
          <Text style={styles.valor}>{dados.cpf}</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.linha}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.valor}>{dados.telefone}</Text>
        </View>
      </View>

      <View style={styles.secaoHeader}>
        <Text style={styles.secaoTitulo}>Meus Pets</Text>
        <TouchableOpacity style={styles.botaoAdicionarPet} onPress={() => SetModalVisivel(true)}>
          <MaterialIcons name="add" size={22} color="#fff" />
          <Text style={styles.botaoAdicionarPetTexto}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <View style={styles.petVazio}>
          <FontAwesome5 name="paw" size={30} color="#ccc" />
          <Text style={styles.petVazioTexto}>Nenhum pet cadastrado</Text>
        </View>
      ) : (
        pets.map((pet) => (
          <View key={pet.id} style={styles.petCard}>
            <View style={styles.petIcone}>
              <FontAwesome5 name="paw" size={22} color="#4A90E2" />
            </View>
            <View style={styles.petInfo}>
              <Text style={styles.petNome}>{pet.nome}</Text>
              <Text style={styles.petDetalhe}> Idade: {pet.idade}</Text>
              <Text style={styles.petDetalhe}> Tamanho: {pet.tamanho}</Text>
              <Text style={styles.petDetalhe}> Peso: {pet.peso}</Text>
            </View>
            <TouchableOpacity onPress={() => excluirPet(pet.id)}>
              <MaterialIcons name="delete-outline" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.botaoSair} onPress={sair}>
        <MaterialIcons name="logout" size={20} color="#e74c3c" />
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Novo Pet</Text>

            <Text style={styles.inputLabel}>Nome do Pet</Text>
            <TextInput
              value={nomePet}
              onChangeText={SetNomePet}
              style={styles.input}
              placeholder="Ex: Rex, Mia, Bolinha..."
            />

            <Text style={styles.inputLabel}>Idade</Text>
            <TextInput
              value={idadePet}
              onChangeText={SetIdadePet}
              style={styles.input}
              placeholder="Ex: 2 anos, 6 meses..."
            />

            <Text style={styles.inputLabel}>Tamanho</Text>
            <TextInput
              value={tamanhoPet}
              onChangeText={SetTamanhoPet}
              style={styles.input}
              placeholder="Ex: Pequeno, Médio, Grande..."
            />

            <Text style={styles.inputLabel}>Peso</Text>
            <TextInput
              value={pesoPet}
              onChangeText={SetPesoPet}
              style={styles.input}
              placeholder="Ex: 5kg, 10kg..."
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarPet}>
              <Text style={styles.botaoSalvarTexto}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => SetModalVisivel(false)}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    color: "#333",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarLetra: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  nome: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  card: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    padding: 16,
  },
  linha: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  valor: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divisor: {
    height: 1,
    backgroundColor: "#ddd",
  },
  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  botaoAdicionarPet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  botaoAdicionarPetTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  petVazio: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  petVazioTexto: {
    color: "#ccc",
    fontSize: 14,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    width: "100%",
  },
  petIcone: {
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petNome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  petDetalhe: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  botaoSairTexto: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputLabel: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
  },
  botaoSalvar: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoSalvarTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botaoCancelar: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoCancelarTexto: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 16,
  },
});