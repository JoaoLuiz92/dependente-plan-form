import { useEffect, useState } from "react";
import { FormularioCadastro } from "@/components/FormularioCadastro";

// Mapeamento de planos por ID (baseado na sua estrutura)
const planos = {
  "fdff75fe-23c3-47d0-a84c-445532a878ef": { nome: "Plano 1 pessoa - Premium (6 meses)", dependentes: 0 },
  "9b4ace5f-1874-40ad-b5e9-93446a4447b9": { nome: "Plano 1 pessoa - VIP (12 meses)", dependentes: 0 },
  "fde207d4-fef1-4585-a285-c84507b85449": { nome: "Plano 1 pessoa: $29,90", dependentes: 1 },
  "1adf66a5-68a2-4533-a40b-14e149399130": { nome: "Plano 2 para até 4 pessoas: $49,90", dependentes: 4 },
  "94bf854e-b15e-4da3-b39d-b34cf5601388": { nome: "Plano 3 consulta única: $79,90", dependentes: 0 },
  "5b82a540-c362-4769-9331-6c69387f7176": { nome: "Plano 1 pessoa - Preferencial (3 meses)", dependentes: 0 },
  "46cb7319-1972-4af8-a216-d14a502f7394": { nome: "Plano 4 Valor adicional por dependente (mensal)", dependentes: 0 },
  "e2fde971-8359-486f-a9b7-12c9ac6dae09": { nome: "Plano 4 para até 4 pessoas - mês único: $89,90", dependentes: 4 },
  "c3323a7f-4ae6-4031-85d9-53fc892a016b": { nome: "Plano 2 para até 4 pessoas - Premium (6 meses)", dependentes: 4 },
  "2e15d471-d755-441f-abbf-3ebb89ad42d6": { nome: "Plano 2 para até 4 pessoas - VIP (12 meses)", dependentes: 4 },
  "108fa0a8-f6fb-46c3-a6b9-e5acce7adcf4": { nome: "Plano 2 para até 4 pessoas - Preferencial (3 meses)", dependentes: 4 }
};

const Index = () => {
  const [urlParams, setUrlParams] = useState<{
    dependentes: number;
    plano?: string;
    customerStripe?: string;
  }>({ dependentes: 0 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planoId = params.get('plano');
    const dependentesCount = parseInt(params.get('dependentes') || '0');
    const customerStripe = params.get('Custumer_stripe') || undefined;
    
    // Se foi especificado um ID de plano válido
    if (planoId && planos[planoId as keyof typeof planos]) {
      const plano = planos[planoId as keyof typeof planos];
      setUrlParams({
        dependentes: plano.dependentes,
        plano: plano.nome,
        customerStripe
      });
    } else {
      // Usa os parâmetros da URL diretamente (compatibilidade com sistema atual)
      setUrlParams({
        dependentes: dependentesCount,
        plano: planoId || undefined,
        customerStripe
      });
    }
  }, []);

  const handleFormSubmit = (data: any) => {
    console.log('Dados enviados:', data);
    // Aqui você pode integrar com sua API
  };

  return (
    <FormularioCadastro 
      quantidadeDependentes={urlParams.dependentes}
      planoNome={urlParams.plano}
      customerStripe={urlParams.customerStripe}
      onSubmit={handleFormSubmit}
    />
  );
};

export default Index;
