# language: pt
@api
Funcionalidade: Reserva de livros pela API
  Cenário: Criar e autorizar um usuário e reservar dois livros
    Dado que criei um usuário exclusivo pela API
    Quando gero um token de acesso
    Então a API confirma que o usuário está autorizado
    Quando consulto os livros disponíveis
    E reservo dois livros diferentes do catálogo
    Então os detalhes do usuário contêm exatamente os livros reservados
