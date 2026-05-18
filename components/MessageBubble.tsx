import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { Message } from '../hooks/useNikki';

interface MessageBubbleProps{
    message: Message;
    obsessionStage: number;
}

const NIKKI_BUBBLE_COLORS = [
    '#E9E9EB', // Stage 0: standard gray
    '#E9E9EB', // Stage 1: same
    '#F0E6E6', // Stage 2: faint pink tinge
    '#F5D8D8', // Stage 3: unsettling blush
];

const NIKKI_TEXT_COLORS = [
    '#000000',
    '#1a1a1a',
    '#2a0a0a',
    '#1a0000',
];

export function MessageBubble({ message, obsessionStage}: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(12)).current;  

    useEffect(() => {
        Animated.parallel([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }),
        ]).start();
    }, []);

    const bubbleColor = isUser ? '#007AFF' : NIKKI_BUBBLE_COLORS[Math.min(obsessionStage, 3)];
    const textColor = isUser ? '#FFFFFF' : NIKKI_TEXT_COLORS[Math.min(obsessionStage, 3)];

    const formattedTime = message.timestamp.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <Animated.View
            style={[
                styles.row,
                isUser ? styles.rowUser : styles.rowNikki,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
            >
            {!isUser && (
                <View style={styles.avatar}>
                <Text style={styles.avatarText}>N</Text>
                </View>
            )}
            <View style={styles.bubbleColumn}>
                <View
                style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleNikki,
                    { backgroundColor: bubbleColor },
                ]}
                >
                <Text style={[styles.messageText, { color: textColor }]}>
                    {message.content}
                </Text>
                </View>
                <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampNikki]}>
                {formattedTime}
                </Text>
            </View>
        </Animated.View>
    );
}

export function TypingIndicator() {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot: Animated.Value, delay: number) => {
        Animated.loop(
            Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.delay(600),
            ])
        ).start();
        };
        animate(dot1, 0);
        animate(dot2, 150);
        animate(dot3, 300);
    }, []);

    return (
        <View style={styles.row}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={[styles.bubble, styles.bubbleNikki, styles.typingBubble]}>
            {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
                key={i}
                style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
            />
            ))}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 2,
        paddingHorizontal: 12,
    },
    rowUser: {
        justifyContent: 'flex-end',
    },
    rowNikki: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#C7B8EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        marginBottom: 14,
    },
    avatarText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    bubbleColumn: {
        maxWidth: '72%',
    },
    bubble: {
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 9,
    },
    bubbleUser: {
        borderBottomRightRadius: 4,
    },
    bubbleNikki: {
        borderBottomLeftRadius: 4,
        backgroundColor: '#E9E9EB',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: -0.2,
    },
    timestamp: {
        fontSize: 10,
        color: '#8E8E93',
        marginTop: 3,
        marginHorizontal: 4,
    },
    timestampUser: {
        textAlign: 'right',
    },
    timestampNikki: {
        textAlign: 'left',
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 14,
        gap: 4,
    },
    typingDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#8E8E93',
    },
});