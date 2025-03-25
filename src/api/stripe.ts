import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const createCheckoutSession = async (tier: 'plus' | 'ultra', userId: string) => {
  try {
    // Get user's email from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier === 'plus' 
            ? import.meta.env.VITE_STRIPE_PLUS_PRICE_ID
            : import.meta.env.VITE_STRIPE_ULTRA_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/payment-cancelled`,
      customer_email: profile.email,
      metadata: {
        userId,
        tier,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const handlePaymentSuccess = async (sessionId: string) => {
  try {
    // Retrieve the session to get metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { userId, tier } = session.metadata;

    // Get current user profile to check existing tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('token_usage')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Calculate new token amount based on tier
    const newTokenAmount = tier === 'plus' ? 200000 : 500000;
    
    // Add new tokens to existing remaining tokens
    const currentRemaining = profile.token_usage.remaining || 0;
    const newTotal = profile.token_usage.total || 0;
    const newLimit = profile.token_usage.limit + newTokenAmount;
    const newRemaining = currentRemaining + newTokenAmount;

    // Update user's profile with new subscription and tokens
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_subscribed: true,
        subscription_tier: tier,
        token_usage: {
          total: newTotal,
          limit: newLimit,
          remaining: newRemaining,
          last_reset: new Date().toISOString(),
        },
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        tier,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      });

    if (subscriptionError) throw subscriptionError;

    return { success: true };
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}; 