// src/hooks/useCharacter.ts - CORRIGIDO

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { Character, calcularStats, ClasseType } from '../types/character';
import { useAuth } from '../components/AuthContext';

export function useCharacter(characterId?: string) {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacter = useCallback(async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const characterData: Character = {
        id: data.id,
        userId: data.user_id,
        nome: data.nome,
        idade: data.idade,
        descricao: data.descricao,
        avatarUrl: data.avatar_url,
        jogador: data.jogador,
        alinhamento: data.alinhamento,
        
        atributos: {
          agilidade: data.agilidade,
          forca: data.forca,
          intelecto: data.intelecto,
          presenca: data.presenca,
          vigor: data.vigor,
        },
        
        nivel: data.nivel,
        classe: data.classe as ClasseType,
        trilha: data.trilha,
        origemId: data.origem_id,
        
        cla: data.cla,
        tecnicaInataId: data.tecnica_inata_id,
        
        stats: {
          pvAtual: data.pv_atual,
          pvMax: data.pv_max,
          peAtual: data.pe_atual,
          peMax: data.pe_max,
          eaAtual: data.ea_atual,
          eaMax: data.ea_max,
          sanAtual: data.san_atual,
          sanMax: data.san_max,
          defesa: data.defesa,
          defesaBase: data.defesa_base,
          defesaEquipamento: data.defesa_equipamento,
          defesaOutros: data.defesa_outros,
          rd: data.rd,
          rdEquipamento: data.rd_equipamento,
          rdOutros: data.rd_outros,
          deslocamento: data.deslocamento,
          limitePE_EA: data.limite_pe_ea,
          morrendo: data.morrendo,
          enlouquecendo: data.enlouquecendo,
        },
        
        grauFeiticeiro: data.grau_feiticeiro,
        pontosPrestígio: data.pontos_prestigio,
        prestigioCla: data.prestigio_cla,
        
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setCharacter(characterData);
    } catch (err: any) {
      console.error('Erro ao carregar personagem:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createCharacter = useCallback(async (
    characterData: Omit<Character, 'id' | 'userId' | 'stats' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) throw new Error('Usuário não autenticado');

    const stats = calcularStats(
      characterData.nivel,
      characterData.classe,
      characterData.atributos,
      [],
      []
    );

    const insertData = {
      user_id: user.id,
      nome: characterData.nome,
      idade: characterData.idade,
      descricao: characterData.descricao,
      avatar_url: characterData.avatarUrl,
      jogador: characterData.jogador,
      alinhamento: characterData.alinhamento,
      
      nivel: characterData.nivel,
      classe: characterData.classe,
      trilha: characterData.trilha,
      origem_id: characterData.origemId,
      
      agilidade: characterData.atributos.agilidade,
      forca: characterData.atributos.forca,
      intelecto: characterData.atributos.intelecto,
      presenca: characterData.atributos.presenca,
      vigor: characterData.atributos.vigor,
      
      cla: characterData.cla,
      tecnica_inata_id: characterData.tecnicaInataId,
      
      pv_atual: stats.pvAtual,
      pv_max: stats.pvMax,
      pe_atual: stats.peAtual,
      pe_max: stats.peMax,
      ea_atual: stats.eaAtual,
      ea_max: stats.eaMax,
      san_atual: stats.sanAtual,
      san_max: stats.sanMax,
      
      defesa: stats.defesa,
      defesa_base: stats.defesaBase,
      defesa_equipamento: stats.defesaEquipamento,
      defesa_outros: stats.defesaOutros,
      
      rd: stats.rd,
      rd_equipamento: stats.rdEquipamento,
      rd_outros: stats.rdOutros,
      
      deslocamento: stats.deslocamento,
      limite_pe_ea: stats.limitePE_EA,
      morrendo: stats.morrendo,
      enlouquecendo: stats.enlouquecendo,
      
      grau_feiticeiro: characterData.grauFeiticeiro,
      pontos_prestigio: characterData.pontosPrestígio,
      prestigio_cla: characterData.prestigioCla,
    };

    const { data, error: insertError } = await supabase
      .from('characters')
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    return data.id;
  }, [user]);

  const updateCharacter = useCallback(async (
    updates: Partial<Character>
  ) => {
    if (!character) throw new Error('Nenhum personagem carregado');

    let newStats = character.stats;
    if (updates.atributos || updates.nivel || updates.classe) {
      newStats = calcularStats(
        updates.nivel ?? character.nivel,
        updates.classe ?? character.classe,
        updates.atributos ?? character.atributos,
        [],
        []
      );
    }

    const updateData: any = {};
    
    if (updates.nome) updateData.nome = updates.nome;
    if (updates.idade !== undefined) updateData.idade = updates.idade;
    if (updates.descricao !== undefined) updateData.descricao = updates.descricao;
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
    if (updates.jogador !== undefined) updateData.jogador = updates.jogador;
    if (updates.alinhamento !== undefined) updateData.alinhamento = updates.alinhamento;
    
    if (updates.nivel) updateData.nivel = updates.nivel;
    if (updates.classe) updateData.classe = updates.classe;
    if (updates.trilha !== undefined) updateData.trilha = updates.trilha;
    if (updates.origemId) updateData.origem_id = updates.origemId;
    
    if (updates.atributos) {
      updateData.agilidade = updates.atributos.agilidade;
      updateData.forca = updates.atributos.forca;
      updateData.intelecto = updates.atributos.intelecto;
      updateData.presenca = updates.atributos.presenca;
      updateData.vigor = updates.atributos.vigor;
    }
    
    if (updates.cla) updateData.cla = updates.cla;
    if (updates.tecnicaInataId) updateData.tecnica_inata_id = updates.tecnicaInataId;
    
    const statsToUpdate = updates.stats ?? newStats;
    updateData.pv_atual = statsToUpdate.pvAtual;
    updateData.pv_max = statsToUpdate.pvMax;
    updateData.pe_atual = statsToUpdate.peAtual;
    updateData.pe_max = statsToUpdate.peMax;
    updateData.ea_atual = statsToUpdate.eaAtual;
    updateData.ea_max = statsToUpdate.eaMax;
    updateData.san_atual = statsToUpdate.sanAtual;
    updateData.san_max = statsToUpdate.sanMax;
    updateData.defesa = statsToUpdate.defesa;
    updateData.defesa_base = statsToUpdate.defesaBase;
    updateData.defesa_equipamento = statsToUpdate.defesaEquipamento;
    updateData.defesa_outros = statsToUpdate.defesaOutros;
    updateData.rd = statsToUpdate.rd;
    updateData.rd_equipamento = statsToUpdate.rdEquipamento;
    updateData.rd_outros = statsToUpdate.rdOutros;
    updateData.deslocamento = statsToUpdate.deslocamento;
    updateData.limite_pe_ea = statsToUpdate.limitePE_EA;
    updateData.morrendo = statsToUpdate.morrendo;
    updateData.enlouquecendo = statsToUpdate.enlouquecendo;
    
    if (updates.grauFeiticeiro) updateData.grau_feiticeiro = updates.grauFeiticeiro;
    if (updates.pontosPrestígio !== undefined) updateData.pontos_prestigio = updates.pontosPrestígio;
    if (updates.prestigioCla !== undefined) updateData.prestigio_cla = updates.prestigioCla;

    const { error: updateError } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', character.id);

    if (updateError) throw updateError;

    await loadCharacter(character.id);
  }, [character, loadCharacter]);

  // CORRIGIDO: deleteCharacter agora aceita characterId como parâmetro
  const deleteCharacter = useCallback(async (characterId: string) => {
    const { error: deleteError } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);

    if (deleteError) throw deleteError;

    if (character && character.id === characterId) {
      setCharacter(null);
    }
  }, [character]);

  useEffect(() => {
    if (characterId) {
      loadCharacter(characterId);
    } else {
      setLoading(false);
    }
  }, [characterId, loadCharacter]);

  return {
    character,
    loading,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    reloadCharacter: () => character && loadCharacter(character.id),
  };
}

