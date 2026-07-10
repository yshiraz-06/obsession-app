import React, { useState, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
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
          Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();

        onSend(trimmed);
        setText('');
    };

    const canSend = text.trim().length > 0 && !disabled;

    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={text}
                      onChangeText={setText}
                      placeholder="Message"
                      placeholderTextColor="#6B7280"
                      multiline
                      maxLength={500}
                      returnKeyType="send"
                      onSubmitEditing={handleSend}
                      blurOnSubmit={false}
                      editable={!disabled}
                    />
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
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#13131F',
        borderTopWidth: 1,
        borderTopColor: '#252538',
        paddingTop: 10,
        paddingHorizontal: 14,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderWidth: 1.5,
        borderColor: '#2D2D44',
        borderRadius: 22,
        backgroundColor: '#1E1E2E',
        paddingHorizontal: 18,
        paddingVertical: 10,
        minHeight: 44,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        maxHeight: 100,
        paddingTop: 0,
        paddingBottom: 0,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    sendActive: {
        backgroundColor: '#7C3AED',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
    },
    sendInactive: {
        backgroundColor: '#2D2D44',
    },
    sendIcon: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: -1,
    },
    homeIndicator: {
        height: Platform.OS === 'ios' ? 24 : 8,
    },
});