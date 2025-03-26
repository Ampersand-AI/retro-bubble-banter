import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-test-request',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // For test requests, skip authentication
    const isTestRequest = req.headers.get('x-test-request') === 'true'
    console.log('Is test request:', isTestRequest)
    
    if (!isTestRequest) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        console.error('No authorization header')
        throw new Error('No authorization header')
      }

      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (authError || !user) {
        console.error('Auth error:', authError)
        throw new Error('Invalid token')
      }
    }

    const requestData = await req.json()
    console.log('Received request data:', JSON.stringify(requestData, null, 2))

    if (!requestData.messages || !Array.isArray(requestData.messages)) {
      console.error('Invalid request format:', requestData)
      throw new Error('Invalid messages format. Expected an array of messages.')
    }

    // Validate each message has required fields
    const messages = requestData.messages.map(msg => {
      if (!msg.content) {
        console.error('Invalid message format:', msg)
        throw new Error('Each message must have a content field')
      }
      return {
        role: msg.role || 'user',
        content: msg.content
      }
    })

    console.log('Validated messages:', JSON.stringify(messages, null, 2))

    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!claudeApiKey) {
      console.error('CLAUDE_API_KEY is not set')
      throw new Error('CLAUDE_API_KEY is not set')
    }

    const claudeRequest = {
      model: 'claude-3-sonnet',
      max_tokens: 4096,
      temperature: 0.7,
      system: "You are a helpful AI assistant.",
      messages: messages
    }

    console.log('Sending to Claude API:', JSON.stringify(claudeRequest, null, 2))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudeRequest)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Claude API error:', JSON.stringify(errorData, null, 2))
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Claude API response:', JSON.stringify(data, null, 2))

    // Format the response to match the expected format
    const formattedResponse = {
      content: data.content,
      usage: data.usage,
      model: data.model,
      role: data.role,
      stop_reason: data.stop_reason,
      stop_sequence: data.stop_sequence
    }

    return new Response(
      JSON.stringify(formattedResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Edge Function error:', error.message)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 