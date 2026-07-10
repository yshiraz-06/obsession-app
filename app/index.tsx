import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Animated,
  Platform,
  KeyboardAvoidingView,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble, TypingIndicator } from '../components/MessageBubble';
import { InputBar } from '../components/InputBar';
import { SetupScreen } from '../components/SetupScreen';
import { useNikki } from '../hooks/useNikki';
import { initNotifications, cancelNikkiNotifications, scheduleNikkiAwayNotifications } from '../services/notifications';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [userName, setUserName] = useState('');
  const [started, setStarted] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initNotifications();
    AsyncStorage.getItem('@nikki_user_name').then(name => {
      if (name) {
        setUserName(name);
        setStarted(true);
      }
    }).catch(() => {});
  }, []);

  const { messages, obsessionScore, obsessionStage, isTyping, sendMessage, resetChat } = useNikki(apiKey, userName);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (started) {
          scheduleNikkiAwayNotifications(obsessionStage, userName);
        }
      } else if (nextAppState === 'active') {
        cancelNikkiNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [started, obsessionStage, userName]);

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
    AsyncStorage.setItem('@nikki_user_name', name).catch(() => {});
  };

  const handleReset = async () => {
    await resetChat();
    await AsyncStorage.removeItem('@nikki_user_name');
  };

  const handleBackToMenu = () => {
    setStarted(false);
  };

  if (!started) {
    return (
      <SetupScreen
        onStart={handleStart}
        defaultUserName={userName}
        hasExistingChat={messages.length > 0 || Boolean(userName)}
        onContinue={() => setStarted(true)}
        onReset={handleReset}
      />
    );
  }

  const renderItem = ({ item }: any) => (
    <MessageBubble message={item} obsessionStage={obsessionStage} />
  );

  return (
    <View style={styles.container}>
      <ChatHeader
        obsessionStage={obsessionStage}
        onBack={handleBackToMenu}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          ListHeaderComponent={
            <View style={styles.dateStamp}>
              <View style={styles.dateStampPill}>
                <Text style={styles.dateStampText}>
                  Today • {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nikki is preparing to message you...</Text>
            </View>
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <InputBar onSend={sendMessage} disabled={isTyping} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D14',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#0D0D14',
  },
  messageListContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  dateStamp: {
    alignItems: 'center',
    marginVertical: 14,
  },
  dateStampPill: {
    backgroundColor: '#1E1E2E',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  dateStampText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  stageBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 115 : 96,
    left: 20,
    right: 20,
    zIndex: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#373752',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  stageBannerText: {
    fontSize: 14,
    fontWeight: '700',
  },
});