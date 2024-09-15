<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Braces, Phone, Fingerprint } from 'lucide-vue-next'
import { useConfigStore } from '@/stores/configStore'

const config = useConfigStore()
</script>

<template>
  <Card class="w-96 max-w-full">
    <CardHeader>
      <CardTitle>Configuration</CardTitle>
      <CardDescription>Add WhatsApp configuration</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4">
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label
            for="phoneNumberId"
            class="flex items-center"
          >
            <Fingerprint class="inline w-4 h-4 mr-2" /> Phone number ID
          </Label>
          <Input
            id="phoneNumberId"
            v-model="config.phoneNumberId"
            name="phoneNumberId"
            type="text"
          />
        </div>
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label
            for="token"
            class="flex items-center"
          >
            <Braces class="inline w-4 h-4 mr-2" /> Token
          </Label>
          <Input
            id="token"
            v-model="config.token"
            name="token"
            type="text"
          />
        </div>
        <div class="grid w-full max-w-sm items-center gap-1.5">
          <Label
            for="phoneNumberTo"
            class="flex items-center"
          >
            <Phone class="inline w-4 h-4 mr-2" /> Phone number to test
          </Label>
          <Input
            id="phoneNumberTo"
            v-model="config.phoneNumberTo"
            name="phoneNumberTo"
            type="text"
            pattern="[0-9]"
            inputmode="numeric"
          />
        </div>
      </form>
    </CardContent>
  </Card>
</template>
