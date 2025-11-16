// src/hooks/useCharacter.ts - CORRIGIDO COMPLETO

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { Character, calcularStats, ClasseType, GrauTreinamento, ProficienciaType } from '../types/character';
import { useAuth } from '../components/AuthContext';
import { getClasseData } from '../data/classes';

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

      const { data: skillsData, error: skillsError } = await supabase
        .from('character_skills')
        .select('skill_name, grau_treinamento, outros')
        .eq('character_id', id);

      if (skillsError) {
        console.error('Erro ao buscar perícias:', skillsError);
      }

      const { data: proficienciesData, error: proficienciesError } = await supabase
        .from('character_proficiencies')
        .select('proficiency_type')
        .eq('character_id', id);

      if (proficienciesError) {
        console.error('Erro ao buscar proficiências:', proficienciesError);
      }

      const { data: powersData, error: powersError } = await supabase
        .from('character_powers')
        .select('power_id')
        .eq('character_id', id);

      if (powersError) {
        console.error('Erro ao buscar poderes:', powersError);
      }

      const { data: tecnicasBasicasData, error: tecnicasError } = await supabase
        .from('character_techniques_basic')
        .select('categoria, grau')
        .eq('character_id', id);

      if (tecnicasError) {
        console.error('Erro ao buscar técnicas básicas:', tecnicasError);
      }

      const periciaGrados: { [nome: string]: GrauTreinamento } = {};
      const periciasBonusExtra: { [nome: string]: number } = {};

      if (skillsData) {
        for (const skill of skillsData) {
          if (skill.skill_name) {
            periciaGrados[skill.skill_name] = skill.grau_treinamento || 0;
            if (skill.outros && skill.outros !== 0) {
              periciasBonusExtra[skill.skill_name] = skill.outros;
            }
          }
        }
      }

      const proficiencias = proficienciesData?.map(p => p.proficiency_type as ProficienciaType) || [];
      const poderesIds = powersData?.map(p => p.power_id) || [];

      const tecnicasBasicas: { [categoria: string]: number } = {};
      if (tecnicasBasicasData) {
        for (const t of tecnicasBasicasData) {
          if (t.categoria && typeof t.grau === 'number') {
            tecnicasBasicas[t.categoria] = t.grau;
          }
        }
      }

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

        atributoEA: data.atributo_ea || 'intelecto',
        estudouEscolaTecnica: data.estudou_escola_tecnica || false,

        nivel: data.nivel,
        classe: data.classe as ClasseType,
        trilha: data.trilha,
        subcaminhoMestreBarreiras: data.subcaminho_mestre_barreiras,
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

        periciaGrados,
        periciasBonusExtra,
        proficiencias,
        poderesIds,

        tecnicasBasicas,

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

    // ✅ CORRIGIDO: Ordem correta dos parâmetros
    // calcularStats(nivel, classe, atributos, atributoEA, poderesIds, equipamentos)
    const stats = calcularStats(
      characterData.nivel,                      // 1º: nivel (number)
      characterData.classe,                     // 2º: classe (ClasseType)
      characterData.atributos,                  // 3º: atributos (Attributes)
      characterData.atributoEA || 'intelecto',  // 4º: atributoEA ('intelecto' | 'presenca')
      characterData.poderesIds || [],           // 5º: poderesIds (string[])
      []                                        // 6º: equipamentos (CharacterInventoryItem[])
    );

    const subcaminhoValidado = characterData.trilha === 'mestre_barreiras'
      ? characterData.subcaminhoMestreBarreiras
      : null;

    const insertData = {
      user_id: user.id,
      nome: characterData.nome,
      idade: characterData.idade || null,
      descricao: characterData.descricao || null,
      avatar_url: characterData.avatarUrl || null,
      jogador: characterData.jogador || null,
      alinhamento: characterData.alinhamento || null,

      nivel: characterData.nivel,
      classe: characterData.classe,
      trilha: characterData.trilha || null,
      subcaminho_mestre_barreiras: subcaminhoValidado,
      origem_id: characterData.origemId,

      agilidade: characterData.atributos.agilidade,
      forca: characterData.atributos.forca,
      intelecto: characterData.atributos.intelecto,
      presenca: characterData.atributos.presenca,
      vigor: characterData.atributos.vigor,

      atributo_ea: characterData.atributoEA,
      estudou_escola_tecnica: characterData.estudouEscolaTecnica || false,

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
      defesa_equipamento: stats.defesaEquipamento || 0,
      defesa_outros: stats.defesaOutros || 0,

      rd: stats.rd || 0,
      rd_equipamento: stats.rdEquipamento || 0,
      rd_outros: stats.rdOutros || 0,

      deslocamento: stats.deslocamento,
      limite_pe_ea: stats.limitePE_EA,
      
      morrendo: Math.max(0, Math.min(4, stats.morrendo || 0)),
      enlouquecendo: Math.max(0, Math.min(3, stats.enlouquecendo || 0)),

      grau_feiticeiro: characterData.grauFeiticeiro,
      pontos_prestigio: characterData.pontosPrestígio || 0,
      prestigio_cla: characterData.prestigioCla || null,
    };

    console.log('📝 Dados para inserção:', insertData);

    const { data, error: insertError } = await supabase
      .from('characters')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir personagem:', insertError);
      throw insertError;
    }

    const characterId = data.id;

    const classeData = getClasseData(characterData.classe);
    if (classeData?.proficiencias && classeData.proficiencias.length > 0) {
      const proficienciasParaSalvar = classeData.proficiencias.map(profType => ({
        character_id: characterId,
        proficiency_type: profType,
      }));

      const { error: profError } = await supabase
        .from('character_proficiencies')
        .insert(proficienciasParaSalvar);

      if (profError) {
        console.error('Erro ao salvar proficiências:', profError);
      }
    }

    return characterId;
  }, [user]);

  const updateCharacter = useCallback(async (
    updates: Partial<Character>
  ) => {
    if (!character) throw new Error('Nenhum personagem carregado');

    let newStats = character.stats;
    if (updates.atributos || updates.nivel || updates.classe || updates.atributoEA || updates.poderesIds) {
      // ✅ CORRIGIDO: Ordem correta dos parâmetros
      // calcularStats(nivel, classe, atributos, atributoEA, poderesIds, equipamentos)
      newStats = calcularStats(
        updates.nivel ?? character.nivel,
        updates.classe ?? character.classe,
        updates.atributos ?? character.atributos,
        updates.atributoEA ?? character.atributoEA,
        updates.poderesIds ?? character.poderesIds,
        [] // equipamentos vazio por padrão
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
    if (updates.trilha !== undefined) {
      updateData.trilha = updates.trilha;
      if (updates.trilha !== 'mestre_barreiras') {
        updateData.subcaminho_mestre_barreiras = null;
      }
    }
    if (updates.subcaminhoMestreBarreiras !== undefined) {
      const trilhaAtual = updates.trilha ?? character.trilha;
      updateData.subcaminho_mestre_barreiras = trilhaAtual === 'mestre_barreiras'
        ? updates.subcaminhoMestreBarreiras
        : null;
    }
    if (updates.origemId) updateData.origem_id = updates.origemId;

    if (updates.atributos) {
      updateData.agilidade = updates.atributos.agilidade;
      updateData.forca = updates.atributos.forca;
      updateData.intelecto = updates.atributos.intelecto;
      updateData.presenca = updates.atributos.presenca;
      updateData.vigor = updates.atributos.vigor;
    }

    if (updates.atributoEA) updateData.atributo_ea = updates.atributoEA;
    if (updates.estudouEscolaTecnica !== undefined) updateData.estudou_escola_tecnica = updates.estudouEscolaTecnica;

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
    
    updateData.morrendo = Math.max(0, Math.min(4, statsToUpdate.morrendo || 0));
    updateData.enlouquecendo = Math.max(0, Math.min(3, statsToUpdate.enlouquecendo || 0));

    if (updates.grauFeiticeiro) updateData.grau_feiticeiro = updates.grauFeiticeiro;
    if (updates.pontosPrestígio !== undefined) updateData.pontos_prestigio = updates.pontosPrestígio;
    if (updates.prestigioCla !== undefined) updateData.prestigio_cla = updates.prestigioCla;

    const { error: updateError } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', character.id);

    if (updateError) throw updateError;

    if (updates.proficiencias !== undefined) {
      await supabase
        .from('character_proficiencies')
        .delete()
        .eq('character_id', character.id);

      if (updates.proficiencias.length > 0) {
        const proficienciasParaSalvar = updates.proficiencias.map(profType => ({
          character_id: character.id,
          proficiency_type: profType,
        }));

        await supabase
          .from('character_proficiencies')
          .insert(proficienciasParaSalvar);
      }
    }

    if (updates.poderesIds !== undefined) {
      await supabase
        .from('character_powers')
        .delete()
        .eq('character_id', character.id);

      if (updates.poderesIds.length > 0) {
        const poderesParaSalvar = updates.poderesIds.map(poderId => ({
          character_id: character.id,
          power_id: poderId,
          nivel_obtido: character.nivel,
        }));

        await supabase
          .from('character_powers')
          .insert(poderesParaSalvar);
      }
    }

    if (updates.tecnicasBasicas !== undefined) {
      await supabase
        .from('character_techniques_basic')
        .delete()
        .eq('character_id', character.id);

      const tecnicasParaSalvar = Object.entries(updates.tecnicasBasicas).map(([categoria, grau]) => ({
        character_id: character.id,
        categoria,
        grau,
      }));

      if (tecnicasParaSalvar.length > 0) {
        await supabase
          .from('character_techniques_basic')
          .insert(tecnicasParaSalvar);
      }
    }

    await loadCharacter(character.id);
  }, [character, loadCharacter]);

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

      const characterIds = data.map(c => c.id);

      const { data: allProficiencies } = await supabase
        .from('character_proficiencies')
        .select('character_id, proficiency_type')
        .in('character_id', characterIds);

      const { data: allPowers } = await supabase
        .from('character_powers')
        .select('character_id, power_id')
        .in('character_id', characterIds);

      const proficienciesByChar = new Map<string, ProficienciaType[]>();

      allProficiencies?.forEach(p => {
        const existing = proficienciesByChar.get(p.character_id) || [];
        existing.push(p.proficiency_type as ProficienciaType);
        proficienciesByChar.set(p.character_id, existing);
      });

      const powersByChar = new Map<string, string[]>();

      allPowers?.forEach(p => {
        const existing = powersByChar.get(p.character_id) || [];
        existing.push(p.power_id);
        powersByChar.set(p.character_id, existing);
      });

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
        atributoEA: char.atributo_ea || 'intelecto',
        estudouEscolaTecnica: char.estudou_escola_tecnica || false,
        nivel: char.nivel,
        classe: char.classe,
        trilha: char.trilha,
        subcaminhoMestreBarreiras: char.subcaminho_mestre_barreiras,
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
        periciaGrados: {},
        periciasBonusExtra: {},
        proficiencias: proficienciesByChar.get(char.id) || [],
        poderesIds: powersByChar.get(char.id) || [],
        grauFeiticeiro: char.grau_feiticeiro,
        pontosPrestígio: char.pontos_prestigio,
        prestigioCla: char.prestigio_cla,
        tecnicasBasicas: {},
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
