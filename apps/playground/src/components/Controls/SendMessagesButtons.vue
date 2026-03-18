<script setup lang="ts">
import { Send } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useSendMessages from '@/composables/useSendMessages'
import { useMessagesStore } from '@/stores/messagesStore'

const messages = useMessagesStore()
const { sendMessages, sendingMessages, availableToSend } = useSendMessages()
</script>

<template>
  <Card class="w-96 max-w-full">
    <CardHeader>
      <CardTitle class="flex items-center">
        <Send class="inline w-5 h-5 mr-2" /> Messaging
      </CardTitle>
      <CardDescription>Send messages to test</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap justify-around gap-3">
        <Button
          :disabled="availableToSend || messages.messages.length === 0"
          @click="sendMessages(messages.messages)"
        >
          {{ sendingMessages ? 'Sending...' : 'Send messages' }}
        </Button>
        <Button
          variant="destructive"
          :disabled="messages.messages.length === 0"
          @click="messages.clearMessages()"
        >
          Clear messages
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
