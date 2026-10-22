# Defeitos conhecidos no DemoQA

Registro de 22/10/2026, em Chrome 155.

## BUG-01 — Botão Close não fecha o popup

**Página:** https://demoqa.com/automation-practice-form

**Reprodução:**

1. Preencher o formulário com dados válidos e enviar.
2. Conferir o popup com os dados enviados.
3. Clicar em Close.

**Esperado:** o popup fecha e o formulário fica acessível.

**Observado:** o popup permanece aberto. O console registra:

```text
Uncaught TypeError: Lr.findDOMNode is not a function
```

O handler do botão tenta executar `findDOMNode(...).reset()` antes de fechar o popup. A exceção interrompe a sequência. Enter e Espaço no botão reproduzem o mesmo erro.

**Tratamento no teste:** usar Escape, que fecha o popup sem erro e atende à etapa de fechamento do enunciado. O clique no fundo também funcionou. O defeito do botão permanece registrado.

**Evidências:** [screenshot](evidencias/BUG-01-popup.png), [console](evidencias/BUG-01-console.json) e [comparação das interações](evidencias/popup-alternatives.json).

## BUG-02 — Exclusão remove outros registros adicionados

**Página:** https://demoqa.com/webtables

**Reprodução:**

1. Criar 12 registros com emails diferentes.
2. Conferir a presença de todos pela busca.
3. Excluir o primeiro registro criado.
4. Buscar os demais registros.

**Esperado:** excluir somente o registro selecionado.

**Observado:** os outros registros adicionados também desaparecem. Os três registros iniciais permanecem.

**Diagnóstico:** as colunas usam `useMemo(..., [])`; o handler de exclusão capturado usa a coleção inicial para calcular o próximo estado, descartando as inclusões posteriores.

**Tratamento no teste:** validar os 12 registros antes da exclusão, conferir a existência antes de cada clique e verificar que nenhum permanece ao final. O relatório registra os cliques e os registros já ausentes. Na validação, houve um clique e 11 registros já ausentes. O resultado do bônus confirma a remoção dos 12 registros; não comprova a correção da exclusão individual do produto.
