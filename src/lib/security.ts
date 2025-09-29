import { ENV_CONFIG } from '@/config/environment';

// Configurações de segurança para produção
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW: ENV_CONFIG.RATE_LIMIT_WINDOW,
  MAX_SUBMISSIONS_PER_WINDOW: 1,
  
  // Validações
  MAX_DEPENDENTES: ENV_CONFIG.MAX_DEPENDENTES,
  MAX_STRING_LENGTH: ENV_CONFIG.MAX_STRING_LENGTH,
  MAX_PHONE_LENGTH: ENV_CONFIG.MAX_PHONE_LENGTH,
  MAX_DOCUMENT_LENGTH: ENV_CONFIG.MAX_DOCUMENT_LENGTH,
  
  // URLs permitidas
  ALLOWED_ORIGINS: ENV_CONFIG.ALLOWED_ORIGINS,
  
  // Headers de segurança
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};

// Função para validar origem
export const validateOrigin = (origin: string): boolean => {
  return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin);
};

// Função para sanitizar strings
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: URLs
    .slice(0, SECURITY_CONFIG.MAX_STRING_LENGTH);
};

// Função para sanitizar números
export const sanitizeNumber = (str: string): string => {
  return str.replace(/\D/g, '').slice(0, SECURITY_CONFIG.MAX_PHONE_LENGTH);
};

// Função para validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= SECURITY_CONFIG.MAX_STRING_LENGTH;
};

// Função para validar telefone
export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Função para validar documento
export const validateDocument = (document: string, type: number): boolean => {
  const cleanDoc = document.replace(/\D/g, '');
  
  switch (type) {
    case 0: // CPF
      return cleanDoc.length === 11;
    case 1: // SSN
      return cleanDoc.length === 9;
    case 2: // ITIN
      return cleanDoc.length === 9;
    case 3: // PASSAPORTE
      return document.length >= 5 && document.length <= 20;
    default:
      return false;
  }
};

// Função para gerar token de sessão
export const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Função para validar token de sessão
export const validateSessionToken = (token: string): boolean => {
  return token.length >= 10 && /^[a-z0-9]+$/i.test(token);
};