export function useCharacterList() {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const characterList: Character[] = data.map((char: any) => ({
        id: char.id,
        userId: char.user_id,
        nome: char.nome,
        idade: char.idade,
        descricao: char.descricao,
        avatarUrl: char.avatar_url,
        jogador: char.jogador,
        alinhamento: char.alinhamento,
        atributos: {
          agilidade: char.agilidade,
          forca: char.forca,
          intelecto: char.intelecto,
          presenca: char.presenca,
          vigor: char.vigor,
        },
        nivel: char.nivel,
        classe: char.classe,
        trilha: char.trilha,
        origemId: char.origem_id,
        cla: char.cla,
        tecnicaInataId: char.tecnica_inata_id,
        stats: {
          pvAtual: char.pv_atual,
          pvMax: char.pv_max,
          peAtual: char.pe_atual,
          peMax: char.pe_max,
          eaAtual: char.ea_atual,
          eaMax: char.ea_max,
          sanAtual: char.san_atual,
          sanMax: char.san_max,
          defesa: char.defesa,
          defesaBase: char.defesa_base,
          defesaEquipamento: char.defesa_equipamento,
          defesaOutros: char.defesa_outros,
          rd: char.rd,
          rdEquipamento: char.rd_equipamento,
          rdOutros: char.rd_outros,
          deslocamento: char.deslocamento,
          limitePE_EA: char.limite_pe_ea,
          morrendo: char.morrendo,
          enlouquecendo: char.enlouquecendo,
        },
        grauFeiticeiro: char.grau_feiticeiro,
        pontosPrestígio: char.pontos_prestigio,
        prestigioCla: char.prestigio_cla,
        createdAt: char.created_at,
        updatedAt: char.updated_at,
      }));

      setCharacters(characterList);
    } catch (err: any) {
      console.error('Erro ao carregar personagens:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return {
    characters,
    loading,
    error,
    reloadCharacters: loadCharacters,
  };
}
