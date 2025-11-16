import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();
app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

// ===== AUTH ROUTES =====
app.post('/make-server-9334e2c0/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
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
app.get('/make-server-9334e2c0/test-db', async (c) => {
  try {
    console.log('Testing database connection...');
    const testKey = 'test:' + Date.now();
    const testValue = { message: 'test', timestamp: Date.now() };
    await kv.set(testKey, testValue);
    console.log('Set test value with key:', testKey);
    const retrieved = await kv.get(testKey);
    console.log('Retrieved test value:', JSON.stringify(retrieved));
    await kv.del(testKey);
    console.log('Cleaned up test value');
    return c.json({ success: true, message: 'Database working correctly', testValue, retrieved });
  } catch (error) {
    console.log('Database test error:', error);
    return c.json({ error: error.message || 'Database test failed' }, 500);
  }
});

app.get('/make-server-9334e2c0/characters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      console.log('Get characters - unauthorized:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const prefix = `character:${user.id}:`;
    console.log('Fetching characters with prefix:', prefix);
    const characters = await kv.getByPrefix(prefix);
    console.log('Found characters:', characters.length, JSON.stringify(characters));
    return c.json({ characters: characters });
  } catch (error) {
    console.log('Get characters error:', error);
    return c.json({ error: 'Failed to fetch characters' }, 500);
  }
});

// NOVO: Endpoint para buscar personagem individual COM perícias
app.get('/make-server-9334e2c0/characters/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const characterId = c.req.param('id');
    const key = `character:${user.id}:${characterId}`;
    const character = await kv.get(key);

    if (!character) {
      return c.json({ error: 'Character not found' }, 404);
    }

    // Buscar perícias da tabela character_skills
    const { data: skills, error: skillsError } = await supabase
      .from('character_skills')
      .select('skill_name, grau_treinamento, outros')
      .eq('character_id', characterId);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
    }

    // Montar mapa de graus e bônus
    const periciaGrados: { [nome: string]: number } = {};
    const periciasBonusExtra: { [nome: string]: number } = {};

    if (skills) {
      for (const skill of skills) {
        if (skill.skill_name) {
          periciaGrados[skill.skill_name] = skill.grau_treinamento || 0;
          if (skill.outros && skill.outros !== 0) {
            periciasBonusExtra[skill.skill_name] = skill.outros;
          }
        }
      }
    }

    // Adicionar ao personagem
    character.periciaGrados = periciaGrados;
    character.periciasBonusExtra = periciasBonusExtra;

    return c.json({ character });
  } catch (error) {
    console.error('Error get character:', error);
    return c.json({ error: 'Failed to fetch character' }, 500);
  }
});

app.post('/make-server-9334e2c0/characters', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      console.log('Create character - unauthorized:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const character = await c.req.json();
    const characterId = crypto.randomUUID();
    const characterData = { ...character, id: characterId, userId: user.id };
    const key = `character:${user.id}:${characterId}`;
    console.log('Saving character with key:', key);
    console.log('Character data:', JSON.stringify(characterData));
    await kv.set(key, characterData);
    console.log('Character saved successfully');
    const saved = await kv.get(key);
    console.log('Verification - retrieved character:', JSON.stringify(saved));
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
app.get('/make-server-9334e2c0/rooms', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      console.log('List rooms - unauthorized:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const mine = c.req.query('mine');
    if (mine === '1') {
      console.log('Fetching rooms for user:', user.id);
      const allRooms = await kv.getByPrefix('room:');
      console.log('All rooms found:', allRooms.length);
      const userRooms = allRooms.filter((room) => room.dmId === user.id);
      console.log('User rooms:', userRooms.length);
      return c.json({ rooms: userRooms });
    }
    return c.json({ rooms: [] });
  } catch (error) {
    console.log('List rooms error:', error);
    return c.json({ error: 'Failed to list rooms' }, 500);
  }
});

app.post('/make-server-9334e2c0/rooms', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (!user || authError) {
      console.log('Create room - unauthorized:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomData = {
      code: roomCode,
      dmId: user.id,
      combatants: [],
      currentTurnIndex: 0,
      combatStarted: false,
      round: 1,
      status: 'CLOSED',
      lastMasterSeen: null,
      createdAt: Date.now()
    };
    console.log('Creating room:', roomCode, 'for DM:', user.id);
    await kv.set(`room:${roomCode}`, roomData);
    console.log('Room created successfully');
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
      console.log('Get room - unauthorized:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const roomCode = c.req.param('code');
    let roomData = await kv.get(`room:${roomCode}`);
    if (!roomData) {
      console.log('Room not found:', roomCode);
      return c.json({ error: 'Room not found' }, 404);
    }
    const isDM = roomData.dmId === user.id;
    console.log(`Get room ${roomCode} - User: ${user.id}, isDM: ${isDM}, currentStatus: ${roomData.status}`);
    if (isDM) {
      roomData = { ...roomData, status: 'ACTIVE', lastMasterSeen: Date.now() };
      await kv.set(`room:${roomCode}`, roomData);
      console.log(`Room ${roomCode} activated by DM`);
    } else {
      const now = Date.now();
      const heartbeatAge = roomData.lastMasterSeen ? now - roomData.lastMasterSeen : Infinity;
      console.log(`Player checking room ${roomCode} - heartbeatAge: ${heartbeatAge}ms`);
      if (heartbeatAge > 1800000) {
        roomData = { ...roomData, status: 'CLOSED' };
        await kv.set(`room:${roomCode}`, roomData);
        console.log(`Room ${roomCode} marked as CLOSED (DM inactive)`);
      }
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
