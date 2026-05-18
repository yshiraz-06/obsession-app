import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';

interface InputBarProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
    const [text, setText] = useState('');
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;

        Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();

        onSend(trimmed);
        setText('');
    };

    const canSend = text.trim().length > 0 && !disabled;

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        >
        <View style={styles.container}>
            <View style={styles.inputRow}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.6}>
                <Text style={styles.iconText}>+</Text>
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="iMessage"
                placeholderTextColor="#AEAEB2"
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
                editable={!disabled}
                />
                <TouchableOpacity style={styles.emojiButton} activeOpacity={0.6}>
                <Text style={styles.emojiText}>🎤</Text>
                </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                style={[styles.sendButton, canSend ? styles.sendActive : styles.sendInactive]}
                onPress={handleSend}
                activeOpacity={0.7}
                disabled={!canSend}
                >
                <Text style={styles.sendIcon}>↑</Text>
                </TouchableOpacity>
            </Animated.View>
            </View>

            <View style={styles.homeIndicator} />
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F2F2F7',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#C6C6C8',
        paddingTop: 8,
        paddingHorizontal: 12,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#C7C7CC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 1,
    },
    iconText: {
        fontSize: 20,
        color: '#fff',
        lineHeight: 22,
        fontWeight: '300',
        marginTop: -1,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderWidth: 1,
        borderColor: '#C6C6C8',
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        minHeight: 36,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        maxHeight: 100,
        paddingTop: 0,
        paddingBottom: 0,
    },
    emojiButton: {
        marginLeft: 4,
        marginBottom: 1,
    },
    emojiText: {
        fontSize: 18,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 1,
    },
    sendActive: {
        backgroundColor: '#007AFF',
    },
    sendInactive: {
        backgroundColor: '#C7C7CC',
    },
    sendIcon: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        marginTop: -1,
    },
    homeIndicator: {
        height: Platform.OS === 'ios' ? 28 : 12,
    },
});