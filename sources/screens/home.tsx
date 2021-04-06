
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import SmsRetriever from 'react-native-sms-retriever'

import { Sentence } from '../references/constants/sentence'

function Home() {
  const [appHash, setAppHash] = useState<string | undefined>()
  const [lastCode, setLastCode] = useState<string | undefined>()
  const [isListeningMessage, setIsListeningMessage] = useState(false)

  useEffect(() => {
    SmsRetriever.getAppSignature()
    .then(appHash => setAppHash(appHash))
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center'
        }}
      >
        <Text
          style = {{
            fontSize: 24,
            fontWeight: 'bold'
          }}
        >
          App Hash: {appHash || '-'}
        </Text>

        <Text
          style = {{
            fontSize: 24,
            fontWeight: 'bold'
          }}
        >
          Last Code: {lastCode || '-'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled = {isListeningMessage}
          onPress = {_onSmsListenerPressed}
          style={{
            backgroundColor: isListeningMessage ? 'gray' : 'dodgerblue',
            borderRadius: 8,
            elevation: 4,
            marginHorizontal: 20,
            marginTop: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            shadowColor: 'dimgray',
            shadowOffset: {
              height: 2,
              width: 0
            },
            shadowOpacity: 0.3,
            shadowRadius: 4
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '500'
            }}
          >
            {isListeningMessage ? 'Listening For A Message...' : 'Start SMS Listener'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style = {{
          color: 'gray',
          margin: 20,
          textAlign: 'center'
        }}
      >
        {Sentence.starterWatermark}
      </Text>
    </SafeAreaView>
  )

  async function _onSmsListenerPressed() {
    setLastCode(undefined)

    try {
      const registered = await SmsRetriever.startSmsRetriever()
      
      if (registered) {
        setIsListeningMessage(true)

        SmsRetriever.addSmsListener(event => {
          setLastCode(event.message?.split('/')[0].split(' ')[event.message?.split('/')[0].split(' ').length - 1])

          SmsRetriever.removeSmsListener()

          setIsListeningMessage(false)
        }) 
      }
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }
}

export default Home
