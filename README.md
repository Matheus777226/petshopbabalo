# Pet Shop Babaloo

Site em React 19, TypeScript e Vite. Questionário condicional em quatro ramificações, sem backend ou armazenamento persistente de respostas. O link do WhatsApp prepara uma mensagem: o visitante precisa enviá-la e a equipe precisa confirmar o atendimento.

## Executar

Requer Node.js 22.18+ (validado com 24.22.1).

```sh
cd /workspace/petshopbabalo
npm ci
npm run dev -- --port 5173
```

```sh
npm test
npm run build
npm run preview
```

## Configurar

- `src/config.ts`: contato, endereço, Instagram, mapa, caminho de foto e pendências comerciais. Confirmar que o telefone atende WhatsApp antes de publicar. Horários, preços, avaliações e certificações não são exibidos.
- `src/steps.json`: campos, opções, textos e obrigatoriedade do questionário.
- `src/message.ts`: ramificações, seleção de respostas e codificação da mensagem. Não enviar campos de ramificações inativas.
- `src/SmoothScroll.tsx`: Lenis na rolagem principal do documento, `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false`. Um RAF gerenciado por Lenis; sem duração/easing concorrentes. Destruição no desmontar e ao ativar movimento reduzido, inclusive durante a sessão. Âncoras continuam nativas para preservar URL, foco e histórico. Sem `scroll-behavior: smooth`.
- `src/style.css`: cores e breakpoints em 900px e 700px. A marca é tipográfica, a ilustração é decorativa, não um logotipo oficial.

Para inserir uma foto original autorizada, coloque-a em `public/` e defina `photo` em `config.ts`, por exemplo `/fachada.webp`. Nenhuma foto remota ou com controles de galeria foi incorporada.

Não há modais nesta implementação. Se acrescentar um, controle pausa/retomada da instância existente e marque áreas internas com `data-lenis-prevent`; não inicialize outro Lenis.

## Validação

Build TypeScript/Vite passou. Testes de geração da mensagem cobrem ramificações, espécie condicional e caracteres especiais. Teste automatizado no Chromium verificou as quatro ramificações, obrigatoriedade, data passada, revisão/link de WhatsApp, retorno preservando respostas, largura de 320px, menu/Escape e mudança ao vivo de movimento reduzido, sem erros de JavaScript. Não foi enviada nenhuma mensagem real.

### Conferência manual antes de publicar

1. Desktop: wheel e trackpad, links de âncora, voltar/avançar do navegador e foco sem saltos inesperados; ajustar lerp se necessário.
2. Mobile físico: touch nativo, teclado virtual, selects e todos os botões sem sobreposição.
3. Teclado: Tab, Shift+Tab, setas nos radios, Enter e Escape; conferir foco nos erros e mudanças de etapa.
4. Movimento reduzido: ativar antes e durante a visita; conteúdo permanece visível e rolagem fica nativa.
5. Revisar cada ramificação, editar, copiar e verificar a mensagem no WhatsApp sem enviá-la. Confirmar número, informações e imagens com a loja.

Os testes em navegador não substituem avaliação física de trackpad e touch nem confirmação comercial.
