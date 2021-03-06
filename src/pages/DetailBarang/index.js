import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IconDelete from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-paper";
import Modal from "react-native-modal";

import styles from "./styles";
import { Button, LoadingIndicator } from "../../components";
import { Colors } from "../../config";
import { baseUrl } from "../../utils";
import {
  getDetailBarang,
  editBarang,
  keluarBarang,
  tambahBarangDefact,
} from "../../redux/actions";

const DetailBarang = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { barang } = useSelector(
    (state) => ({
      barang: state.barang,
    }),
    shallowEqual,
  );

  const [namaBarang, setNamaBarang] = useState("");
  const [idBarang, setIdBarang] = useState("");
  const [jumlahBarang, setJumlahBarang] = useState("");
  const [hargaBarang, setHargaBarang] = useState("");
  const [imgBarang, setImgBarang] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [rak, setRak] = useState("");
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(getDetailBarang({ id: route.params.id }));
    }, []),
  );

  useEffect(() => {
    if (barang?.dataDetailBarang) {
      setIdBarang(barang?.dataDetailBarang?.alias_id);
      setJumlahBarang(barang?.dataDetailBarang?.quantity);
      setNamaBarang(barang?.dataDetailBarang?.name);
      setHargaBarang(barang?.dataDetailBarang?.amount);
      setWarehouse(barang?.dataDetailBarang?.warehouse_name);
      setRak(barang?.dataDetailBarang?.rack_name);
      setImgBarang(
        barang?.dataDetailBarang?.photo !== ""
          ? `${baseUrl.URL_IMG}${barang?.dataDetailBarang?.photo}`
          : "",
      );
    }
  }, [barang?.dataDetailBarang]);

  const _editBarang = async () => {
    const data = {
      quantity: jumlahBarang.toString(),
      name: namaBarang,
      amount: hargaBarang.toString(),
      photo: imgBarang,
    };
    await dispatch(
      editBarang({ id: route.params.id, data, cb: () => setVisible(true) }),
    );
  };

  const _defactBarang = async () => {
    const data = {
      quantity: jumlahBarang,
    };
    await dispatch(
      tambahBarangDefact({
        data,
        id: route.params.id,
        cb: () => setVisible(true),
      }),
    );
  };

  const _pressButton = (value) => {
    if (route.params.isDetail) {
      _editBarang(value);
    } else if (route.params.isDefact) {
      _defactBarang();
    } else {
      _keluarBarang();
    }
  };

  const _keluarBarang = async () => {
    const data = {
      quantity: jumlahBarang,
    };
    await dispatch(
      keluarBarang({ data, id: route.params.id, cb: () => setVisible(true) }),
    );
  };

  return (
    <View>
      <ScrollView>
        {barang.isLoadingDetailBarang ? (
          <View>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : (
          <View>
            <View
              style={{ height: 170, justifyContent: "center", marginTop: 20 }}>
              {imgBarang == "" ? (
                <TouchableOpacity
                  disabled={route.params.isDetail ? false : true}
                  onPress={() =>
                    navigation.navigate("Kamera", {
                      onGoBack: (value) => setImgBarang(value),
                    })
                  }>
                  <Text style={{ textAlign: "center" }}>Tambah Foto</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ alignSelf: "center" }}>
                  {route.params.isDetail && (
                    <TouchableOpacity
                      onPress={() => setImgBarang("")}
                      style={styles.IconDelete}>
                      <IconDelete name="ios-close" size={25} color="red" />
                    </TouchableOpacity>
                  )}
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
                disabled
                label="Id Barang"
                mode="outlined"
                value={idBarang.toString()}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                disabled={route.params.isDetail ? false : true}
                label="Nama Barang"
                mode="outlined"
                placeholder={"Masukan Nama Barang"}
                value={namaBarang}
                onChangeText={(namaBarang) => setNamaBarang(namaBarang)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                disabled={route.params.isDetail ? true : false}
                label="Jumlah Barang"
                mode="outlined"
                placeholder={"Masukan Jumlah Barang"}
                keyboardType={"numeric"}
                value={jumlahBarang.toString()}
                onChangeText={(jumlahBarang) => setJumlahBarang(jumlahBarang)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Harga Barang"
                disabled={route.params.isDetail ? false : true}
                mode="outlined"
                placeholder={"Masukan Harga Barang"}
                keyboardType={"numeric"}
                value={hargaBarang.toString()}
                onChangeText={(hargaBarang) => setHargaBarang(hargaBarang)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput disabled label="Rak" mode="outlined" value={rak} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                disabled
                label="Gudang"
                mode="outlined"
                value={warehouse}
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button
                onPress={() => _pressButton()}
                text={
                  route.params.isDetail
                    ? "Edit Barang"
                    : route.params.isDefact
                    ? "Tambah Defact"
                    : "Keluarkan Barang"
                }
              />
            </View>
          </View>
        )}
      </ScrollView>
      <Modal isVisible={visible}>
        <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
          <View style={{ marginVertical: 40 }}>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              {route.params.isDetail
                ? "Berhasil Mengubah Data Barang"
                : route.params.isDefact
                ? "Berhasil Tambah Defact"
                : "Berhasil Mengeluarkan Barang"}
            </Text>
          </View>
          <Button
            text={"Done"}
            onPress={() => {
              navigation.navigate("ListBarang", { type: "keluar" });
              setVisible(false);
            }}
          />
        </View>
      </Modal>

      <Modal isVisible={barang?.isLoadingEdit}>
        <LoadingIndicator isLoading={barang?.isLoadingEdit} />
      </Modal>
    </View>
  );
};

export default DetailBarang;
