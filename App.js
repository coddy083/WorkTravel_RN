import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { theme } from "./colors";

const trash = <FontAwesome5 name="trash-alt" size={18} color={theme.grey} />;
const edit = <FontAwesome5 name="edit" size={18} color={theme.grey} />;

export default function App() {
  const [Working, setWorking] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [toDos, setToDos] = useState({});

  const ChangeText = (text) => {
    setTextInput(text);
  };

  const saveToDos = (newTodo) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newTodo));
  };

  const loadToDos = () => {
    const loadToDos = AsyncStorage.getItem("toDos", (err, result) => {
      const parsedToDos = JSON.parse(result);
      if (parsedToDos !== null) {
        setToDos(parsedToDos);
      }
    });
  };

  const deleteToDo = async (id) => {
    Alert.alert("삭제", "정말 삭제 하시겠습니까?", [
      {
        text: "취소",
      },
      {
        text: "확인",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  const editTodo = async (id, text) => {
    Alert.prompt("수정", "수정할 내용을 입력해주세요", [
      {
        text: "취소",
      },
      {
        text: "확인",
        onPress: (text) => {
          const newToDos = { ...toDos };
          newToDos[id] = { ...newToDos[id], text: text };
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadToDos();
    loadCategory();
  }, []);

  const addTodo = async () => {
    if (textInput !== "") {
      const newTodo = {
        [Date.now()]: {
          id: Date.now(),
          text: textInput,
          work: Working,
          isCompleted: false,
        },
      };
      setToDos({ ...toDos, ...newTodo });
      setTextInput("");
      await saveToDos({ ...toDos, ...newTodo });
    }
  };

  const saveCategory = async (category) => {
    setWorking(category);
    await AsyncStorage.setItem("category", JSON.stringify(category));
  };

  const loadCategory = async () => {
    const category = await AsyncStorage.getItem("category");
    if (category !== null) {
      setWorking(JSON.parse(category));
    }
  };

  const Travel = () => {
    setWorking(false);
    saveCategory(false);
  };
  const Work = () => {
    setWorking(true);
    saveCategory(true);
  };

  const TodoComplete = (id) => {
    const newToDos = { ...toDos };
    newToDos[id].isCompleted = !newToDos[id].isCompleted;
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={Work}>
          <Text
            style={{ ...styles.btnText, color: Working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !Working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          placeholder={Working ? "Work" : "Travel"}
          value={textInput}
          onChangeText={ChangeText}
          onSubmitEditing={addTodo}
          returnKeyType="send"
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].work === Working ? (
            <View key={key} style={styles.toDo}>
              <Text
                onPress={() => TodoComplete(toDos[key].id)}
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[key].isCompleted
                    ? "line-through"
                    : "none",
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={styles.menuIcon}>
                <TouchableOpacity>
                  <Text
                    onPress={() => editTodo(toDos[key].id, "hello")}
                    style={styles.deleteBtn}
                  >
                    {edit}
                  </Text>
                </TouchableOpacity>
                <Text
                onPress={() => deleteToDo(toDos[key].id)}
                style={styles.deleteBtn}>{trash}</Text>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
  },
  toDo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#5c5c60",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 8,
  },
  toDoText: {
    color: "white",
    fontWeight: "400",
    fontSize: 14,
  },
  todoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuIcon: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  deleteBtn: {
    marginLeft: 5,
    color: "white",
  },
});
