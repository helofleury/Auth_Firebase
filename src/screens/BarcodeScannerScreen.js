import { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function BarcodeScannerScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  function handleBarcodeScanned({ data }) {
    if (scanned) return;

    setScanned(true);

    Alert.alert("Código lido", data, [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate({
            name: "Home",
            params: {
              scannedBarcode: data,
              preservedName: route.params?.name || "",
              preservedPrice: route.params?.price || "",
            },
            merge: true,
          });
        },
      },
    ]);
  }

  if (!permission) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>Carregando permissões da câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20, textAlign: "center" }}>
          Precisamos da permissão da câmera para ler o código de barras.
        </Text>

        <Button title="Permitir acesso à câmera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Leitor de Código de Barras
        </Text>

        <Text style={{ marginBottom: 20 }}>
          Aponte a câmera para um código de barras.
        </Text>

        {scanned && (
          <Button
            title="Ler novamente"
            onPress={() => {
              setScanned(false);
            }}
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </View>
  );
}