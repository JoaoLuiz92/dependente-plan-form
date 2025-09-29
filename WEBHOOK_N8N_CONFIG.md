# 🔗 Configuração do Webhook no n8n

## 📋 Estrutura de Dados Recebidos

O formulário enviará os seguintes dados para o webhook:

```json
{
  "titular": {
    "tipoDocumento": 0,
    "numeroDocumento": "12345678901",
    "genero": "male"
  },
  "dependentes": [
    {
      "nome": "Maria Silva",
      "telefone": "11999999999",
      "codigoPais": "+55",
      "email": "maria@email.com",
      "genero": "female",
      "tipoDocumento": 0,
      "numeroDocumento": "98765432100"
    }
  ],
  "plano": "Plano 4 para até 4 pessoas - mês único: $89,90",
  "quantidadeDependentes": 4,
  "customerStripe": "cus_T927QA2ahnqryQ",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://example.com",
  "sessionToken": "abc123def456"
}
```

## 🔧 Configuração do Node Webhook Respond

### 1. **Configuração Básica do Webhook**
- **HTTP Method**: `POST`
- **Path**: `/webhook/finalizar-cadastros`
- **Response Mode**: `Respond to Webhook`

### 2. **Headers de Resposta**
Configure os seguintes headers para resolver o CORS:

```json
{
  "Access-Control-Allow-Origin": "https://dependente-plan-form.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Requested-With, X-Form-Source, X-Timestamp",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json"
}
```

### 3. **Resposta de Sucesso com Redirecionamento**
```json
{
  "success": true,
  "data": {
    "url": "https://telemedicine.easydoctors.us/"
  }
}
```

### 4. **Resposta de Sucesso sem Redirecionamento**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso!",
  "data": {
    "id": "cadastro_123456",
    "status": "processando"
  }
}
```

### 5. **Resposta de Erro**
```json
{
  "success": false,
  "message": "Erro ao processar cadastro: Dados inválidos",
  "error": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "issue": "Email já cadastrado"
  }
}
```

## 🛠️ Exemplo de Workflow n8n

### **Node 1: Webhook**
```json
{
  "name": "Webhook Cadastro",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "httpMethod": "POST",
    "path": "finalizar-cadastros",
    "responseMode": "responseNode",
    "options": {
      "cors": {
        "enabled": true,
        "origin": "https://dependente-plan-form.vercel.app"
      }
    }
  }
}
```

### **Node 2: Processar Dados**
```json
{
  "name": "Processar Cadastro",
  "type": "n8n-nodes-base.function",
  "parameters": {
    "functionCode": "// Processar dados do formulário\nconst dados = $input.first().json;\n\n// Validar dados obrigatórios\nif (!dados.titular || !dados.dependentes) {\n  return {\n    success: false,\n    message: 'Dados incompletos'\n  };\n}\n\n// Salvar no banco de dados ou sistema\nconst cadastroId = 'cad_' + Date.now();\n\n// Retornar resposta de sucesso\nreturn {\n  success: true,\n  message: 'Cadastro realizado com sucesso!',\n  redirect: 'https://sua-pagina-de-sucesso.com?id=' + cadastroId,\n  data: {\n    id: cadastroId,\n    status: 'processando'\n  }\n};"
  }
}
```

### **Node 3: Responder Webhook**
```json
{
  "name": "Responder Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ $json }}",
    "options": {
      "responseHeaders": {
        "entries": [
          {
            "name": "Access-Control-Allow-Origin",
            "value": "https://dependente-plan-form.vercel.app"
          },
          {
            "name": "Access-Control-Allow-Methods", 
            "value": "POST, OPTIONS"
          },
          {
            "name": "Access-Control-Allow-Headers",
            "value": "Content-Type, X-Requested-With, X-Form-Source, X-Timestamp"
          }
        ]
      }
    }
  }
}
```

## 🔒 Validações Recomendadas

### **1. Validação de Origem**
```javascript
const allowedOrigins = [
  'https://dependente-plan-form.vercel.app',
  'https://dependente-plan-form-git-main.vercel.app'
];

const origin = $input.first().headers['origin'];
if (!allowedOrigins.includes(origin)) {
  return {
    success: false,
    message: 'Origem não autorizada'
  };
}
```

### **2. Validação de Headers**
```javascript
const requiredHeaders = ['x-requested-with', 'x-form-source'];
const headers = $input.first().headers;

for (const header of requiredHeaders) {
  if (!headers[header]) {
    return {
      success: false,
      message: 'Headers obrigatórios ausentes'
    };
  }
}
```

### **3. Rate Limiting**
```javascript
// Implementar rate limiting por IP ou sessionToken
const sessionToken = $input.first().json.sessionToken;
// Verificar se já processou recentemente
```

## 📱 URLs de Redirecionamento Sugeridas

### **Sucesso:**
- `https://sua-empresa.com/sucesso`
- `https://sua-empresa.com/obrigado`
- `https://sua-empresa.com/confirmacao`

### **Erro:**
- `https://sua-empresa.com/erro`
- `https://sua-empresa.com/tente-novamente`

## 🚀 Testando o Webhook

### **1. Teste com cURL:**
```bash
curl -X POST https://primary-production-2441.up.railway.app/webhook/finalizar-cadastros \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "X-Form-Source: dependente-plan-form" \
  -d '{
    "titular": {
      "tipoDocumento": 0,
      "numeroDocumento": "12345678901",
      "genero": "male"
    },
    "dependentes": [],
    "plano": "Teste",
    "quantidadeDependentes": 0,
    "customerStripe": "cus_test",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "Test",
    "referrer": "https://test.com",
    "sessionToken": "test123"
  }'
```

### **2. Resposta Esperada:**
```json
{
  "success": true,
  "data": {
    "url": "https://telemedicine.easydoctors.us/"
  }
}
```

## ⚠️ Importante

1. **Configure CORS** corretamente no n8n
2. **Valide os dados** antes de processar
3. **Implemente rate limiting** para evitar spam
4. **Use HTTPS** em todas as URLs
5. **Teste** o webhook antes de colocar em produção
