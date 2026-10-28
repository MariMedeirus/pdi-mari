import type { PlannerState, SkillCheck, SkillPillar } from '../types'

function checks(
  pillarId: string,
  items: Array<[string, string]>,
): SkillCheck[] {
  return items.map(([label, detail], index) => ({
    id: `${pillarId}-${String(index + 1).padStart(2, '0')}`,
    label,
    detail,
    done: false,
  }))
}

function pillar(
  id: string,
  name: string,
  description: string,
  category: SkillPillar['category'],
  color: string,
  items: Array<[string, string]>,
): SkillPillar {
  return {
    id,
    name,
    description,
    category,
    color,
    checks: checks(id, items),
  }
}

const pillars: SkillPillar[] = [
  pillar(
    'tec-fundamentos',
    'Fundamentos de backend',
    'A base para atuar no dia a dia: HTTP, APIs, camadas e o ciclo de uma requisição.',
    'tecnica',
    '#c4b5fd',
    [
      [
        'Explico o ciclo request-response HTTP',
        'Consigo narrar o caminho de uma requisição do client até a resposta, sem consultar material.',
      ],
      [
        'Distingo GET, POST, PUT, PATCH e DELETE',
        'Escolho o verbo certo e explico o porquê em um code review.',
      ],
      [
        'Interpreto e escolho status codes',
        'Uso 2xx, 4xx e 5xx de forma consciente (200 vs 201, 400 vs 422, 401 vs 403).',
      ],
      [
        'Leio headers comuns com segurança',
        'Content-Type, Authorization, Cache-Control, Accept e Correlation-Id não são mistério.',
      ],
      [
        'Sei a diferença entre autenticação e autorização',
        'Quem você é vs o que você pode fazer — e onde isso entra no código.',
      ],
      [
        'Entendo JWT em alto nível',
        'Header, payload, assinatura, expiração e por que o token não deve ir para o log.',
      ],
      [
        'Compreendo cookies, sessão e CSRF',
        'Sei quando a sessão vive no servidor e por que CSRF aparece em apps com cookie.',
      ],
      [
        'Desenho um CRUD completo de um recurso',
        'Listar, criar, obter, atualizar e remover com validação e erros claros.',
      ],
      [
        'Explico idempotência',
        'Sei por que PUT/DELETE e retries do client importam em APIs reais.',
      ],
      [
        'Devolvo erros úteis sem vazar stack',
        'Mensagem para o client, detalhe no log interno. Produção não expõe stack trace.',
      ],
      [
        'Valido input no backend',
        'Nunca confio só no front: tipos, ranges, campos obrigatórios e formatos.',
      ],
      [
        'Implemento paginação, filtro e ordenação',
        'Listagens não devolvem a tabela inteira. Sei offset vs cursor em alto nível.',
      ],
      [
        'Uso variáveis de ambiente com critério',
        'Config por ambiente, secrets fora do código, defaults seguros.',
      ],
      [
        'Distingo ORM e SQL puro',
        'Sei o que o ORM abstrai, quando ele atrapalha e como olhar a query gerada.',
      ],
      [
        'Leio um stack trace até a linha útil',
        'Sigo a causa, não só a mensagem final. Consigo reproduzir o erro.',
      ],
      [
        'Git no ritmo do time',
        'Branch, commits semânticos, rebase/merge que o time usa, PR pequena e revisável.',
      ],
      [
        'Secrets nunca entram no Git',
        '.gitignore, .env de exemplo, e o reflexo de revisar o diff antes do push.',
      ],
      [
        'Explico as camadas da aplicação',
        'Controller/handler, serviço, repositório — e o que NÃO deve vazar de uma para a outra.',
      ],
      [
        'Entendo middleware/filter/interceptor',
        'Auth, logs, tratamento de erro e correlation id como pipeline, não como copy-paste.',
      ],
      [
        'Documento o básico de uma API',
        'README, OpenAPI ou exemplo de request/response para a próxima pessoa (ou eu daqui a 2 semanas).',
      ],
    ],
  ),
  pillar(
    'tec-observabilidade',
    'Observabilidade',
    'Ver o sistema respirar: logs, métricas, traces, alertas e investigação de incidentes.',
    'tecnica',
    '#818cf8',
    [
      [
        'Explico os 3 pilares da observabilidade',
        'Logs, métricas e traces — o que cada um responde melhor.',
      ],
      [
        'Escrevo logs estruturados',
        'JSON (ou equivalente) com campos estáveis: event, userId, requestId, duration.',
      ],
      [
        'Escolho o nível certo de log',
        'debug, info, warn, error — sem transformar info em ruído nem esconder falha em warn.',
      ],
      [
        'Não loguo dado sensível',
        'Senha, token, PII e payload completo de cartão/documento ficam fora. Sempre.',
      ],
      [
        'Uso correlation / request ID',
        'Consigo seguir uma requisição entre camadas e, se existir, entre serviços.',
      ],
      [
        'Distingo counter, gauge e histogram',
        'Sei quando contar, quando medir um valor atual e quando olhar distribuição.',
      ],
      [
        'Leio p50, p95 e p99 de latência',
        'Entendo por que a média mente e o que um p99 alto denuncia.',
      ],
      [
        'Conheço os modelos RED e USE',
        'Rate, Errors, Duration / Utilization, Saturation, Errors — um mapa mental para investigar.',
      ],
      [
        'Navego um dashboard de serviço',
        'Grafana, CloudWatch, Datadog ou o que o time usa: achar latência, erro e saturacão.',
      ],
      [
        'Distingo liveness e readiness',
        'O processo está vivo vs está pronto para receber tráfego. Healthcheck com intenção.',
      ],
      [
        'Reconheço alerta acionável',
        'Alerta bom diz o que quebrou, o impacto e o que fazer. Ruído treina a gente a ignorar.',
      ],
      [
        'Investigo começando pelos sinais',
        'Já depurei um bug/incidente olhando logs/métricas antes de sair mudando código no escuro.',
      ],
      [
        'Entendo tracing e span',
        'Uma requisição como linha do tempo: onde ela mais demora e onde falha.',
      ],
      [
        'Instrumento um endpoint crítico',
        'Tempo, erros e (se fizer sentido) um log de negócio no caminho feliz e no de erro.',
      ],
      [
        'Explico SLI, SLO e SLA',
        'O que medimos, o combinado interno e o combinado com quem usa o serviço.',
      ],
      [
        'Observo filas e jobs',
        'Lag, retries, DLQ e idade da mensagem — não só “o consumer está up”.',
      ],
      [
        'Sei por que existe sampling de traces',
        'Custo e volume: nem todo request precisa de trace completo em produção.',
      ],
      [
        'Olho CPU, memória e GC',
        'Sei onde ver no ambiente do time e o que um pico pode significar.',
      ],
      [
        'Tenho um mini runbook do que eu mexo',
        'Onde estão logs, dashboard, health e o primeiro passo quando “está lento”.',
      ],
      [
        'Proponho observação junto com a feature',
        'Toda entrega que pode quebrar ganha log, métrica ou alerta — não só o caminho feliz.',
      ],
    ],
  ),
  pillar(
    'tec-custos',
    'Custos e eficiência',
    'Escrever código que funciona e que não infla a fatura: queries, recursos e senso de escala.',
    'tecnica',
    '#e879f9',
    [
      [
        'Assumo que request, query e storage custam',
        'Nada é “de graça” na cloud. Esse reflexo já muda o desenho da solução.',
      ],
      [
        'Leio um billing em alto nível',
        'Identifico as linhas grandes: compute, banco, logs, transferência, storage.',
      ],
      [
        'Caço recurso idle',
        'Instância, IP, volume, ambiente de teste ligado sem uso — pergunto se precisa.',
      ],
      [
        'Entendo right-sizing',
        'Superdimensionar “por medo” também é custo. Começar pequeno e medir.',
      ],
      [
        'Respeito o volume de logs',
        'Log demais em hot path encarece ingestão e atrapalha busca. Logue o que importa.',
      ],
      [
        'Evito SELECT * e full scan',
        'Busco só o necessário, com filtro e índice. Listagem sem limite é bandeira vermelha.',
      ],
      [
        'Enxergo N+1 e loop de I/O',
        'Query dentro de for, HTTP dentro de for — custo de latência e de conta.',
      ],
      [
        'Uso cache com critério',
        'Dado lido muito e alterado pouco. Sei invalidar ou aceitar stale com consciência.',
      ],
      [
        'Questiono overprovisioning',
        'Ambiente de dev não precisa espelhar prod em tamanho. Staging razoável basta.',
      ],
      [
        'Entendo retenção de logs e arquivos',
        'Guardar tudo para sempre é caro. Política de retenção é feature, não detalhe.',
      ],
      [
        'Evito transferência desnecessária',
        'Payloads enormes, chatiness e cópia entre regiões aparecem na fatura e na latência.',
      ],
      [
        'Retries com backoff',
        'Retry sem limite vira storm: derruba o serviço e multiplica custo.',
      ],
      [
        'Reviso crons e jobs',
        'Job que roda a cada minuto “porque sim” merece uma pergunta.',
      ],
      [
        'Estimo ordem de grandeza',
        'Barato, médio ou caro — consigo argumentar antes de implementar o caminho pesado.',
      ],
      [
        'Pagino e limito listas',
        'Não carrego milhares de registros para a memória da API “só dessa vez”.',
      ],
      [
        'Penso no lifecycle de dados',
        'Arquivos, eventos e linhas de auditoria envelhecem. Quem apaga? Quando?',
      ],
      [
        'Pergunto se um serviço novo é necessário',
        'Mais peça = mais custo, alerta e on-call. Às vezes um módulo resolve.',
      ],
      [
        'Documento decisões que afetam custo',
        'Por que cache, por que fila, por que instância maior — para o próximo review.',
      ],
      [
        'Olho dependências pesadas',
        'Lib enorme para um detalhe, imagem Docker inchada, build que baixa o mundo.',
      ],
      [
        'Levo custo para a conversa da feature',
        'Não como bloqueio, como tradeoff visível: “isso funciona, e custa X em escala”.',
      ],
    ],
  ),
  pillar(
    'tec-banco',
    'Banco de dados',
    'Modelar, consultar e evoluir dados sem medo: SQL, índices, transações e migrations.',
    'tecnica',
    '#67e8f9',
    [
      [
        'Modelo entidades com PK e FK',
        'Consigo desenhar o mínimo de tabelas para um caso real do time.',
      ],
      [
        'Normalizo com consciência',
        'Sei o ganho de normalizar e quando desnormalizar para leitura.',
      ],
      [
        'Escolho tipos de dados adequados',
        'varchar vs text, int vs bigint, timestamptz, boolean, json só quando faz sentido.',
      ],
      [
        'Explico o que é um índice',
        'Acelera leitura, pesa escrita. Não é mágica e não se cria em tudo.',
      ],
      [
        'Leio um plano de execução em alto nível',
        'EXPLAIN: seq scan vs index scan. Sei pedir ajuda com o plano na mão.',
      ],
      [
        'Explico ACID em palavras simples',
        'O que uma transação garante e por que isso importa em pagamento, estoque, etc.',
      ],
      [
        'Sei que isolation levels existem',
        'Dirty read, repeatable read — o suficiente para não tratar sintoma no código errado.',
      ],
      [
        'Identifico e corrijo N+1',
        'Join, IN, dataloader ou o padrão do stack. Meço antes/depois.',
      ],
      [
        'Uso migrations versionadas',
        'Up/down (ou equivalente), revisão de migration e cuidado com lock em tabela grande.',
      ],
      [
        'Aplico constraints',
        'NOT NULL, UNIQUE, CHECK, FK — o banco como última linha de defesa.',
      ],
      [
        'Modelo 1-N e N-N',
        'Tabela de junção, cardinalidade e o que isso muda na API.',
      ],
      [
        'Distingo soft delete e hard delete',
        'Tradeoffs de auditoria, unique constraints e “dado fantasma”.',
      ],
      [
        'Sei que backup existe e onde mora',
        'Não preciso executar o restore sozinha, mas sei que o time tem um plano.',
      ],
      [
        'Entendo connection pool',
        'Por que “too many connections” acontece e o que NÃO fazer (abrir conexão no loop).',
      ],
      [
        'Reconheço deadlock',
        'O que é, como aparece no log e que ordem de lock importa.',
      ],
      [
        'SQL vs NoSQL com tradeoff',
        'Consistência, query, schema. Não escolho moda, escolho restrição do problema.',
      ],
      [
        'Consistência eventual em alto nível',
        'O dado pode atrasar entre sistemas. A UI e a regra de negócio precisam saber disso.',
      ],
      [
        'Sobe o banco local com seed',
        'Consigo um ambiente reproduzível para desenvolver e testar.',
      ],
      [
        'Evito lógica pesada no banco sem necessidade',
        'Trigger/procedure quando o time usa — senão, mantenho a regra no serviço.',
      ],
      [
        'Escrevo SQL revisável',
        'Legível, indentado, com filtro seletivo. PR de query também é PR de produto.',
      ],
    ],
  ),
  pillar(
    'tec-qualidade',
    'Qualidade, testes e código limpo',
    'Entregar com confiança: testes, review, nomes claros e um definition of done de verdade.',
    'tecnica',
    '#86efac',
    [
      [
        'Distingo unitário, integração e e2e',
        'Sei o custo e o benefício de cada camada — e o que o time espera em cada PR.',
      ],
      [
        'Escrevi um teste que falha por um motivo real',
        'Não é teste verde vazio. Ele protege uma regra de negócio.',
      ],
      [
        'Uso Arrange-Act-Assert',
        'Teste legível: preparo, executo, verifico. Nome descreve o comportamento.',
      ],
      [
        'Uso mock com parcimônia',
        'Mock de I/O, não de toda a lógica. Mock demais testa o mock.',
      ],
      [
        'Testo o caminho crítico, não a vaidade da cobertura',
        'Cobertura alta com asserts fracos não serve. Priorizo o que quebra produção.',
      ],
      [
        'Faço code review construtivo',
        'Comento o problema, sugiro caminho, elogio o que está bom. Sem tom de auditora.',
      ],
      [
        'Recebo review sem defender o ego',
        'Pergunto, discuto tradeoff, aceito melhoria. PR é trabalho em equipe.',
      ],
      [
        'Nomeio com intenção',
        'Variável, função e arquivo dizem o que são. Evito `temp`, `data2`, `handle()`.',
      ],
      [
        'Mantenho funções pequenas',
        'Uma responsabilidade visível. Se preciso de comentário longo, talvez precise de extração.',
      ],
      [
        'DRY com bom senso',
        'Não abstraio cedo demais. Duplicar 2 vezes pode ser melhor que uma abstração errada.',
      ],
      [
        'Linter e formatter no fluxo',
        'Não discuto estilo em PR. A ferramenta padroniza, eu foço no comportamento.',
      ],
      [
        'Trato null/undefined/ausência',
        'Optional, Result, early return — o caminho vazio é código, não surpresa.',
      ],
      [
        'Conheço feature flag em alto nível',
        'Separar deploy de release quando o risco pede. Sei o custo de flag eterna.',
      ],
      [
        'Escrevo PR com contexto',
        'Por que, o que muda, como testar, riscos. O diff sozinho não conta a história.',
      ],
      [
        'Testo o caminho de erro',
        'Timeout, 404, validação, retry. Produção vive no erro, não no happy path.',
      ],
      [
        'Isolo fixtures de teste',
        'Testes independentes, ordem irrelevante, dado previsível.',
      ],
      [
        'Reconheço teste flaky',
        'Tempo, ordem, dependência de relógio/rede. Flaky destrói confiança — trato como bug.',
      ],
      [
        'Defendo qualidade com prazo curto',
        'Negocio escopo, não silêncio. “Sem teste nessa parte” fica explícito, não escondido.',
      ],
      [
        'Refatoro com rede de segurança',
        'Primeiro teste ou comportamento observado, depois a limpeza.',
      ],
      [
        'Meu done inclui observação',
        'Pronto não é “mergeu”. Pronto é testado, observável e alinhado com o critério do ticket.',
      ],
    ],
  ),
  pillar(
    'tec-seguranca',
    'Segurança',
    'O mínimo inegociável para backend júnior: input, secrets, auth e os erros clássicos.',
    'tecnica',
    '#f9a8d4',
    [
      [
        'Li um resumo do OWASP Top 10',
        'Sei os nomes e um exemplo de cada. Não preciso ser pentester para não abrir buraco óbvio.',
      ],
      [
        'Previno SQL injection',
        'Prepared statement / query param. Nunca concatenar input na query.',
      ],
      [
        'Entendo XSS mesmo em API',
        'Se o backend devolve HTML ou o front interpola sem escape, o risco existe.',
      ],
      [
        'Sei onde CSRF aparece',
        'Cookie de sessão + ação de mudança. Token, SameSite e o modelo do time.',
      ],
      [
        'Secrets fora do repositório',
        'Vault, secret manager ou env do orquestrador. Rotação existe como ideia, não só como slide.',
      ],
      [
        'Hash de senha do jeito certo',
        'bcrypt/argon2 (ou o padrão do time). Nunca MD5/SHA1 “com salt caseiro”.',
      ],
      [
        'HTTPS/TLS em alto nível',
        'Dado em trânsito. Sem desligar verificação “só no ambiente X” por hábito.',
      ],
      [
        'Valido e rejeito input perigoso',
        'Tamanho, tipo, enum, arquivo. O backend é a fronteira.',
      ],
      [
        'Princípio do menor privilégio',
        'Usuário do banco, role da API, permissão de IAM — só o necessário.',
      ],
      [
        'CORS não é `*` em produção',
        'Sei o que CORS protege (e o que não protege). Origem explícita.',
      ],
      [
        'Rate limiting contra abuso',
        'Login, forgot-password e webhooks públicos não ficam abertos sem teto.',
      ],
      [
        'Autentico a API de verdade',
        'Token, API key ou mTLS — o que o contexto pede. Rota “interna” também precisa de critério.',
      ],
      [
        'Expiração e revogação de token',
        'Access curto, refresh controlado. Logout e user desativado têm efeito.',
      ],
      [
        'Não expoho stack nem path interno',
        'Erro genérico para o client, detalhe no log. Banner e versão também são info.',
      ],
      [
        'Audito dependências',
        'npm/yarn audit, Dependabot, OS packages. Lib abandonada é risco.',
      ],
      [
        'IDOR no radar',
        'Não basta o ID no payload. Confiro se aquele recurso pertence a quem chama.',
      ],
      [
        'Upload com desconfiança',
        'Tipo, tamanho, nome, onde salva. Arquivo do usuário não é executável do servidor.',
      ],
      [
        'Headers de segurança básicos',
        'Sei que existem (HSTS, nosniff, etc.) e onde o time configura.',
      ],
      [
        'Logs sem segredo',
        'Authorization, cookie e body de login não pingam no aggregator.',
      ],
      [
        'Olho de segurança no review',
        'Toda PR minha passa por: auth, input, dado sensível, permissão. É hábito, não checklist extra.',
      ],
    ],
  ),
  pillar(
    'tec-infra',
    'Infra, Docker e deploy',
    'Do README ao ar: container, pipeline, ambientes e o mínimo para não temer o deploy.',
    'tecnica',
    '#94a3b8',
    [
      [
        'Explico o que um container resolve',
        'Mesmo runtime, isolamento leve, “funciona na minha máquina” com menos drama.',
      ],
      [
        'Leio um Dockerfile simples',
        'FROM, COPY, RUN, EXPOSE, CMD. Sei a diferença de imagem e container.',
      ],
      [
        'Subo o projeto com Docker Compose',
        'App + banco (+ fila, se houver) local, seguindo o README do time.',
      ],
      [
        'Entendo registry de imagens',
        'Build, tag, push, pull. Versão da imagem não é `latest` no susto em produção.',
      ],
      [
        'Configuro o app por ambiente',
        'Env vars no deploy. Dev, staging e prod não compartilham secret nem URL de banco.',
      ],
      [
        'Sei o que o CI roda',
        'Lint, teste, build. Se o pipeline vermelho, não é “depois eu vejo”.',
      ],
      [
        'Entendo o caminho do CD',
        'Como uma commit chega em staging/prod no time. Quem aprova, o que promove.',
      ],
      [
        'Respeito os ambientes',
        'Não testo experimentação em prod. Dado de prod não volta para o notebook.',
      ],
      [
        'Sei que rollback precisa existir',
        'Antes de um deploy arriscado, pergunto: como voltamos se der errado?',
      ],
      [
        'Healthcheck no deploy',
        'Orquestrador só manda tráfego se readiness passar. Deploy não é “processo up”.',
      ],
      [
        'Achei os logs do ambiente',
        'Sei a ferramenta (CloudWatch, Loki, Kibana…) e o filtro mínimo do serviço.',
      ],
      [
        'Acesso com boa prática',
        'SSH/bastion/SSO do time. Sem chave espalhada, sem prod no dia a dia.',
      ],
      [
        'DNS até o servidor, em alto nível',
        'Nome → load balancer → instâncias. Ajuda a debugar “não resolve” vs “500”.',
      ],
      [
        'Explico o papel do load balancer',
        'Distribui tráfego, healthcheck, TLS de borda. Não é mágica.',
      ],
      [
        'Escala vertical vs horizontal',
        'Máquina maior vs mais réplicas. Stateless ajuda a horizontal.',
      ],
      [
        'Secrets no orquestrador, não no .env commitado',
        'Sei onde o time coloca e como a app lê.',
      ],
      [
        'Respeito freeze e janela de deploy',
        'Combinados do time existem. Júnior confiável não ignora calendário.',
      ],
      [
        'Artefato versionado',
        'A build que foi para prod tem tag/commit. Consigo dizer o que está no ar.',
      ],
      [
        'Runbook mínimo do serviço',
        'Como subir local, como ver log, como health, quem chamar. Escrito, não só na cabeça.',
      ],
      [
        'Sigo o README até o fim',
        'Consigo deixar o projeto rodando local sem “só funciona na máquina da pessoa X”.',
      ],
    ],
  ),
  pillar(
    'tec-apis',
    'APIs e arquitetura',
    'Contratos, falhas parciais, filas e o desenho de sistemas que o júnior precisa conversar.',
    'tecnica',
    '#d8b4fe',
    [
      [
        'Modelo APIs em recursos',
        'URLs estáveis, verbos corretos, resposta previsível. REST com critério, não dogma.',
      ],
      [
        'Desenho para retry do client',
        'Idempotência, timeout e mensagem clara. A rede falha — a API aguenta.',
      ],
      [
        'Versiono com cuidado',
        'Sei o que é breaking change. Não quebro o consumidor “porque era mais fácil”.',
      ],
      [
        'Respeito o contrato',
        'Campo obrigatório, nulo, tipo. OpenAPI/Swagger ou testes de contrato quando existirem.',
      ],
      [
        'Paginação cursor vs offset',
        'Offset é simples e quebra em dado quente. Cursor escala melhor — sei o tradeoff.',
      ],
      [
        'Sei quando síncrono não basta',
        'Fila/evento para trabalho longo, pico ou integração frágil.',
      ],
      [
        'Distingo evento e request-response',
        'Acoplamento no tempo. Quem espera resposta vs quem reage depois.',
      ],
      [
        'Idempotency key',
        'Pagamento, criação duplicada, webhook reentregue — o mesmo pedido não gera efeito 2x.',
      ],
      [
        'Timeout e circuit breaker em alto nível',
        'Não esperar para sempre. Não martelar um dependente que já caiu.',
      ],
      [
        'Consistência entre serviços',
        'Não há transação mágica distribuída no dia a dia. Compensação, outbox, “eventual”.',
      ],
      [
        'Módulo / bounded context',
        'O que pertence a este domínio. Evito “god service” e import circular.',
      ],
      [
        'Acoplamento e coesão',
        'Consigo apontar um acoplamento ruim em review e sugerir um corte mais limpo.',
      ],
      [
        'Cache-Control / ETag em alto nível',
        'Quando a API pode ser cacheada e o risco de dado velho.',
      ],
      [
        'Webhooks com retry',
        'Assinatura, idempotência, 2xx rápido, processamento async se precisar.',
      ],
      [
        'OpenAPI como ferramenta',
        'Gero ou atualizo o contrato. Front e QA não precisam adivinhar o payload.',
      ],
      [
        'BFF em alto nível',
        'Quando agregar no backend para um client específico evita chatiness.',
      ],
      [
        'Monólito vs microserviços',
        'Tradeoff honesto: simplicidade operacional vs isolamento. Não é status.',
      ],
      [
        'Desenho para falha parcial',
        'Dependência caiu: fail fast, fallback, degradação. O usuário vê algo previsível.',
      ],
      [
        'Registro leve de decisão',
        'Um ADR curto ou nota no ticket: o que escolhemos e o que recusamos.',
      ],
      [
        'Explico a arquitetura do sistema em que trabalho',
        'Caixinhas, fluxos, bancos, filas. Se não sei, desenho com alguém até saber.',
      ],
    ],
  ),
  pillar(
    'beh-comunicacao',
    'Comunicação',
    'Tornar o trabalho visível e compreensível: PRs, alinhamento, dúvida cedo e linguagem certa.',
    'comportamental',
    '#f0abfc',
    [
      [
        'Explico um problema técnico em linguagem simples',
        'Consigo contar para alguém de produto o que quebrou e o impacto, sem jargão de mais.',
      ],
      [
        'Escrevo PRs com contexto',
        'Motivo, abordagem, como testar, riscos. Revisor não precisa ser vidente.',
      ],
      [
        'Peço ajuda com o que já tentei',
        'Sintoma, hipótese, o que li, o que não funcionou. Respeito o tempo de quem ajuda.',
      ],
      [
        'Aviso cedo se o prazo aperta',
        'Surpresa no fim é mais cara do que um “estou travada” na terça.',
      ],
      [
        'Faço perguntas específicas',
        'Troco “não entendi nada” por um recorte: “o fluxo X no caso Y faz Z?”',
      ],
      [
        'Documento o suficiente',
        'A próxima pessoa (eu no futuro) encontra o caminho. Nem novelo, nem vazio.',
      ],
      [
        'Adapto o nível ao público',
        'Tech vs negócio vs outra área. Mesma verdade, outra profundidade.',
      ],
      [
        'Saio de reunião com próximos passos',
        'Quem faz o quê até quando. Se ninguém registrou, eu registro.',
      ],
      [
        'Dou crédito ao trabalho dos outros',
        'Ideia boa tem nome. Time forte não apaga rastro.',
      ],
      [
        'Escuto até o fim',
        'Antes de responder, de defender ou de corrigir. Entendi o que a pessoa disse?',
      ],
      [
        'Confirmo o acordo em voz alta',
        '“Então o combinado é X, fora Y”. Ambiguidades morrem cedo.',
      ],
      [
        'Comunico bem no assíncrono',
        'Slack/Teams com contexto, link e pergunta clara. Não um “oi” solto.',
      ],
      [
        'Não escondo dúvida por vergonha',
        'Estágio existe para aprender. Dúvida silenciosa vira bug barulhento.',
      ],
      [
        'Apresento solução com prós e contras',
        'Não só “deu certo na minha máquina”. Duas opções e a recomendação.',
      ],
      [
        'Escrevo feedback respeitoso',
        'Comportamento e impacto, não caráter. Serve para review e para 1:1.',
      ],
      [
        'Atualizo o time sem ser cobrada',
        'Standup honesto: feito, bloqueio, próximo. Status não é teatro.',
      ],
      [
        'Evito jargão desnecessário',
        'Se a palavra não ajuda a decidir, ela só impressiona — e eu não preciso disso.',
      ],
      [
        'Alinho expectativa antes de começar',
        'Critério de pronto, dúvida de negócio, acesso, ambiente. Menos retrabalho.',
      ],
      [
        'Registro decisões no ticket',
        'O Jira/Linear/GitHub Issue conta a história. Chat some, ticket fica.',
      ],
      [
        'Consigo dizer “não sei, vou descobrir”',
        'Credibilidade de júnior começa aqui. Chute disfarçado de certeza não.',
      ],
    ],
  ),
  pillar(
    'beh-ownership',
    'Ownership e proatividade',
    'Puxar o fio até o fim: impacto, follow-through e a postura de quem já pensa como júnior.',
    'comportamental',
    '#c4b5fd',
    [
      [
        'Pego o ticket até o “done” de verdade',
        'Código, teste, revisão, deploy, conferência. Não abandono no “abri a PR”.',
      ],
      [
        'Antes de perguntar, tento com método',
        'Repro, log, README, busca no código. Depois pergunto melhor.',
      ],
      [
        'Volto com resposta, não só com problema',
        'Mesmo que a resposta seja “preciso de acesso X”. Já andei um trecho.',
      ],
      [
        'Olho o impacto, não só a tarefa',
        'Quem usa, o que quebra, o que precisa ser comunicado.',
      ],
      [
        'Fecho o ciclo de um incidente pequeno',
        'Corrigir + entender causa + deixar um log/alerta/teste para não voltar.',
      ],
      [
        'Não deixo bola parada',
        'Comentário na PR, dúvida no ticket, permissão pendente — eu cobro com educação.',
      ],
      [
        'Assumo o erro cedo',
        '“Fui eu, assim que aconteceu, assim que estou corrigindo.” Confiança se constrói assim.',
      ],
      [
        'Melhoro o que eu toquei',
        'Uma clareza, um teste, um log. Boy scout discreto, sem reescrever o mundo.',
      ],
      [
        'Antecipo risco na issue',
        'Migração, dado, permissão, dependência. Escrevo o risco antes de ele virar surpresa.',
      ],
      [
        'Peço contexto de produto',
        'Não implemento no piloto automático. Entendi o porquê da feature?',
      ],
      [
        'Ofereço ajuda em área que já vi',
        'Onboarding de alguém, pair no bug que eu já tomei. Time, não feudo.',
      ],
      [
        'Mantenho o que eu entreguei',
        'Se quebrou depois, eu apareço. Ownership não expira no merge.',
      ],
      [
        'Digo não com alternativa',
        'Escopo irreal: proponho corte, fase 1, ou data honesta. Não desapareço.',
      ],
      [
        'Procuro o gap da vaga júnior',
        'Olho o que o time espera de júnior e fecho o buraco com prática, não com desejo.',
      ],
      [
        'Levo temas deste plano para o 1:1',
        'Mentoria com pauta. Skills, bloqueios, próximo passo concreto.',
      ],
      [
        'Crio checklist pessoal do deploy',
        'O que eu verifico depois de subir. Ritual curto, menos “será que foi?”.',
      ],
      [
        'Estudo o domínio do produto',
        'Regras de negócio não são detalhe. Júnior de backend que entende o domínio cresce mais rápido.',
      ],
      [
        'Transformo retrabalho em aprendizado',
        'Se a PR voltou 3 vezes pelo mesmo motivo, isso vira um check novo aqui.',
      ],
      [
        'Cuido da confiabilidade do que é “pequeno”',
        'Script, job, migração one-off. Coisa pequena derruba prod com a mesma facilidade.',
      ],
      [
        'Aja como a dona daquela fatia',
        'Mesmo sendo estágio: aquele endpoint, aquele fluxo, aquele dashboard. Eu acompanho.',
      ],
    ],
  ),
  pillar(
    'beh-colaboracao',
    'Colaboração',
    'Pair, review, respeito e o ofício de construir software em time — não sozinha no canto.',
    'comportamental',
    '#818cf8',
    [
      [
        'Entro em pair com curiosidade',
        'Não preciso dirigir o teclado o tempo todo. Aprendo o raciocínio da outra pessoa.',
      ],
      [
        'Faço review no prazo do time',
        'PR parada é custo. Mesmo um “LGTM com um comentário” já destrava.',
      ],
      [
        'Peço review de quem entende o contexto',
        'Não só de quem está online. O revisor certo evita retrabalho.',
      ],
      [
        'Aceito que o código é do time',
        'Minha solução favorita pode perder para a consistência do repositório. Tudo bem.',
      ],
      [
        'Compartilho o que aprendi no dia',
        'Uma linha no standup, uma nota, um link. Conhecimento não fica só comigo.',
      ],
      [
        'Respeito o foco dos outros',
        'Pergunta urgente vs que pode ser assíncrona. Slack não é sirene o dia inteiro.',
      ],
      [
        'Dou espaço em reunião',
        'Não interrompo. Se eu dominar o assunto, convido quem está mais quieto.',
      ],
      [
        'Alinho com QA / produto / ops',
        'Backend não vive isolado. Quem testa e quem opera entra cedo.',
      ],
      [
        'Documentos e tickets são cortesia',
        'Contexto escrito é um favor para o time, inclusive para quem está off hoje.',
      ],
      [
        'Resolvo divergência com critério',
        'Dado, restrição, padrão do repo — não volume de voz nem teimosia.',
      ],
      [
        'Celebro entrega coletiva',
        'O merge grande teve muita gente. Eu nomeio isso.',
      ],
      [
        'Peço e ofereço pair em bug difícil',
        'Duas cabeças encurtam o labirinto. Não é fraqueza.',
      ],
      [
        'Onboarding: deixo o caminho mais fácil',
        'README, acesso, “as 3 armadilhas”. Quem chega depois sofre menos.',
      ],
      [
        'Não falo mal de quem não está na sala',
        'Crítica de sistema e de processo, sim. De pessoa ausente, não.',
      ],
      [
        'Respeito fuso, carga e limite',
        'Estágio também ensina sustentabilidade. Time cansado entrega pior.',
      ],
      [
        'Sigo as convenções do repositório',
        'Mesmo que eu faria diferente em casa. Consistência > gosto pessoal.',
      ],
      [
        'Aviso quando vou ficar off',
        'Férias, consulta, foco profundo. O time não precisa adivinhar.',
      ],
      [
        'Recebo ajuda sem se defender',
        'Mentoria não é ataque. Anoto, aplico, devolvo o que mudou.',
      ],
      [
        'Construo confiança pequena',
        'Entrego o que prometi, no tamanho combinado. Confiança é o verdadeiro seniority early.',
      ],
      [
        'Lembro que júnior cresce em público',
        'Mostrar o rascunho, pedir opinião, iterar. Esconder trabalho atrasa todo mundo.',
      ],
    ],
  ),
  pillar(
    'beh-aprendizado',
    'Aprendizado contínuo',
    'Método para crescer: tópicos do dia, prática deliberada e virar júnior com repertório, não com ansiedade.',
    'comportamental',
    '#e879f9',
    [
      [
        'Anoto o que não sei no mesmo dia',
        'A seção de tópicos deste site existe para isso. Palavra solta não vira estudo.',
      ],
      [
        'Estudo com um recorte pequeno',
        'Um conceito, um exemplo, uma aplicação no código do time. Não “ver 4 horas de vídeo”.',
      ],
      [
        'Ligo a teoria no sistema real',
        'Li sobre índice? Olho uma query nossa. Li sobre SLO? Abro o dashboard.',
      ],
      [
        'Reviso o que marquei neste plano',
        'Checks não são gamificação vazia. Se marquei, eu explicaria em voz alta.',
      ],
      [
        'Peço indicação de material para o time',
        'O que uma júnior daqui deveria ler? Mentora, tech lead, README interno.',
      ],
      [
        'Leio código alheio de propósito',
        'PRs e módulos maduros ensinam o estilo que o time valoriza.',
      ],
      [
        'Faço uma pergunta de “por que isso é assim”',
        'História do sistema. Arquitetura é acúmulo de decisões, não desenho perfeito.',
      ],
      [
        'Tenho um ritual curto de estudo',
        '30–45 min, frequência realista. Consistência vence maratona de domingo.',
      ],
      [
        'Escrevo o que aprendi com minhas palavras',
        'No tópico, no README, no Notion. Se eu não sei escrever, eu ainda não sei.',
      ],
      [
        'Repito em voz alta / rubber duck',
        'Explicar JWT, transação ou p99 para a parede. Buraco aparece na hora.',
      ],
      [
        'Aceito o platô',
        'Alguns dias só mantenho. Estágio é maratona. Culpa não ensina SQL.',
      ],
      [
        'Busco profundidade, não só ferramenta nova',
        'Mais um framework não me torna júnior. HTTP, dados, observação e clareza sim.',
      ],
      [
        'Peço feedback acionável',
        '“O que eu faria diferente nesta PR se eu fosse júnior plena no time?”',
      ],
      [
        'Transformo feedback em check',
        'Se ouvi “faltou teste de erro”, isso vira hábito rastreável aqui.',
      ],
      [
        'Acompanho o que o time considera júnior',
        'Job description interna, expectativas da liderança, exemplos de PRs de quem passou.',
      ],
      [
        'Estudo incidentes (os seguros de ler)',
        'Postmortem ensina mais que tutorial. O que falhou, o que faltou observar.',
      ],
      [
        'Limito o multitask de curso',
        'Um curso em andamento de verdade vale mais que cinco “em algum dia”.',
      ],
      [
        'Celebro micro vitórias',
        'O primeiro EXPLAIN, o primeiro alerta útil, o primeiro “eu achei sozinha”. Registra.',
      ],
      [
        'Ensino alguém um passo atrás de mim',
        'Explicar para outra estagiária/dev consolida. Se ainda não tem alguém, escrevo um guia.',
      ],
      [
        'Reviso este plano todo mês',
        'O que avançou, o que ficou teatro, o que a vaga júnior ainda exige. Ajuste consciente.',
      ],
    ],
  ),
  pillar(
    'beh-organizacao',
    'Organização, foco e ritmo',
    'Fazer o estágio caber na vida: prioridade, energia e um ritmo sustentável rumo à vaga júnior.',
    'comportamental',
    '#fda4af',
    [
      [
        'Começo o dia com 3 prioridades',
        'Não 17. O que, se sair, já foi um bom dia de estágio.',
      ],
      [
        'Quebro tarefa grande em fatias',
        'Investigar, implementar, testar, revisar. Fatia visível no board.',
      ],
      [
        'Uso o board do time de verdade',
        'Status atualizado. Ninguém precisa me perguntar “e aquele card?”.',
      ],
      [
        'Protejo blocos de foco',
        'Notificação muda o cérebro. Um bloco profundo > oito abas de “quase”.',
      ],
      [
        'Anoto WIP e contexto antes de parar',
        'A Mariana de amanhã agradece o recado de 4 linhas.',
      ],
      [
        'Estimo com faixa, não com ficção',
        '“Meio dia a um dia” é mais honesto que “2 horas” por educação.',
      ],
      [
        'Diferencio urgente e importante',
        'Incidente vs curso vs polish. Estágio também é escolha.',
      ],
      [
        'Fecho abas mentais',
        'Tópico capturado neste site, ticket atualizado, PR comentada. Cérebro não é backlog.',
      ],
      [
        'Respeito energia, não só relógio',
        'Tarefa difícil quando eu rendo. Admin quando eu não rendo. Sem culpa barata.',
      ],
      [
        'Evito heroísmo noturno como hábito',
        'Uma vez, ok. Todo dia, sinal. Júnior sustentável > júnior exausta.',
      ],
      [
        'Preparo a 1:1 com pauta',
        '3 bullets: avanço, bloqueio, pedido. Mentoria rende mais.',
      ],
      [
        'Reviso metas deste plano na sexta',
        'Quinze minutos. O que moveu, o que ficou parado, um ajuste.',
      ],
      [
        'Digo o WIP na standup com clareza',
        'Um card, um bloqueio, um próximo passo. Sem novela, sem sumiço.',
      ],
      [
        'Limito cursos em andamento',
        'Um principal. O resto fica em “futuro” sem culpa.',
      ],
      [
        'Guardo links úteis perto do trabalho',
        'Runbook, dashboard, RFC. Tempo de caça não é tempo de entrega.',
      ],
      [
        'Corto escopo com transparência',
        'Se o dia acabou, o que entra amanhã fica escrito — não na cabeça ansiosa.',
      ],
      [
        'Faço pausa de verdade',
        'Almoço sem laptop. Cérebro de backend precisa de idle para consolidar.',
      ],
      [
        'Separar estudo e trabalho no calendário',
        'Os dois importam. Se só um existe, o plano deste site vira enfeite.',
      ],
      [
        'Encerramento de dia em 5 minutos',
        'O que ficou aberto, o primeiro passo de amanhã, um check que eu conquistei.',
      ],
      [
        'Plano visível rumo à vaga júnior',
        'Eu sei o próximo passo concreto desta semana. Não só “quero ser júnior”.',
      ],
    ],
  ),
]

