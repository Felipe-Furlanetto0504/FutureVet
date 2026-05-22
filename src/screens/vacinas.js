import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {Text, View,StyleSheet,TextInput,TouchableOpacity,FlatList,Alert,Modal,} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Vacinas() {
  const [vacinas, SetVacinas] = useState([]);
  const [modalVisivel, SetModalVisivel] = useState(false);
  const [nomePet, SetNomePet] = useState("");
  const [nomeVacina, SetNomeVacina] = useState("");
  const [data, SetData] = useState("");
  const [proxDose, SetProxDose] = useState("");
  const [local, SetLocal] = useState("");

  useEffect(() => {
    carregarVacinas();
  }, []);

  async function carregarVacinas() {
    const dados = await AsyncStorage.getItem("VACINAS");
    if (dados) {
      SetVacinas(JSON.parse(dados));
    }
  }

  async function salvarVacina() {
    if (!nomePet || !nomeVacina || !data || !proxDose || !local) {
      Alert.alert("Erro", "Preencha o nome do pet, a vacina, a data, proxíma dose e local");
      return;
    }

    const novaVacina = {
      id: Date.now().toString(),
      nomePet,
      nomeVacina,
      data,
      proxDose,
      local,
    };

    const novaLista = [...vacinas, novaVacina];
    SetVacinas(novaLista);
    await AsyncStorage.setItem("VACINAS", JSON.stringify(novaLista));

    SetNomePet("");
    SetNomeVacina("");
    SetData("");
    SetProxDose("");
    SetLocal("");
    SetModalVisivel(false);
  }

  async function excluirVacina(id) {
    Alert.alert("Excluir", "Deseja excluir esta vacina?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const novaLista = vacinas.filter((v) => v.id !== id);
          SetVacinas(novaLista);
          await AsyncStorage.setItem("VACINAS", JSON.stringify(novaLista));
        },
      },
    ]);
  }

  function renderVacina({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardIcone}>
          <FontAwesome5 name="paw" size={24} color="#4A90E2" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardPet}>🐾 {item.nomePet}</Text>
          <Text style={styles.cardNome}>{item.nomeVacina}</Text>
          <Text style={styles.cardDetalhe}> Aplicação: {item.data}</Text>
          <Text style={styles.cardDetalhe}> Próxima dose: {item.proxDose}</Text>
          <Text style={styles.cardDetalhe}>📍 Local: {item.local}</Text>
        </View>
        <TouchableOpacity onPress={() => excluirVacina(item.id)} style={styles.cardExcluir}>
          <MaterialIcons name="delete-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vacinas</Text>

      {vacinas.length === 0 ? (
        <View style={styles.vazio}>
          <FontAwesome5 name="paw" size={60} color="#ccc" />
          <Text style={styles.vazioTexto}>Nenhuma vacina cadastrada</Text>
          <Text style={styles.vazioSubTexto}>Toque no + para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={vacinas}
          keyExtractor={(item) => item.id}
          renderItem={renderVacina}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => SetModalVisivel(true)}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Nova Vacina</Text>

            <Text style={styles.label}>Nome do Pet</Text>
            <TextInput
              value={nomePet}
              onChangeText={SetNomePet}
              style={styles.input}
              placeholder="Ex: Rex, Mia, Bolinha..."
            />

            <Text style={styles.label}>Nome da Vacina</Text>
            <TextInput
              value={nomeVacina}
              onChangeText={SetNomeVacina}
              style={styles.input}
              placeholder="Ex: Antirrábica, V8, Giárdia..."
            />

            <Text style={styles.label}>Data de Aplicação</Text>
            <MaskedTextInput
              mask="99/99/9999"
              value={data}
              onChangeText={(text) => SetData(text)}
              style={styles.input}
              keyboardType="numeric"
              placeholder="DD/MM/AAAA"
            />

            <Text style={styles.label}>Próxima Dose</Text>
            <MaskedTextInput
              mask="99/99/9999"
              value={proxDose}
              onChangeText={(text) => SetProxDose(text)}
              style={styles.input}
              keyboardType="numeric"
              placeholder="DD/MM/AAAA"
            />

            <Text style={styles.label}>Local de Aplicação</Text>
            <View style={styles.localContainer}>
              <MaterialIcons name="location-on" size={22} color="#888" style={styles.localIcone} />
              <TextInput
                value={local}
                onChangeText={SetLocal}
                style={styles.localInput}
                placeholder="Ex: Clínica VetCare, Pet Shop..."
              />
            </View>

            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarVacina}>
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => SetModalVisivel(false)}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  vazioTexto: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  vazioSubTexto: {
    color: "#ccc",
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardIcone: {
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardPet: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDetalhe: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  cardExcluir: {
    padding: 4,
  },
  botaoAdicionar: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#4A90E2",
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  localContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    width: "100%",
  },
  localIcone: {
    paddingHorizontal: 10,
  },
  localInput: {
    flex: 1,
    padding: 10,
  },
  botaoSalvar: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
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