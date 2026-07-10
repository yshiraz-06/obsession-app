import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface ChatHeaderProps {
    obsessionStage: number;
    onBack?: () => void;
}

const ONLINE_DOT_COLORS = ['#10B981', '#10B981', '#10B981', '#10B981'];

export function ChatHeader({ obsessionStage, onBack }: ChatHeaderProps) {
    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.6}>
            <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>

        <View style={styles.center}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: '#7C3AED' }]}>
                  <Text style={styles.avatarInitial}>N</Text>
              </View>
              <View style={[styles.onlineDot, { backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.name}>Nikki</Text>
            <Text style={styles.status}>Active now</Text>
        </View>

        <View style={styles.rightSpacer} />
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#13131F',
        paddingTop: Platform.OS === 'ios' ? 56 : 42,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#252538',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minWidth: 60,
    },
    backChevron: {
        fontSize: 32,
        color: '#A855F7',
        lineHeight: 34,
        marginTop: -2,
        fontWeight: '300',
    },
    unreadBadge: {
        backgroundColor: '#7C3AED',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginLeft: -2,
    },
    unreadBadgeUnhinged: {
        backgroundColor: '#DC2626',
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
    },
    center: {
        alignItems: 'center',
        flex: 1,
    },
    avatarWrap: {
        position: 'relative',
        marginBottom: 4,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
    avatarInitial: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#13131F',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    status: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
        fontWeight: '500',
    },
    statusUnhinged: {
        color: '#F87171',
        fontWeight: '700',
    },
    rightSpacer: {
        minWidth: 60,
    },
});