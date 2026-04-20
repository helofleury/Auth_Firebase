import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, FlatList } from "react-native";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../firebase/productService";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  async function loadProducts() {
    try {
      const productList = await getProducts();
      setProducts(productList);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function clearForm() {
    setName("");
    setPrice("");
    setEditingProductId(null);
  }

  async function handleSaveProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Atenção", "Preencha nome e preço do produto.");
      return;
    }

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, {
          name: name.trim(),
          price: price.trim(),
        });

        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await createProduct({
          name: name.trim(),
          price: price.trim(),
        });

        Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      }

      clearForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  }

  function handleEditProduct(product) {
    setName(product.name);
    setPrice(product.price);
    setEditingProductId(product.id);
  }

  function handleCancelEdit() {
    clearForm();
  }

  async function handleDeleteProduct(productId) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);

      if (editingProductId === productId) {
        clearForm();
      }

      Alert.alert("Sucesso", "Produto excluído com sucesso!");
      loadProducts();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível excluir o produto.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginTop: 40, marginBottom: 20 }}>
        Bem-vindo!
      </Text>

      <TextInput
        placeholder="Nome do produto"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <Button
        title={editingProductId ? "Atualizar produto" : "Cadastrar produto"}
        onPress={handleSaveProduct}
      />

      {editingProductId && (
        <View style={{ marginTop: 10 }}>
          <Button title="Cancelar edição" onPress={handleCancelEdit} />
        </View>
      )}

      <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
        Produtos cadastrados
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Nenhum produto cadastrado.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Text>Nome: {item.name}</Text>
            <Text>Preço: {item.price}</Text>

            <View style={{ marginTop: 10 }}>
              <Button title="Editar" onPress={() => handleEditProduct(item)} />
            </View>

            <View style={{ marginTop: 10 }}>
              <Button
                title="Excluir"
                onPress={() => handleDeleteProduct(item.id)}
              />
            </View>
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Sair" onPress={() => navigation.navigate("Login")} />
      </View>
    </View>
  );
}