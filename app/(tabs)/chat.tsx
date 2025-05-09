import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ScrollView, 
  Dimensions, 
  Modal, 
  LayoutRectangle, 
  Alert 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { launchCamera } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'doctor' | 'patient';
  image?: string;
  timestamp: Date;
  reactions?: string[];
}

const DoctorChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalPosition, setModalPosition] = useState<LayoutRectangle>({ 
    x: 0, 
    y: 0, 
    width: 0, 
    height: 0 
  });
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Math.random().toString(),
        text: inputText,
        sender: 'doctor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: true,
        includeBase64: false,
      });

      if (result.assets?.[0]?.uri) {
        const newMessage: Message = {
          id: Math.random().toString(),
          text: '',
          sender: 'doctor',
          image: result.assets[0].uri,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Failed to access camera');
    }
  };

  const handleMessageLongPress = (message: Message, event: any) => {
    event.target.measure((x: number, y: number, width: number, height: number) => {
      setModalPosition({ x, y, width, height });
      setSelectedMessage(message);
    });
  };

  const addReaction = (emoji: string) => {
    if (!selectedMessage) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { 
            ...msg, 
            reactions: [...new Set([...(msg.reactions || []), emoji])]
          } 
        : msg
    ));
    setSelectedMessage(null);
  };

  const deleteMessage = () => {
    if (!selectedMessage) return;
    
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
            setSelectedMessage(null);
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageBubble,
        item.sender === 'doctor' ? styles.doctorBubble : styles.patientBubble,
      ]}
      onLongPress={(e) => handleMessageLongPress(item, e.nativeEvent)}
      activeOpacity={0.8}
    >
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.attachmentImage}
          resizeMode="cover"
        />
      )}
      
      {item.text !== '' && (
        <Text style={[
          styles.messageText,
          item.sender === 'doctor' ? styles.doctorText : styles.patientText
        ]}>
          {item.text}
        </Text>
      )}
      
      {item.reactions && item.reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {item.reactions.map((emoji, index) => (
            <Text key={index} style={styles.reactionEmoji}>{emoji}</Text>
          ))}
        </View>
      )}
      
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Dr. Sarah Johnson</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <Ionicons name="videocam" size={24} color="white" />
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        ref={scrollViewRef}
      />

      <Modal visible={!!selectedMessage} transparent animationType="fade">
        <View style={[
          styles.modalContainer,
          { top: modalPosition.y - 40, left: modalPosition.x + 20 }
        ]}>
          <View style={styles.emojiContainer}>
            {['❤️', '😂', '😮', '😢', '👍', '👎'].map(emoji => (
              <TouchableOpacity
                key={emoji}
                onPress={() => addReaction(emoji)}
                style={styles.emojiButton}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={deleteMessage} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleCamera} style={styles.attachmentButton}>
          <Ionicons name="camera" size={28} color="#284b63" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={28} color="#284b63" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
          placeholderTextColor="#888"
          multiline
        />

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#284b63',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  headerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  headerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  messagesContainer: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  doctorBubble: {
    backgroundColor: '#284b63',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  patientBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  doctorText: {
    color: 'white',
  },
  patientText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  attachmentButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(40,75,99,0.1)',
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#284b63',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    shadowColor: '#284b63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
    gap: 3,
  },
  reactionEmoji: {
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#284b63',
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  emojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  emojiButton: {
    padding: 5,
  },
  emojiText: {
    fontSize: 24,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
});

export default DoctorChatScreen;