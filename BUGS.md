# Defeitos observados no DemoQA

Verificação em 22/10/2026, Chrome 155, com Selenium. Os testes usam o site real. Os problemas abaixo pertencem ao site público e não foram corrigidos por injeção de código no navegador.

## BUG-01 — Close não fecha o popup de Practice Form

**Página:** https://demoqa.com/automation-practice-form

**Passos para reproduzir:**

1. Preencher o formulário com dados válidos e enviar.
2. Conferir o popup com os dados enviados.
3. Clicar no botão Close.

**Esperado:** o popup fecha e o formulário fica acessível.

**Observado:** o popup permanece visível. O console registra:

```text
Uncaught TypeError: Lr.findDOMNode is not a function
```

O erro aparece em `https://demoqa.com/assets/index-D_rDx8ml.js`, linha 35. O handler do botão tenta executar `findDOMNode(...).reset()` antes de alterar a visibilidade do popup. A exceção interrompe essa sequência.

**Impacto na automação:** preenchimento, upload `.txt`, envio e validação de todos os campos passam. A etapa final de fechamento falha. O teste mantém essa falha e a saída não zero para sinalizar o defeito. O relatório inclui screenshot e logs do console.

Evidências versionadas: [screenshot](docs/evidencias/BUG-01-popup.png) e [console](docs/evidencias/BUG-01-console.json).

**Reprodução automatizada:**

```powershell
npm.cmd run test:ui -- --name "Enviar o formulário completo"
```

## BUG-02 — Uma exclusão remove outros registros adicionados

**Página:** https://demoqa.com/webtables

**Passos para reproduzir:**

1. Criar 12 registros com emails diferentes.
2. Confirmar que todos existem, usando a busca por email.
3. Excluir o primeiro registro criado.
4. Buscar os outros registros criados.

**Esperado:** excluir somente o registro selecionado.

**Observado:** os demais registros adicionados também desaparecem. Os três registros iniciais permanecem.

**Evidência técnica:** no bundle público, as colunas são memorizadas com `useMemo(..., [])`. O handler de exclusão capturado nas colunas usa a coleção inicial de três registros para calcular o próximo estado, descartando os registros incluídos depois.

**Impacto na automação:** o bônus valida a presença de cada um dos 12 registros antes de excluir. A limpeza verifica a existência antes de cada clique e valida a ausência de todos ao final. O relatório registra a quantidade de cliques e os registros que já estavam ausentes. Assim, o bônus verifica o resultado solicitado e evidencia o comportamento de exclusão do site. O sucesso desse cenário não significa que a exclusão individual do produto esteja correta.
