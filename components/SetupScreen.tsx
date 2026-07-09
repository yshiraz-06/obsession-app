import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

interface SetupScreenProps {
    onStart: (apiKey: string, userName: string) => void;
    defaultUserName?: string;
    hasExistingChat?: boolean;
    onContinue?: () => void;
    onReset?: () => Promise<void> | void;
}

export function SetupScreen({ onStart, defaultUserName, hasExistingChat, onContinue, onReset }: SetupScreenProps) {
    const [userName, setUserName] = useState(defaultUserName || '');

    useEffect(() => {
        if (defaultUserName) {
            setUserName(defaultUserName);
        }
    }, [defaultUserName]);

    const handleStartNew = async () => {
        if (onReset) {
            await onReset();
        }
        onStart('', userName.trim() || 'you');
    };

    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
              <View style={styles.topSpacer} />

              <View style={styles.avatarWrap}>
                <View style={styles.avatarGlow}>
                  <View style={styles.avatar}>
                      <Text style={styles.avatarText}>N</Text>
                  </View>
                </View>
                <Text style={styles.avatarName}>Nikki</Text>
                <Text style={styles.avatarSubtitle}>is waiting to message you...</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={setUserName}
                  placeholder="What should Nikki call you?"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleStartNew}
                />
              </View>

              {hasExistingChat && onContinue ? (
                <View style={styles.buttonStack}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onContinue}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Continue Ongoing Chat</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleStartNew}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>Start New Chat</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleStartNew}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Start Chatting with Nikki</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.warning}>
                ⚠️ This app simulates an obsessive psychological character for entertainment & narrative purposes. For mature audiences only.
              </Text>

              <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D14',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 22,
    },
    topSpacer: { height: 60 },
    bottomSpacer: { height: 40 },
    avatarWrap: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarGlow: {
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#C084FC',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '700',
    },
    avatarName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    avatarSubtitle: {
        fontSize: 15,
        color: '#A855F7',
        marginTop: 6,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#161622',
        borderRadius: 20,
        padding: 22,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2D2D44',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#373752',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 17,
        color: '#FFFFFF',
        backgroundColor: '#1E1E2E',
    },
    buttonStack: {
        width: '100%',
        marginBottom: 20,
        gap: 12,
    },
    button: {
        backgroundColor: '#7C3AED',
        borderRadius: 16,
        paddingVertical: 18,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#A855F7',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    secondaryButton: {
        backgroundColor: '#1E1E2E',
        borderRadius: 16,
        paddingVertical: 16,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#373752',
    },
    secondaryButtonText: {
        color: '#D1D5DB',
        fontSize: 16,
        fontWeight: '600',
    },
    warning: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 310,
    },
});