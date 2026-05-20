import { useState } from "react";
import { View, Text, Button, Alert } from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import * as Location from "expo-location";

export default function BarcodeScannerScreen({
  navigation,
  route,
}) {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  async function handleBarcodeScanned({ data }) {
    if (scanned) return;

    setScanned(true);

    try {
      // Solicita permissão do GPS
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível acessar a localização."
        );

        setScanned(false);
        return;
      }

      // Captura localização atual
      const currentLocation =
        await Location.getCurrentPositionAsync({});

      // Cria objeto simples de localização
      const location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      Alert.alert(
        "Código lido com sucesso",
        `Código: ${data}

Latitude: ${location.latitude}
Longitude: ${location.longitude}`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate({
                name: "Home",
                params: {
                  scannedBarcode: data,
                  location,

                  preservedName:
                    route.params?.name || "",

                  preservedPrice:
                    route.params?.price || "",
                },
                merge: true,
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível capturar a localização."
      );

      setScanned(false);
    }
  }

  // Carregando permissões
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
        <Text>
          Carregando permissões da câmera...
        </Text>
      </View>
    );
  }

  // Sem permissão da câmera
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
        <Text
          style={{
            fontSize: 20,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Precisamos da permissão da câmera
          para ler o código de barras.
        </Text>

        <Button
          title="Permitir acesso à câmera"
          onPress={requestPermission}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Câmera */}
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={
            scanned
              ? undefined
              : handleBarcodeScanned
          }
        />
      </View>

      {/* Área inferior */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Leitor de Código de Barras
        </Text>

        <Text style={{ marginBottom: 20 }}>
          Aponte a câmera para um código de
          barras.
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
          <Button
            title="Voltar"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
}