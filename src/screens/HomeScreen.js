import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../firebase/productService";

export default function HomeScreen({ navigation, route }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  function formatPrice(value) {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return (Number(numericValue) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

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

  useEffect(() => {
    if (route.params?.scannedBarcode) {
      setBarcode(String(route.params.scannedBarcode));
    }
    if (route.params?.preservedName !== undefined) {
      setName(route.params.preservedName);
    }
    if (route.params?.preservedPrice !== undefined) {
      setPrice(route.params.preservedPrice);
    }
  }, [
    route.params?.scannedBarcode,
    route.params?.preservedName,
    route.params?.preservedPrice,
  ]);

  function clearForm() {
    setName("");
    setPrice("");
    setBarcode("");
    setEditingProductId(null);
  }

  async function handleSaveProduct() {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Atenção", "Preencha nome e preço do produto.");
      return;
    }

    const numericPrice = parseFloat(
      price.replace(/\./g, "").replace(",", ".")
    );

    const productData = {
      name: name.trim(),
      price: numericPrice,
      barcode: barcode ? barcode.trim() : "",
    };

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await createProduct(productData);
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
    setName(product.name || "");
    setPrice(
      Number(product.price).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setBarcode(product.barcode || "");
    setEditingProductId(product.id);
  }

  async function handleDeleteProduct(productId) {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              if (editingProductId === productId) clearForm();
              loadProducts();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o produto.");
            }
          },
        },
      ]
    );
  }

  function handleOpenScanner() {
    navigation.navigate("BarcodeScanner", {
      name,
      price,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          ListHeaderComponent={
            <>
              <Text style={{ fontSize: 24, marginTop: 40, marginBottom: 20 }}>
                Bem-vindo!
              </Text>

              <View style={{ marginBottom: 20 }}>
                <Button
                  title="Ler código de barras"
                  onPress={handleOpenScanner}
                />
              </View>

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
                onChangeText={(value) => setPrice(formatPrice(value))}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 5,
                }}
              />

              <TextInput
                placeholder="Código de barras"
                value={barcode}
                onChangeText={setBarcode}
                style={{
                  borderWidth: 1,
                  marginBottom: 20,
                  padding: 10,
                  borderRadius: 5,
                }}
              />

              <Button
                title={
                  editingProductId ? "Atualizar produto" : "Cadastrar produto"
                }
                onPress={handleSaveProduct}
              />

              {editingProductId && (
                <View style={{ marginTop: 10 }}>
                  <Button
                    title="Cancelar edição"
                    onPress={clearForm}
                    color="gray"
                  />
                </View>
              )}

              <Text
                style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}
              >
                Produtos cadastrados
              </Text>
            </>
          }
          ListEmptyComponent={
            <Text>Nenhum produto cadastrado.</Text>
          }
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
              <Text>
                Preço: R${" "}
                {Number(item.price).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text>
                Código de barras: {item.barcode || "Não informado"}
              </Text>

              <View style={{ marginTop: 10 }}>
                <Button
                  title="Editar"
                  onPress={() => handleEditProduct(item)}
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <Button
                  title="Excluir"
                  onPress={() => handleDeleteProduct(item.id)}
                />
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={{ marginTop: 20 }}>
              <Button
                title="Sair"
                onPress={() => navigation.navigate("Login")}
              />
            </View>
          }
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}