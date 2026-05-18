import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface ChatHeaderProps {
    obsessionStage: number;
    obsessionScore: number;
    onBack?: () => void;
}

// Nikki's status line changes subtly with each stage
const STATUS_LINES = [
    'Active now',
    'Thinking about you...',
    'Always here 🙂',
    "I'll never leave",
];

const ONLINE_DOT_COLORS = ['#34C759', '#34C759', '#FF9500', '#FF3B30'];

export function ChatHeader({ obsessionStage, obsessionScore, onBack }: ChatHeaderProps) {
    const stage = Math.min(obsessionStage, 3);
    const statusLine = STATUS_LINES[stage];
    const dotColor = ONLINE_DOT_COLORS[stage];

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.6}>
            <Text style={styles.backChevron}>‹</Text>
            <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>∞</Text>
            </View>
        </TouchableOpacity>

        <View style={styles.center}>
            <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>N</Text>
            </View>
            <View style={[styles.onlineDot, { backgroundColor: dotColor }]} />
            </View>
            <Text style={styles.name}>Nikki</Text>
            <Text style={styles.status}>{statusLine}</Text>
        </View>

        <TouchableOpacity style={styles.infoButton} activeOpacity={0.6}>
            <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F2F2F7',
        paddingTop: Platform.OS === 'ios' ? 54 : 40,
        paddingBottom: 10,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        minWidth: 50,
    },
    backChevron: {
        fontSize: 30,
        color: '#007AFF',
        lineHeight: 34,
        marginTop: -2,
    },
    unreadBadge: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginLeft: -2,
    },
    unreadText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    center: {
        alignItems: 'center',
        flex: 1,
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: 3,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#C7B8EA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#F2F2F7',
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.3,
    },
    status: {
        fontSize: 11,
        color: '#8E8E93',
        marginTop: 1,
    },
    infoButton: {
        minWidth: 50,
        alignItems: 'flex-end',
    },
    infoIcon: {
        fontSize: 22,
        color: '#007AFF',
    },
});