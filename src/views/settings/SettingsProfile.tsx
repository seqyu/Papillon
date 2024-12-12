import { NativeItem, NativeList, NativeListHeader, NativeText } from "@/components/Global/NativeComponents";
import { Screen } from "@/router/helpers/types";
import { useCurrentAccount } from "@/stores/account";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Plus, TextCursorInput, User2, UserCircle2, WholeWord } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, Switch, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsProfile: Screen<"SettingsProfile"> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const account = useCurrentAccount(store => store.account!);
  const mutateProperty = useCurrentAccount(store => store.mutateProperty);

  const [oldFirstName, setOldFirstName] = useState(account.studentName?.first ?? "");
  const [oldLastName, setOldLastName] = useState(account.studentName?.last ?? "");

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  const [firstName, setFirstName] = useState(account.studentName?.first ?? "");
  const [lastName, setLastName] = useState(account.studentName?.last ?? "");

  // on name change, update the account name
  useEffect(() => {
    let newLastName = lastName;
    let newFirstName = firstName;

    if (newFirstName.trim() === "") {
      newFirstName = oldFirstName;
    }

    if (newLastName.trim() === "") {
      newLastName = oldLastName;
    }

    mutateProperty("studentName", {
      first: newFirstName.trim(),
      last: newLastName.trim(),
    });
  }, [firstName, lastName]);

  const [profilePic, setProfilePic] = useState(account.personalization.profilePictureB64);
  const [loadingPic, setLoadingPic] = useState(false);

  const updateProfilePic = async () => {
    setLoadingPic(true);

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const img = "data:image/jpeg;base64," + result.assets[0].base64;
      setProfilePic(img);
      mutateProperty("personalization", {
        ...account.personalization,
        profilePictureB64: img,
      });
    }

    setLoadingPic(false);
  };

  const [hideNameOnHomeScreen, setHideNameOnHomeScreen] = useState(account.personalization.hideNameOnHomeScreen);
  const [hideProfilePicOnHomeScreen, setHideProfilePicOnHomeScreen] = useState(account.personalization.hideProfilePicOnHomeScreen);

  useEffect(() => {
    mutateProperty("personalization", {
      ...account.personalization,
      hideNameOnHomeScreen: hideNameOnHomeScreen,
      hideProfilePicOnHomeScreen: hideProfilePicOnHomeScreen,
    });
  }, [hideNameOnHomeScreen, hideProfilePicOnHomeScreen]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={insets.top + 44}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          paddingBottom: 16 + insets.bottom,
        }}
      >

        <NativeListHeader
          label="Photo de profil"
        />

        <NativeList>
          <NativeItem
            chevron={true}
            onPress={() => updateProfilePic()}
            leading={profilePic &&
              <Image
                source={{ uri: profilePic }}
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 90,
                  // @ts-expect-error : borderCurve is not in the Image style
                  borderCurve: "continuous",
                }}
              />
            }
            icon={!profilePic && <Camera />}
            trailing={
              <ActivityIndicator animating={loadingPic} />
            }
          >
            <NativeText variant="title">
              {profilePic ? "Changer la photo de profil" : "Ajouter une photo de profil"}
            </NativeText>
            {!profilePic ? (
              <NativeText variant="subtitle">
                Personnalisez votre compte en ajoutant une photo de profil.
              </NativeText>
            ) : (
              <NativeText variant="subtitle">
                Votre photo de profil reste sur votre appareil.
              </NativeText>
            )}
          </NativeItem>
        </NativeList>

        <NativeListHeader
          label="Prénom et nom"
        />

        <NativeList>

          <NativeItem
            onPress={() => firstNameRef.current?.focus()}
            chevron={false}
            icon={<User2 />}
          >
            <NativeText variant="subtitle">
              Prénom
            </NativeText>
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: "semibold",
                color: theme.colors.text,
              }}
              placeholder="Théo"
              placeholderTextColor={theme.colors.text + "80"}
              value={firstName}
              onChangeText={setFirstName}
              ref={firstNameRef}
            />
          </NativeItem>

          <NativeItem
            onPress={() => lastNameRef.current?.focus()}
            chevron={false}
            icon={<TextCursorInput />}
          >
            <NativeText variant="subtitle">
              Nom de famille
            </NativeText>
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: "semibold",
                color: theme.colors.text,
              }}
              placeholder="Dubois"
              placeholderTextColor={theme.colors.text + "80"}
              value={lastName}
              onChangeText={setLastName}
              ref={lastNameRef}
            />
          </NativeItem>

        </NativeList>

        <NativeListHeader
          label="Afficher sur l'accueil"
        />

        <NativeList>
          <NativeItem
            chevron={false}
            icon={<WholeWord />}
            trailing={
              <Switch
                value={!hideNameOnHomeScreen}
                onValueChange={() => setHideNameOnHomeScreen(!hideNameOnHomeScreen)}
              />
            }
          >
            <NativeText style={{
              fontSize: 16,
              fontFamily: "semibold",
              color: theme.colors.text,
            }}>
              Nom de famille
            </NativeText>
          </NativeItem>

          <NativeItem
            chevron={false}
            icon={<UserCircle2 />}
            trailing={
              <Switch
                value={!hideProfilePicOnHomeScreen}
                onValueChange={() => setHideProfilePicOnHomeScreen(!hideProfilePicOnHomeScreen)}
              />
            }
          >
            <NativeText style={{
              fontSize: 16,
              fontFamily: "semibold",
              color: theme.colors.text,
            }}>
              Photo de profil
            </NativeText>
          </NativeItem>
        </NativeList>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettingsProfile;