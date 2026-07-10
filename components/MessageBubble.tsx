import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { Message } from '../hooks/useNikki';

interface MessageBubbleProps {
    message: Message;
    obsessionStage: number;
}

const NIKKI_BUBBLE_COLORS = [
    '#1E1E2E', // Stage 0: sleek dark violet-gray
    '#2D1B36', // Stage 1: deep dark magenta-plum
    '#3B1822', // Stage 2: dark blood maroon
    '#450A0A', // Stage 3: deep intense crimson
];

const NIKKI_TEXT_COLORS = [
    '#E2E8F0',
    '#FBCFE8',
    '#FECDD3',
    '#FFE4E6',
];

export function MessageBubble({ message, obsessionStage }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(14)).current;  
    const stage = Math.min(obsessionStage, 3);

    useEffect(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
          }),
        ]).start();
    }, []);

    const bubbleColor = isUser ? '#7C3AED' : NIKKI_BUBBLE_COLORS[stage];
    const textColor = isUser ? '#FFFFFF' : NIKKI_TEXT_COLORS[stage];

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
                <View style={[styles.avatar, { backgroundColor: '#7C3AED' }]}>
                  <Text style={styles.avatarText}>N</Text>
                </View>
            )}
            <View style={styles.bubbleColumn}>
                <View
                  style={[
                      styles.bubble,
                      isUser ? styles.bubbleUser : styles.bubbleNikki,
                      { backgroundColor: bubbleColor },
                      !isUser && stage === 3 && styles.bubbleUnhingedBorder,
                      isUser && styles.bubbleUserGlow
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
                Animated.timing(dot, { toValue: -6, duration: 320, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 0, duration: 320, useNativeDriver: true }),
                Animated.delay(500),
              ])
          ).start();
        };
        animate(dot1, 0);
        animate(dot2, 160);
        animate(dot3, 320);
    }, []);

    return (
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: '#7C3AED' }]}>
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
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    rowUser: {
        justifyContent: 'flex-end',
    },
    rowNikki: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 16,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 3,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    bubbleColumn: {
        maxWidth: '76%',
    },
    bubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    bubbleUser: {
        borderBottomRightRadius: 4,
    },
    bubbleUserGlow: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
    bubbleNikki: {
        borderBottomLeftRadius: 4,
        backgroundColor: '#1E1E2E',
        borderWidth: 1,
        borderColor: '#2D2D44',
    },
    bubbleUnhingedBorder: {
        borderColor: '#EF4444',
        borderWidth: 1.5,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: -0.2,
        fontWeight: '400',
    },
    timestamp: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 4,
        marginHorizontal: 6,
        fontWeight: '500',
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
        paddingHorizontal: 16,
        paddingVertical: 15,
        gap: 6,
        backgroundColor: '#1E1E2E',
        borderColor: '#2D2D44',
        borderWidth: 1,
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#C084FC',
    },
});