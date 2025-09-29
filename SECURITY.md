# 🔒 Guia de Segurança - Formulário de Dependentes

## Implementações de Segurança

### 1. **Sanitização de Dados**
- ✅ Remove caracteres perigosos (`<`, `>`, `javascript:`, `on*=`)
- ✅ Limita tamanho dos campos (máximo 255 caracteres)
- ✅ Sanitiza números (apenas dígitos)
- ✅ Converte emails para lowercase

### 2. **Validação Robusta**
- ✅ Validação de email com regex
- ✅ Validação de telefone (10-11 dígitos)
- ✅ Validação de documentos por tipo
- ✅ Limite máximo de 20 dependentes
- ✅ Validação de gênero (male/female)

### 3. **Rate Limiting**
- ✅ Limite de 1 envio a cada 30 segundos
- ✅ Armazenamento no localStorage
- ✅ Mensagem de erro clara

### 4. **Headers de Segurança**
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- ✅ `Content-Security-Policy` configurado

### 5. **Headers Customizados**
- ✅ `X-Requested-With: XMLHttpRequest`
- ✅ `X-Form-Source: dependente-plan-form`
- ✅ `X-Timestamp: [timestamp]`

### 6. **Dados de Auditoria**
- ✅ Timestamp da submissão
- ✅ User Agent do navegador
- ✅ Referrer da página
- ✅ Token de sessão único

## Configuração do Vercel

O arquivo `vercel.json` já está configurado com:
- Headers de segurança
- CSP (Content Security Policy)
- Timeout de funções (30s)

## Recomendações para o Backend

### 1. **Validação no Servidor**
```javascript
// Validar origem da requisição
const allowedOrigins = [
  'https://dependente-plan-form.vercel.app',
  'https://dependente-plan-form-git-main.vercel.app'
];

if (!allowedOrigins.includes(req.headers.origin)) {
  return res.status(403).json({ error: 'Origin not allowed' });
}
```

### 2. **Rate Limiting no Backend**
```javascript
// Implementar rate limiting por IP
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 segundos
  max: 1, // 1 requisição por IP
  message: 'Too many requests from this IP'
});
```

### 3. **Validação de Headers**
```javascript
// Verificar headers obrigatórios
const requiredHeaders = [
  'x-requested-with',
  'x-form-source',
  'x-timestamp'
];

for (const header of requiredHeaders) {
  if (!req.headers[header]) {
    return res.status(400).json({ error: 'Missing required header' });
  }
}
```

### 4. **Validação de Dados**
```javascript
// Validar estrutura dos dados
const schema = {
  titular: {
    tipoDocumento: 'number',
    numeroDocumento: 'string',
    genero: 'string'
  },
  dependentes: 'array',
  plano: 'string',
  quantidadeDependentes: 'number',
  customerStripe: 'string',
  timestamp: 'string',
  userAgent: 'string',
  referrer: 'string',
  sessionToken: 'string'
};
```

### 5. **Logs de Segurança**
```javascript
// Log de tentativas suspeitas
console.log({
  timestamp: new Date().toISOString(),
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  referrer: req.headers.referer,
  data: sanitizedData
});
```

## Monitoramento

### 1. **Métricas Importantes**
- Número de submissões por minuto
- Tentativas de envio com dados inválidos
- Requisições de origens não autorizadas
- Erros de validação

### 2. **Alertas Recomendados**
- Mais de 10 submissões por minuto
- Tentativas de XSS detectadas
- Headers suspeitos
- Dados malformados

## Checklist de Deploy

- [ ] Headers de segurança configurados
- [ ] Rate limiting ativo
- [ ] Validação de origem implementada
- [ ] Logs de segurança configurados
- [ ] Monitoramento ativo
- [ ] Backup dos dados
- [ ] Testes de segurança realizados

## Contato

Para dúvidas sobre segurança, entre em contato com a equipe de desenvolvimento.
