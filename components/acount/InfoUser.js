import React, { useState, } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";

import { updateProfileAsync, uploadImageAsync } from "../../utils/actions";
import { loadImageFromGalleryAsync } from "../../utils/helpers";

export default function InfoUser({ user, setShowLoading, setLoadingText }) {
  //console.log(user);
  const [imageUrl, setImageUrl] = useState(user.photoURL);

  const changeImageAsync = async () => {
    const result = await loadImageFromGalleryAsync([1, 1]);
    if (!result.status) {
      return;
    }

    setLoadingText("Updating image. please wait...");
    setShowLoading(true);
    const resultUploadImage = await uploadImageAsync(
      result.image,
      "avatars",
      user.uid
    );

    if (!resultUploadImage.statusResponse) {
      setShowLoading(false);
      Alert.alert("Error", resultUploadImage.error);
      return;
    }

    const resultUpdateProfile = await updateProfileAsync({
      photoURL: resultUploadImage.url,
    });
    setShowLoading(false);

    if (!resultUpdateProfile.statusResponse) {
        Alert.alert("Error", resultUpdateProfile.error);
        return;
    }

    setImageUrl(resultUploadImage.url);
  };

  return (
    <View style={styles.viewContainer}>
      <Avatar
        rounded={true}
        size="large"
        onPress={() => changeImageAsync()}
        source={
          imageUrl !== null
            ? { uri: imageUrl }
            : require("../../assets/avatar-default.png")
        }
      />
      <View style={styles.viewInfoUser}>
        <Text style={styles.textDisplayName}>
          {user.displayName !== null ? user.displayName : "No name yet"}
        </Text>
        <Text>{user.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    paddingVertical: 30,
  },

  viewInfoUser: {
    marginLeft: 20,
  },

  textDisplayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
