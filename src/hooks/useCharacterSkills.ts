// src/hooks/useCharacterSkills.ts - COMPLETO

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import { CharacterSkill, GrauTreinamento, PERICIAS_BASE } from '../types/character';

export function useCharacterSkills(characterId: string) {
  const [skills, setSkills] = useState<CharacterSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('character_skills')
        .select('*')
        .eq('character_id', characterId);

      if (fetchError) throw fetchError;

      const skillsList: CharacterSkill[] = data.map((skill: any) => ({
        id: skill.id,
        characterId: skill.character_id,
        skillName: skill.skill_name,
        grauTreinamento: skill.grau_treinamento,
        outros: skill.outros,
      }));

      setSkills(skillsList);
    } catch (err: any) {
      console.error('Erro ao carregar perícias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  const initializeSkills = useCallback(async () => {
    const skillsToInsert = PERICIAS_BASE.map(pericia => ({
      character_id: characterId,
      skill_name: pericia.nome,
      grau_treinamento: GrauTreinamento.DESTREINADO,
      outros: 0,
    }));

    const { error: insertError } = await supabase
      .from('character_skills')
      .insert(skillsToInsert);

    if (insertError) throw insertError;

    await loadSkills();
  }, [characterId, loadSkills]);

  const updateSkillGrau = useCallback(async (
    skillName: string,
    novoGrau: GrauTreinamento
  ) => {
    const { error: updateError } = await supabase
      .from('character_skills')
      .update({ grau_treinamento: novoGrau })
      .eq('character_id', characterId)
      .eq('skill_name', skillName);

    if (updateError) throw updateError;

    await loadSkills();
  }, [characterId, loadSkills]);

  const updateSkillOutros = useCallback(async (
    skillName: string,
    novosOutros: number
  ) => {
    const { error: updateError } = await supabase
      .from('character_skills')
      .update({ outros: novosOutros })
      .eq('character_id', characterId)
      .eq('skill_name', skillName);

    if (updateError) throw updateError;

    await loadSkills();
  }, [characterId, loadSkills]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return {
    skills,
    loading,
    error,
    initializeSkills,
    updateSkillGrau,
    updateSkillOutros,
    reloadSkills: loadSkills,
  };
}
