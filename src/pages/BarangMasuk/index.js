import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconDelete from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-paper";
import { TextInputMask } from "react-native-masked-text";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";

import styles from "./styles";
import { Button, LoadingIndicator } from "../../components";
import { tambahBarang } from "../../redux/actions";

const BarangMasuk = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [namaBarang, setNamaBarang] = useState("");
  const [jumlahBarang, setJumlahBarang] = useState("");
  const [hargaBarang, setHargaBarang] = useState("");
  const [imgBarang, setImgBarang] = useState("");
  const [visible, setVisible] = useState(false);

  const { barang } = useSelector(
    (state) => ({
      barang: state.barang,
    }),
    shallowEqual,
  );

  const _tambahBarang = async () => {
    // const data = {
    //   name: namaBarang,
    //   quantity: jumlahBarang,
    //   amount: hargaBarang,
    //   photo: imgBarang,
    // };

    const data = new FormData();
    data.append("name", namaBarang);
    data.append("quantity", jumlahBarang);
    data.append("amount", hargaBarang);
    data.append("photo", {
      uri: imgBarang,
      type: "image/jpeg",
      name: "imageName.jpeg",
    });

    await dispatch(tambahBarang({ data }));
    setVisible(true);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ height: 170, justifyContent: "center", marginTop: 20 }}>
          {imgBarang == "" ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Kamera", {
                  onGoBack: (value) => setImgBarang(value),
                })
              }>
              <Text style={{ textAlign: "center" }}>Tambah Foto</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ alignSelf: "center" }}>
              <TouchableOpacity
                onPress={() => setImgBarang("")}
                style={styles.IconDelete}>
                <IconDelete name="ios-close" size={25} color="red" />
              </TouchableOpacity>
              <Image
                source={{ uri: imgBarang }}
                style={{ height: 180, width: 180 }}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Nama Barang"
            mode="outlined"
            placeholder={"Masukan Nama Barang"}
            value={namaBarang}
            onChangeText={(namaBarang) => setNamaBarang(namaBarang)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Jumlah Barang"
            mode="outlined"
            placeholder={"Masukan Jumlah Barang"}
            value={jumlahBarang}
            onChangeText={(jumlahBarang) => setJumlahBarang(jumlahBarang)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Harga Barang"
            mode="outlined"
            placeholder={"Masukan Harga Barang"}
            value={hargaBarang}
            onChangeText={(hargaBarang) => setHargaBarang(hargaBarang)}
            // render={(props) => (
            //   <TextInputMask
            //     {...props}
            //     type={"money"}
            //     options={{
            //       precision: 0,
            //       separator: ",",
            //       delimiter: ".",
            //       unit: "Rp.",
            //       suffixUnit: "",
            //     }}
            //   />
            // )}
          />
        </View>

        <View style={{ marginHorizontal: 10 }}>
          <Button text={"Tambah"} onPress={() => _tambahBarang()} />
        </View>
      </ScrollView>

      <Modal isVisible={visible}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
          <View style={{ marginVertical: 40 }}>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              Berhasil Tambah Data Barang
            </Text>
          </View>
          <Button
            text={"Done"}
            onPress={() => {
              setVisible(false);
              navigation.navigate("ListBarang");
            }}
          />
        </View>
      </Modal>

      <Modal isVisible={barang?.isLoadingTambah}>
        <LoadingIndicator isLoading={barang?.isLoadingTambah} />
      </Modal>
    </SafeAreaView>
  );
};

export default BarangMasuk;
