
  1. Infraestrutura de Dados (Persistência de Métricas)
  Atualmente, o sistema gera o PDF, mas não registra o tempo de processamento.
   - Ação: Criar uma migration para adicionar a coluna tempo_geracao_ms (BigInt/Int8) na tabela contratos.
   - Ação: Atualizar o modelo Contrato em src/models/solicitacoes.rs e o schema.rs.

  2. Instrumentação de Latência (Tempo de Resposta)
  O documento exige a medição do tempo de processamento para comparação com o processo manual (10 min).
   - Ação: No controller de solicitações (src/controllers/solicitacoes.rs), envolver a lógica de
     gerar_e_salvar_contrato_pdf com tokio::time::Instant.
   - Ação: Calcular a duração e salvar o valor em milissegundos no banco de dados ao inserir o registro do contrato.

  3. Monitoramento de Vazão (Capacidade/Throughput)
  O documento afirma que os dados de vazão foram coletados "automaticamente através de ferramentas de monitoramento".
   - Ação: Implementar um Middleware no src/main.rs (utilizando tower-http ou uma camada customizada) para registrar:
       - Contagem de requisições por segundo/minuto.
       - Tempo de resposta médio global.
   - Ação: Configurar o tracing para incluir metadados de performance em cada rota crítica.

  4. Módulo de Relatórios (Tomada de Decisão)
  O sistema precisa de uma forma de expor essas métricas para o "gestor".
   - Ação: Criar um novo endpoint GET /relatorios/performance que retorne:
       - Tempo médio de geração de PDF.
       - Comparativo de eficiência (Tempo Manual vs. Tempo API).
       - Total de contratos gerados e taxa de sucesso.

  5. Automação e Disponibilidade
  Garantir que o fluxo "em tempo real" reflita a disponibilidade das máquinas.
   - Ação: Ao aprovar uma solicitação e gerar o contrato, atualizar o status da máquina para ativo = false (ou criar um
     enum de status) para refletir a indisponibilidade imediata mencionada no DSR.

  6. Ferramentas de Teste de Carga
  Para validar a "Capacidade (Vazão)" mencionada:
   - Ação: Adicionar um script de teste de carga (ex: tests/stress_test.sh usando wrk ou hey) para simular os acessos
     simultâneos descritos na metodologia.