export const seedState: PlannerState = {
  courses: [
    {
      id: 'course-http',
      title: 'HTTP, REST e o ciclo de uma API',
      platform: 'Sugestão de estudo',
      status: 'em_andamento',
      notes:
        'Revisitar status codes, headers e idempotência ligando cada ideia a um endpoint do estágio.',
      url: '',
      deadline: '',
    },
    {
      id: 'course-sql',
      title: 'SQL para quem constrói backend',
      platform: 'Sugestão de estudo',
      status: 'em_andamento',
      notes: 'JOIN, índice, EXPLAIN e transação — com queries do projeto real.',
      url: '',
      deadline: '',
    },
    {
      id: 'course-git',
      title: 'Git colaborativo e PRs pequenas',
      platform: 'Prática no time',
      status: 'realizado',
      notes: 'Rotina de branch, commit e review. Ajustar conforme o fluxo real do time.',
      url: '',
      deadline: '',
    },
    {
      id: 'course-obs',
      title: 'Observabilidade aplicada (logs, métricas, traces)',
      platform: 'A definir',
      status: 'futuro',
      notes: 'Objetivo: instrumentar um fluxo do estágio e ler o próprio dashboard.',
      url: '',
      deadline: '',
    },
    {
      id: 'course-docker',
      title: 'Docker na prática para devs backend',
      platform: 'A definir',
      status: 'futuro',
      notes: 'Subir a stack local com confiança e entender a imagem que vai para o ambiente.',
      url: '',
      deadline: '',
    },
    {
      id: 'course-tests',
      title: 'Testes de API e o caminho de erro',
      platform: 'A definir',
      status: 'futuro',
      notes: 'Unitário no domínio + integração no endpoint crítico.',
      url: '',
      deadline: '',
    },
  ],
  pillars,
  goals: [
    {
      id: 'goal-junior',
      title: 'Conquistar uma vaga de desenvolvedora júnior (backend)',
      description:
        'Fechar o gap entre estágio e júnior: autonomia em tickets, observabilidade básica, PRs confiáveis e domínio do sistema em que trabalho.',
      horizon: 'longo',
      status: 'em_andamento',
      deadline: '',
    },
    {
      id: 'goal-request',
      title: 'Explicar o caminho de um request no sistema do estágio',
      description:
        'Do client ao banco e de volta, com logs no meio. Se eu desenho isso, eu já penso como júnior daquele produto.',
      horizon: 'curto',
      status: 'em_andamento',
      deadline: '',
    },
    {
      id: 'goal-obs',
      title: 'Entregar uma feature com observação de verdade',
      description:
        'Log estruturado, uma métrica ou trace, e um critério de “como eu sei que quebrou”.',
      horizon: 'medio',
      status: 'nao_iniciada',
      deadline: '',
    },
    {
      id: 'goal-sql',
      title: 'Ler e melhorar uma query real com EXPLAIN',
      description:
        'Pegar uma consulta do projeto, entender o plano, propor índice ou reescrita se fizer sentido.',
      horizon: 'curto',
      status: 'nao_iniciada',
      deadline: '',
    },
    {
      id: 'goal-mentoria',
      title: 'Usar 1:1 com pauta ligada a este plano',
      description:
        'Todo mês: 3 skills, 1 bloqueio, 1 pedido concreto de exposição (review, pair, on-call assistido).',
      horizon: 'medio',
      status: 'em_andamento',
      deadline: '',
    },
  ],
  topics: [
    {
      id: 'topic-slo',
      term: 'SLO',
      context: 'Apareceu numa conversa de confiabilidade / alerta.',
      status: 'pendente',
      notes: '',
      createdAt: new Date().toISOString(),
      researchedAt: '',
    },
    {
      id: 'topic-idempotencia',
      term: 'Idempotência',
      context: 'Retry de client e operação financeira/criação duplicada.',
      status: 'pendente',
      notes: '',
      createdAt: new Date().toISOString(),
      researchedAt: '',
    },
    {
      id: 'topic-circuit-breaker',
      term: 'Circuit breaker',
      context: 'Resiliência quando um serviço dependente cai.',
      status: 'pendente',
      notes: '',
      createdAt: new Date().toISOString(),
      researchedAt: '',
    },
  ],
  tasks: [
    {
      id: 'task-logs',
      title: 'Investigar 500 no endpoint de listagem',
      description:
        'Reproduzir o erro, seguir o request nos logs e deixar o caminho de falha mais claro para a próxima vez.',
      status: 'em_andamento',
      date: 'Hoje',
      deadline: '',
      skillIds: ['tec-observabilidade', 'tec-fundamentos'],
      notes: '',
    },
    {
      id: 'task-review',
      title: 'Review da PR do time',
      description:
        'Ler o diff com olhar de backend: contrato, erro, teste e se o log ajuda a debugar.',
      status: 'a_fazer',
      date: 'Esta semana',
      deadline: '',
      skillIds: ['tec-qualidade', 'beh-colaboracao'],
      notes: '',
    },
    {
      id: 'task-explain',
      title: 'Rodar EXPLAIN na query lenta do relatório',
      description:
        'Entender o plano, anotar o que pesa e propor índice ou recorte se fizer sentido.',
      status: 'feita',
      date: 'Ontem',
      deadline: '',
      skillIds: ['tec-banco', 'tec-custos'],
      notes: 'Aprendi a olhar seq scan vs index scan com o time.',
    },
  ],
  activities: [
    {
      id: 'act-explain',
      title: 'Otimização da query lenta do relatório',
      context: 'Estágio',
      period: 'Outubro 2026',
      description:
        'Peguei a consulta mais pesada do relatório, rodei EXPLAIN com o time, comparei seq scan e index scan e propus um índice que fazia sentido no uso real.',
      skillsNote: 'EXPLAIN, plano de execução, índice, leitura de query com o time.',
      skillIds: ['tec-banco', 'tec-custos', 'beh-colaboracao', 'beh-aprendizado'],
    },
    {
      id: 'act-onboarding',
      title: 'Primeira leitura do fluxo de um request no sistema',
      context: 'Estágio',
      period: 'Início do estágio',
      description:
        'Desenhei o caminho do client ao banco e de volta: handler, serviço, repositório, logs no meio. Usei isso para me localizar nos tickets seguintes.',
      skillsNote: 'HTTP, camadas da aplicação, logs, mapa mental do produto.',
      skillIds: ['tec-fundamentos', 'tec-observabilidade', 'beh-ownership'],
    },
  ],
  removedCheckIds: [],
}

export const SEED_VERSION = 2
