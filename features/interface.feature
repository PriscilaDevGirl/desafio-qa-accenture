# language: pt
@ui
Funcionalidade: Interações no DemoQA
  Cenário: Enviar o formulário completo
    Dado que acesso "Forms" e o submenu "Practice Form"
    Quando preencho todos os campos com dados aleatórios e envio o formulário
    Então o popup apresenta os dados enviados
    E consigo fechar o popup

  Cenário: Validar uma nova janela
    Dado que acesso "Alerts, Frame & Windows" e o submenu "Browser Windows"
    Quando abro uma nova janela
    Então a nova janela apresenta a mensagem "This is a sample page"
    E fecho a nova janela e retorno à original

  Cenário: Criar, editar e excluir um registro
    Dado que acesso "Elements" e o submenu "Web Tables"
    Quando crio um registro na tabela
    E edito os dados desse registro
    Então a tabela apresenta os dados atualizados
    Quando excluo esse registro
    Então esse registro não aparece mais na tabela

  @bonus
  Esquema do Cenário: Criar e excluir registros dinamicamente
    Dado que acesso "Elements" e o submenu "Web Tables"
    Quando crio <quantidade> registros exclusivos dinamicamente
    Então todos os <quantidade> registros estão presentes
    Quando excluo todos os registros que criei
    Então nenhum dos registros criados permanece na tabela

    Exemplos:
      | quantidade |
      | 12         |

  Cenário: Parar e reiniciar a barra de progresso
    Dado que acesso "Widgets" e o submenu "Progress Bar"
    Quando inicio e paro a barra antes de vinte e cinco por cento
    Então a barra está parada com valor menor ou igual a vinte e cinco
    Quando reinicio a barra e aguardo cem por cento
    E reseto a barra de progresso
    Então a barra volta a zero

  Cenário: Ordenar elementos com drag and drop
    Dado que acesso "Interactions" e o submenu "Sortable"
    Quando ordeno os elementos com drag and drop
    Então os elementos aparecem em ordem crescente
