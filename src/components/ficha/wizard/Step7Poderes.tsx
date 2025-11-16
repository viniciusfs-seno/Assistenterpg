import { useState, useMemo } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CharacterCreationData } from '../CharacterCreationWizard';
import { PODERES, getPoderById } from '../../../data/poderes';
import { validarPreRequisitos, calcularQuantidadePoderesDisponiveis } from '../../../utils/poderValidator';
import { Sparkles, CheckCircle, XCircle, Info, Filter } from 'lucide-react';
import { CategoriaPoder } from '../../../types/poder';

interface Step7PoderesProps {
  data: CharacterCreationData;
  updateData: (updates: Partial<CharacterCreationData>) => void;
}

export function Step7Poderes({ data, updateData }: Step7PoderesProps) {
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaPoder | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [poderSelecionado, setPoderSelecionado] = useState<string | null>(null);

  const quantidadeDisponivel = calcularQuantidadePoderesDisponiveis(data.nivel);
  const quantidadeEscolhida = data.poderesIds?.length || 0;
  const podeEscolherMais = quantidadeEscolhida < quantidadeDisponivel;

  const poderesFiltrados = useMemo(() => {
    let resultado = PODERES;

    if (filtroCategoria !== 'todos') {
      resultado = resultado.filter((p) => p.categoria === filtroCategoria);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.descricao.toLowerCase().includes(termo) ||
          p.tags.some((t) => t.includes(termo))
      );
    }

    return resultado.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [filtroCategoria, busca]);

  const encontrarPoderesDependentes = (poderIdRemovido: string, poderesAtuais: string[]): string[] => {
    const dependentes: string[] = [];

    poderesAtuais.forEach((poderId) => {
      if (poderId === poderIdRemovido) return;
      const poder = getPoderById(poderId);
      if (!poder) return;

      const dependeDoPoder = poder.prerequisitos?.poderes?.some(
        (prereq) => prereq.poderId === poderIdRemovido
      );

      if (dependeDoPoder) {
        dependentes.push(poderId);
        const subDependentes = encontrarPoderesDependentes(poderId, poderesAtuais);
        dependentes.push(...subDependentes);
      }
    });

    return [...new Set(dependentes)];
  };

  const handleTogglePoder = (poderId: string) => {
    const jaEscolhido = data.poderesIds.includes(poderId);

    if (jaEscolhido) {
      const dependentes = encontrarPoderesDependentes(poderId, data.poderesIds);
      const poderesParaRemover = [poderId, ...dependentes];
      const novosPoderes = data.poderesIds.filter((id) => !poderesParaRemover.includes(id));

      updateData({
        poderesIds: novosPoderes,
      });

      if (dependentes.length > 0) {
        const nomesDependentes = dependentes
          .map((id) => getPoderById(id)?.nome)
          .filter(Boolean)
          .join(', ');

        console.log(`⚠️ Removidos poderes dependentes: ${nomesDependentes}`);
      }
    } else {
      if (podeEscolherMais) {
        updateData({
          poderesIds: [...data.poderesIds, poderId],
        });
      }
    }
  };

  const categorias: { id: CategoriaPoder | 'todos'; label: string; icon: string }[] = [
    { id: 'todos', label: 'Todos', icon: '🔮' },
    { id: 'combate_corpo_a_corpo', label: 'Corpo a Corpo', icon: '⚔️' },
    { id: 'combate_distancia', label: 'Distância', icon: '🏹' },
    { id: 'tatico', label: 'Tático', icon: '🎯' },
    { id: 'especialista', label: 'Especialista', icon: '🔧' },
    { id: 'jujutsu', label: 'Jujutsu', icon: '✨' },
  ];

  const poderDetalhado = poderSelecionado ? getPoderById(poderSelecionado) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          Poderes de Classe
        </h3>
        <p style={{ color: '#cbd5e1' }}>
          Escolha poderes especiais que definem o estilo único do seu personagem.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge
            style={{
              backgroundColor: quantidadeEscolhida >= quantidadeDisponivel ? '#15803d' : '#ef4444',
              color: '#ffffff',
              fontSize: '14px',
              padding: '8px 16px',
            }}
          >
            {quantidadeEscolhida} / {quantidadeDisponivel} poderes escolhidos
          </Badge>
          {data.nivel < 3 && (
            <Badge
              style={{
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                fontSize: '13px',
                padding: '6px 12px',
              }}
            >
              ℹ️ Poderes disponíveis a partir do nível 3
            </Badge>
          )}
        </div>
      </div>

      {quantidadeDisponivel === 0 ? (
        <Card
          className="p-8 text-center"
          style={{ backgroundColor: '#0f172a', borderColor: '#475569' }}
        >
          <Info className="w-12 h-12 mx-auto mb-4" style={{ color: '#94a3b8' }} />
          <h4 className="text-lg font-semibold text-white mb-2">Nenhum poder disponível ainda</h4>
          <p style={{ color: '#cbd5e1' }}>
            Você poderá escolher poderes nos níveis 3, 6, 9, 12, 15 e 18.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda - Filtros e lista */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filtros */}
            <Card className="p-4" style={{ backgroundColor: '#0f172a', borderColor: '#475569' }}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4" style={{ color: '#94a3b8' }} />
                  <span className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>Filtros</span>
                </div>

                {/* Busca */}
                <input
                  type="text"
                  placeholder="Buscar poderes..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                  }}
                />

                {/* Categorias */}
                <div className="flex flex-wrap gap-2">
                  {categorias.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFiltroCategoria(cat.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: filtroCategoria === cat.id ? '#ef4444' : '#1e293b',
                        color: '#ffffff',
                        border: `2px solid ${filtroCategoria === cat.id ? '#ef4444' : '#475569'}`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Lista de poderes */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {poderesFiltrados.map((poder) => {
                const jaEscolhido = data.poderesIds.includes(poder.id);
                const validacao = validarPreRequisitos(poder, data, data.poderesIds);
                const podeEscolher = validacao.valido && (jaEscolhido || podeEscolherMais);

                return (
                  <Card
                    key={poder.id}
                    onClick={() => setPoderSelecionado(poder.id)}
                    className="cursor-pointer transition-all"
                    style={{
                      backgroundColor: jaEscolhido ? 'rgba(239, 68, 68, 0.1)' : '#0f172a',
                      borderColor: jaEscolhido ? '#ef4444' : '#475569',
                      borderWidth: jaEscolhido ? '2px' : '1px',
                      padding: '16px',
                      opacity: validacao.valido ? 1 : 0.6,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-base font-semibold text-white">{poder.nome}</h4>
                          <Badge
                            style={{
                              backgroundColor: poder.tipo === 'passivo' ? '#3b82f6' : '#8b5cf6',
                              color: '#ffffff',
                              fontSize: '10px',
                              padding: '2px 8px',
                            }}
                          >
                            {poder.tipo === 'passivo' ? '🔹 Passivo' : '⚡ Manual'}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2" style={{ color: '#cbd5e1' }}>
                          {poder.descricao.substring(0, 120)}
                          {poder.descricao.length > 120 && '...'}
                        </p>
                        {!validacao.valido && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {validacao.motivos.map((motivo, idx) => (
                              <Badge
                                key={idx}
                                style={{
                                  backgroundColor: '#7f1d1d',
                                  color: '#fca5a5',
                                  fontSize: '11px',
                                  padding: '4px 8px',
                                }}
                              >
                                ⚠️ {motivo}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        {jaEscolhido ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePoder(poder.id);
                            }}
                            style={{
                              backgroundColor: '#15803d',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (podeEscolher) handleTogglePoder(poder.id);
                            }}
                            disabled={!podeEscolher}
                            style={{
                              backgroundColor: podeEscolher ? '#1e293b' : '#334155',
                              color: podeEscolher ? '#ffffff' : '#94a3b8',
                              border: `2px solid ${podeEscolher ? '#475569' : '#334155'}`,
                              padding: '8px',
                              borderRadius: '6px',
                              cursor: podeEscolher ? 'pointer' : 'not-allowed',
                            }}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}

              {poderesFiltrados.length === 0 && (
                <Card className="p-8 text-center" style={{ backgroundColor: '#0f172a', borderColor: '#475569' }}>
                  <p style={{ color: '#94a3b8' }}>Nenhum poder encontrado com os filtros atuais.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Coluna direita - Detalhes */}
          <div>
            <Card className="p-4 sticky top-4" style={{ backgroundColor: '#0f172a', borderColor: '#475569' }}>
              {poderDetalhado ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{poderDetalhado.nome}</h4>
                    <div className="flex gap-2 mb-3">
                      <Badge
                        style={{
                          backgroundColor: poderDetalhado.tipo === 'passivo' ? '#3b82f6' : '#8b5cf6',
                          color: '#ffffff',
                          fontSize: '11px',
                        }}
                      >
                        {poderDetalhado.tipo === 'passivo' ? '🔹 Passivo' : '⚡ Manual'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>
                      {poderDetalhado.descricao}
                    </p>
                  </div>

                  {poderDetalhado.efeitos.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2" style={{ color: '#cbd5e1' }}>
                        ✨ Efeitos:
                      </h5>
                      <ul className="space-y-1">
                        {poderDetalhado.efeitos.map((efeito, idx) => (
                          <li
                            key={idx}
                            className="text-sm"
                            style={{ color: '#94a3b8', paddingLeft: '16px', position: 'relative' }}
                          >
                            <span style={{ position: 'absolute', left: 0 }}>- </span>
                            {efeito}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {poderDetalhado.prerequisitos && (
                    <div>
                      <h5 className="text-sm font-semibold mb-2" style={{ color: '#fca5a5' }}>
                        ⚠️ Pré-requisitos:
                      </h5>
                      <div className="space-y-1 text-sm" style={{ color: '#94a3b8' }}>
                        {poderDetalhado.prerequisitos.nivel && <div>-  Nível {poderDetalhado.prerequisitos.nivel}</div>}
                        {poderDetalhado.prerequisitos.atributos?.map((req, idx) => (
                          <div key={idx}>
                            -  {req.atributo.charAt(0).toUpperCase() + req.atributo.slice(1)} {req.valor}
                          </div>
                        ))}
                        {poderDetalhado.prerequisitos.pericias?.map((req, idx) => (
                          <div key={idx}>
                            -  {req.nivel ? `${req.nivel} em ` : 'Treinado em '}
                            {req.pericia}
                          </div>
                        ))}
                        {poderDetalhado.prerequisitos.outros?.map((req, idx) => (
                          <div key={idx}>-  {req}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {poderDetalhado.tags.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {poderDetalhado.tags.map((tag) => (
                          <Badge
                            key={tag}
                            style={{
                              backgroundColor: '#1e293b',
                              color: '#94a3b8',
                              fontSize: '10px',
                              padding: '4px 8px',
                            }}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: '#94a3b8' }}>
                  <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Clique em um poder para ver os detalhes</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
