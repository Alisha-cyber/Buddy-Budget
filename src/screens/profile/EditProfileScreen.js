import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { updateUserProfile } from "../../services/userService";
import { uploadImageToCloudinary } from "../../services/uploadService";

const EditProfileScreen = ({ navigation }) => {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ""
  );

  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Failed to update profile.");

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setShowPermissionModal(true);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setUploadingImage(true);

        const localUri = result.assets[0].uri;
        const uploadedUrl = await uploadImageToCloudinary(localUri);

        setProfilePicture(uploadedUrl);
        setImageError(false);
      }
    } catch (error) {
      setErrorMessage(error?.message || "Could not upload image.");
      setShowErrorModal(true);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      setShowValidationModal(true);
      return;
    }

    try {
      setLoading(true);

      const updatedUser = await updateUserProfile(user._id, {
        name: name.trim(),
        email: email.trim(),
        profilePicture,
      });

      login(updatedUser);
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Failed to update profile.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIconButton}
          >
            <Ionicons name="chevron-back" size={22} color="#5B4B55" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
              {uploadingImage ? (
                <View style={styles.avatar}>
                  <ActivityIndicator color="#fff" />
                </View>
              ) : profilePicture && !imageError ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.avatar}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarFace}>◕‿◕</Text>
                </View>
              )}

              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.subtitle}>
              {uploadingImage
                ? "Uploading image..."
                : "Tap the image to change your profile picture"}
            </Text>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Name</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                />
              </View>
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Email</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}
              disabled={loading || uploadingImage}
            >
              {loading ? (
                <ActivityIndicator color="#253046" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showPermissionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPermissionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.warningIconWrap}>
                <Ionicons name="image-outline" size={28} color="#D97706" />
              </View>

              <Text style={styles.modalTitle}>Permission Required</Text>
              <Text style={styles.modalSubtitle}>
                Please allow photo library access to choose a profile picture.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.modalPrimaryText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showValidationModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowValidationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.warningIconWrap}>
                <Ionicons name="alert-circle-outline" size={28} color="#D97706" />
              </View>

              <Text style={styles.modalTitle}>Missing Fields</Text>
              <Text style={styles.modalSubtitle}>
                Name and email are required before saving changes.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => setShowValidationModal(false)}
              >
                <Text style={styles.modalPrimaryText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successIconWrap}>
                <Ionicons name="checkmark" size={28} color="#16A34A" />
              </View>

              <Text style={styles.modalTitle}>Profile Updated</Text>
              <Text style={styles.modalSubtitle}>
                Your profile has been updated successfully.
              </Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalPrimaryText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showErrorModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowErrorModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.errorIconWrap}>
                <Ionicons name="close" size={28} color="#DC2626" />
              </View>

              <Text style={styles.modalTitle}>Something Went Wrong</Text>
              <Text style={styles.modalSubtitle}>{errorMessage}</Text>

              <TouchableOpacity
                style={styles.modalPrimaryBtnSingle}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.modalPrimaryText}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FDEFF5",
  },

  container: {
    flex: 1,
  },

  header: {
    height: 64,
    backgroundColor: "#FFF8FB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F5DDE8",
  },

  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F9E7EE",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3F2F39",
  },

  content: {
    padding: 18,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#E8B7CA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F9C8DA",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarFace: {
    fontSize: 26,
    color: "#FFFFFF",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#DB2777",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#9D8C95",
    marginBottom: 20,
  },

  inputBlock: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5E4D57",
    marginBottom: 6,
  },

  inputWrapper: {
    backgroundColor: "#FFF7FA",
    borderWidth: 1,
    borderColor: "#F4D5E2",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    justifyContent: "center",
  },

  input: {
    fontSize: 14,
    color: "#3F2F39",
  },

  saveButton: {
    backgroundColor: "#F8C9DA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  saveButtonText: {
    fontWeight: "700",
    color: "#253046",
    fontSize: 15,
  },

  cancelButton: {
    backgroundColor: "#FCECF3",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C8D8",
    marginTop: 10,
  },

  cancelButtonText: {
    fontWeight: "700",
    color: "#D94C8A",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(31, 41, 55, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
  },

  warningIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  successIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },

  modalSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },

  modalPrimaryBtnSingle: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#F8C9DA",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  modalPrimaryText: {
    fontWeight: "700",
    color: "#253046",
    fontSize: 15,
  },
});