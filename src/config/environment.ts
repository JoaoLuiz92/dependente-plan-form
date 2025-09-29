// Configurações de ambiente
export const ENV_CONFIG = {
  // URLs da API
  API_URL: import.meta.env.VITE_API_URL || 'https://primary-production-2441.up.railway.app/webhook/2c9ff6b7-9a39-4fdd-9113-00ea306442fc',
  
  // Informações da aplicação
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Dependente Plan Form',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Modo de segurança
  SECURITY_MODE: import.meta.env.VITE_SECURITY_MODE || 'production',
  
  // Configurações de segurança
  MAX_DEPENDENTES: parseInt(import.meta.env.VITE_MAX_DEPENDENTES || '20'),
  RATE_LIMIT_WINDOW: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '30000'),
  MAX_STRING_LENGTH: parseInt(import.meta.env.VITE_MAX_STRING_LENGTH || '255'),
  MAX_PHONE_LENGTH: parseInt(import.meta.env.VITE_MAX_PHONE_LENGTH || '11'),
  MAX_DOCUMENT_LENGTH: parseInt(import.meta.env.VITE_MAX_DOCUMENT_LENGTH || '20'),
  
  // URLs permitidas
  ALLOWED_ORIGINS: (import.meta.env.VITE_ALLOWED_ORIGINS || 'https://dependente-plan-form.vercel.app,https://dependente-plan-form-git-main.vercel.app').split(','),
  
  // Configurações de desenvolvimento
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Função para validar se estamos em produção
export const isProduction = (): boolean => {
  return ENV_CONFIG.IS_PRODUCTION && ENV_CONFIG.SECURITY_MODE === 'production';
};

// Função para obter URL da API
export const getApiUrl = (): string => {
  return ENV_CONFIG.API_URL;
};

// Função para validar origem
export const validateOrigin = (origin: string): boolean => {
  return ENV_CONFIG.ALLOWED_ORIGINS.includes(origin);
};
