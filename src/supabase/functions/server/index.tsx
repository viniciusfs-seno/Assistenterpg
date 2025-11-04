import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// ===== AUTH ROUTES =====

app.post('/make-server-9334e2c0/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ===== CHARACTER ROUTES =====

app.get('/make-server-9334e2c0/characters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const characters = await kv.getByPrefix(`character:${user.id}:`);
    return c.json({ characters: characters.map(c => c.value) });
  } catch (error) {
    console.log('Get characters error:', error);
    return c.json({ error: 'Failed to fetch characters' }, 500);
  }
});

app.post('/make-server-9334e2c0/characters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const character = await c.req.json();
    const characterId = crypto.randomUUID();
    const characterData = { ...character, id: characterId, userId: user.id };
    
    await kv.set(`character:${user.id}:${characterId}`, characterData);
    return c.json({ character: characterData });
  } catch (error) {
    console.log('Create character error:', error);
    return c.json({ error: 'Failed to create character' }, 500);
  }
});

app.delete('/make-server-9334e2c0/characters/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const characterId = c.req.param('id');
    await kv.del(`character:${user.id}:${characterId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete character error:', error);
    return c.json({ error: 'Failed to delete character' }, 500);
  }
});

// ===== ROOM ROUTES =====

app.post('/make-server-9334e2c0/rooms', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Generate a 6-character room code
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomData = {
      code: roomCode,
      dmId: user.id,
      combatants: [],
      currentTurnIndex: 0,
      combatStarted: false,
      round: 1,
      createdAt: Date.now(),
    };

    await kv.set(`room:${roomCode}`, roomData);
    return c.json({ room: roomData });
  } catch (error) {
    console.log('Create room error:', error);
    return c.json({ error: 'Failed to create room' }, 500);
  }
});

app.get('/make-server-9334e2c0/rooms/:code', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const roomCode = c.req.param('code');
    const roomData = await kv.get(`room:${roomCode}`);
    
    if (!roomData) {
      return c.json({ error: 'Room not found' }, 404);
    }

    return c.json({ room: roomData });
  } catch (error) {
    console.log('Get room error:', error);
    return c.json({ error: 'Failed to fetch room' }, 500);
  }
});

app.put('/make-server-9334e2c0/rooms/:code', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const roomCode = c.req.param('code');
    const updates = await c.req.json();
    
    const existingRoom = await kv.get(`room:${roomCode}`);
    if (!existingRoom) {
      return c.json({ error: 'Room not found' }, 404);
    }

    const updatedRoom = { ...existingRoom, ...updates };
    await kv.set(`room:${roomCode}`, updatedRoom);
    
    return c.json({ room: updatedRoom });
  } catch (error) {
    console.log('Update room error:', error);
    return c.json({ error: 'Failed to update room' }, 500);
  }
});

app.delete('/make-server-9334e2c0/rooms/:code', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const roomCode = c.req.param('code');
    const roomData = await kv.get(`room:${roomCode}`);
    
    if (!roomData) {
      return c.json({ error: 'Room not found' }, 404);
    }

    // Only DM can delete room
    if (roomData.dmId !== user.id) {
      return c.json({ error: 'Only the DM can delete the room' }, 403);
    }

    await kv.del(`room:${roomCode}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete room error:', error);
    return c.json({ error: 'Failed to delete room' }, 500);
  }
});

Deno.serve(app.fetch);
