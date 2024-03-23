/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env';

const Bot = {
  _id: 2,
  name: 'Mr. Bot',
  avatar: 'https://gravatar.com/avatar/668e357ca01060e52e0025452546a170?s=400&d=robohash&r=x',
};

const App = () => {
  const [messages, setMessages] = useState([
    {
      _id: 2,
      text: 'My name is Mr. Bot',
      createdAt: new Date(),
      user: Bot,
    },
    {
      _id: 1,
      text: 'Hi',
      createdAt: new Date(),
      user: Bot,
    },
  ]);

  useEffect(() => {
    Dialogflow_V2?.setConfiguration(
      dialogflowConfig?.client_email,
      dialogflowConfig?.private_key,
      Dialogflow_V2?.LANG_ENGLISH_US,
      dialogflowConfig?.project_id
    );
  }, []);

  const handleGoogleResponse = (result) => {
    let text = result?.queryResult?.fulfillmentMessages[0]?.text?.text[0];
    console.log(process);
    sendBotResponse(text);
  };

  const sendBotResponse = (text) => {
    let msg = {
      _id: messages.length + 1,
      text,
      createdAt: new Date(),
      user: Bot,
    };
    setMessages((previousMessages) => GiftedChat?.append(previousMessages, [msg]));
  };

  const onSend = (messages = []) => {
    setMessages((previousMessages) => GiftedChat?.append(previousMessages, messages));
    let message = messages[0]?.text;
    Dialogflow_V2?.requestQuery(
      message,
      (response) => {
        handleGoogleResponse(response);
      },
      (error) => console?.log(error)
    );
  };

  const onQuickReply = (quickReply) => {
    setMessages((previousMessages) => GiftedChat?.append(previousMessages, quickReply));
    let message = quickReply[0]?.value;
    Dialogflow_V2?.requestQuery(
      message,
      (response) => handleGoogleResponse(response),
      (error) => console.log(error)
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GiftedChat messages={messages} onSend={(message) => onSend(message)} onQuickReply={(quickReply) => onQuickReply(quickReply)} user={{ id: 1 }} />
    </View>
  );
};

export default App;

