import React, { useState } from 'react';
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
}

export function SetupScreen({ onStart }: SetupScreenProps) {
    const [apiKey, setApiKey] = useState('');
    const [userName, setUserName] = useState('');

    const canStart = apiKey.trim().length > 20;

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.topSpacer} />

            <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>N</Text>
            </View>
            <Text style={styles.avatarName}>Nikki</Text>
            <Text style={styles.avatarSubtitle}>wants to message you</Text>
            </View>

            <View style={styles.card}>
            <Text style={styles.label}>Your name (optional)</Text>
            <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="What should Nikki call you?"
                placeholderTextColor="#AEAEB2"
                autoCapitalize="words"
                returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Anthropic API Key</Text>
            <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="sk-ant-..."
                placeholderTextColor="#AEAEB2"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                returnKeyType="done"
            />
            <Text style={styles.hint}>
                Your key is only stored in memory and never leaves your device.
                Get one at console.anthropic.com
            </Text>
            </View>

            <TouchableOpacity
            style={[styles.button, !canStart && styles.buttonDisabled]}
            onPress={() => canStart && onStart(apiKey.trim(), userName.trim() || 'you')}
            activeOpacity={0.8}
            disabled={!canStart}
            >
            <Text style={styles.buttonText}>Start chatting</Text>
            </TouchableOpacity>

            <Text style={styles.warning}>
            ⚠️ This app simulates an obsessive character for entertainment purposes.
            For mature audiences only.
            </Text>

            <View style={styles.bottomSpacer} />
        </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    topSpacer: { height: 80 },
    bottomSpacer: { height: 40 },
    avatarWrap: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#C7B8EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#C7B8EA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '300',
    },
    avatarName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.5,
    },
    avatarSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        width: '100%',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6C6C70',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#FAFAFA',
    },
    hint: {
        fontSize: 12,
        color: '#AEAEB2',
        marginTop: 8,
        lineHeight: 17,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 14,
        paddingVertical: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#AEAEB2',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    warning: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 18,
        maxWidth: 300,
    },
});