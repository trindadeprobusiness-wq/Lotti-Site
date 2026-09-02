# Checkout SaaS Lotti com Asaas

## O que foi implementado

O site oferece checkout próprio em `/checkout`, com PIX e cartão de crédito para
os três planos do catálogo. O cartão é cobrado mensalmente; o PIX cobra de uma vez
o equivalente a 12 mensalidades. Os valores nunca são aceitos do navegador: o
backend recalcula preço, ciclo e descrição a partir do catálogo versionado.

Fluxo de ativação:

1. O servidor cria um pedido interno com status `creating`.
2. O cliente é localizado ou criado no Asaas.
3. O Asaas cria uma assinatura mensal no cartão ou anual no PIX.
4. PIX recebe QR Code; cartão é processado no momento da requisição.
5. A tela consulta somente o status do pedido, usando um token aleatório com hash
   armazenado no banco.
6. A tentativa do navegador é reutilizada após uma resposta perdida, impedindo
   que o mesmo clique crie uma segunda assinatura. O status também recupera o QR
   Code quando a cobrança PIX demora a ficar disponível.
7. O webhook valida `asaas-access-token` e registra o `event.id` antes de agir.
8. Apenas `PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED` ativa a assinatura da Lotti.
9. O Supabase envia ao e-mail do pagamento o convite para criar a senha. Se a
   conta já existir, envia recuperação de senha para o mesmo endereço.

O número completo do cartão e o CVV não são gravados no banco, nos eventos ou em
logs da aplicação.

## 1. Aplicar a migration

Aplique no mesmo projeto Supabase utilizado pela plataforma, depois das migrations
de `corretores`, `plans`, `subscriptions` e onboarding:

```text
supabase/migrations/20260826090000_asaas_saas_checkout.sql
```

A migration cria:

- `checkout_orders`, acessível somente por `service_role`/Secret Key;
- `asaas_checkout_events`, sem armazenar o payload bruto do webhook;
- RPCs atômicas para reivindicar cada evento e cada provisionamento uma única vez,
  inclusive quando `CONFIRMED` e `RECEIVED` chegam quase juntos.

## 2. Configurar variáveis no site

Use `.env.example` como referência. Em produção:

- `ASAAS_ENVIRONMENT=production` somente depois da homologação completa;
- `ASAAS_API_KEY` deve pertencer à conta exclusiva de cobrança do SaaS;
- `ASAAS_WEBHOOK_TOKEN` precisa ter entre 32 e 255 caracteres e não pode ser a
  API Key;
- `SUPABASE_SECRET_KEY` deve permanecer exclusivamente no backend;
- `LOTTI_APP_PASSWORD_SETUP_URL` deve apontar para a página real de criação de
  senha da plataforma;
- `CHECKOUT_ALLOWED_ORIGINS` deve conter somente os domínios oficiais do site.

Sem essas variáveis, a interface abre normalmente, mas a API responde com modo
indisponível e não cria cobranças.

## 3. Configurar o webhook no Asaas

No Sandbox, crie um webhook com:

```text
URL: https://SEU-DOMINIO/api/webhooks/asaas
Token: o mesmo valor de ASAAS_WEBHOOK_TOKEN
Entrega: SEQUENTIALLY
```

Eventos mínimos recomendados:

```text
PAYMENT_CONFIRMED
PAYMENT_RECEIVED
PAYMENT_OVERDUE
PAYMENT_REFUNDED
PAYMENT_PARTIALLY_REFUNDED
PAYMENT_CHARGEBACK_REQUESTED
PAYMENT_CHARGEBACK_DISPUTE
PAYMENT_DELETED
```

O endpoint retorna `200` para duplicatas e eventos que não pertencem ao checkout.
Falhas internas retornam `500`, mantendo o evento elegível para nova tentativa.

## 4. Configurar o e-mail de acesso no Supabase

No painel do Supabase:

1. Cadastre `LOTTI_APP_PASSWORD_SETUP_URL` na lista de Redirect URLs.
2. Personalize os templates **Invite user** e **Reset password** com a marca Lotti.
3. Configure SMTP próprio. O SMTP de demonstração do Supabase não entrega para
   clientes externos em produção.
4. Confirme que o trigger `handle_new_user` e o bootstrap do onboarding estão
   aplicados no banco de destino.

## 5. Homologação obrigatória

Antes de trocar para produção, validar no Sandbox:

- PIX criado, pago manualmente no painel e confirmado pelo webhook;
- cartão aprovado, recusado e com timeout inconclusivo;
- reenvio do mesmo evento sem duplicar convite ou assinatura;
- e-mail novo recebendo convite e conta existente recebendo recuperação;
- cartão mensal com os três valores do catálogo (R$ 99, R$ 149 e R$ 299);
- PIX anual com os totais de R$ 1.188, R$ 1.788 e R$ 3.588;
- pagamento atrasado, estorno e chargeback alterando o acesso;
- layout em HTTPS, desktop e celular.

Uma resposta de criação do Asaas ou uma página de sucesso nunca deve liberar
acesso sozinha. A fonte de verdade é o webhook autenticado e idempotente.
