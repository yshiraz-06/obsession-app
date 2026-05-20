import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble, TypingIndicator } from '../components/MessageBubble';
import { InputBar } from '../components/InputBar';
import { SetupScreen } from '../components/SetupScreen';
import { useNikki } from '../hooks/useNikki';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [started, setStarted] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { messages, obsessionScore, obsessionStage, isTyping, sendMessage } = useNikki(apiKey, userName);

  const prevStage = useRef(obsessionStage);
  const stageFlashAnim = useRef(new Animated.Value(0)).current;

  // Flash a subtle banner when obsession stage changes
  useEffect(() => {
    if (obsessionStage !== prevStage.current) {
      prevStage.current = obsessionStage;
      Animated.sequence([
        Animated.timing(stageFlashAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(stageFlashAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [obsessionStage]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages, isTyping]);

  const handleStart = (key: string, name: string) => {
    setApiKey(key);
    setUserName(name);
    setStarted(true);
  };

  if (!started) {
    return <SetupScreen onStart={handleStart} />;
  }

  const STAGE_BANNER_COLORS = [
    'transparent',
    'rgba(255, 149, 0, 0.15)',
    'rgba(255, 59, 48, 0.12)',
    'rgba(120, 0, 0, 0.18)',
  ];

  const STAGE_BANNER_TEXTS = [
    '',
    'Nikki is really into you...',
    'Something feels different about Nikki.',
    "Nikki won't stop.",
  ];

  const renderItem = ({ item }: any) => (
    <MessageBubble message={item} obsessionStage={obsessionStage} />
  );

  return (
    <View style={styles.container}>
      <ChatHeader
        obsessionStage={obsessionStage}
        obsessionScore={obsessionScore}
      />

      {/* Stage transition banner */}
      <Animated.View
        style={[
          styles.stageBanner,
          {
            backgroundColor: STAGE_BANNER_COLORS[Math.min(obsessionStage, 3)],
            opacity: stageFlashAnim,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.stageBannerText}>
          {STAGE_BANNER_TEXTS[Math.min(obsessionStage, 3)]}
        </Text>
      </Animated.View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ListHeaderComponent={
          <View style={styles.dateStamp}>
            <Text style={styles.dateStampText}>
              Today {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nikki is about to text you...</Text>
          </View>
        }
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <InputBar onSend={sendMessage} disabled={isTyping} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageListContent: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  dateStamp: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateStampText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#AEAEB2',
    fontStyle: 'italic',
  },
  stageBanner: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  stageBannerText: {
    fontSize: 13,
    color: '#3A0000',
    fontWeight: '500',
  },
});