import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      nav: { home: "Início", about: "Sobre Nós", products: "Produtos", contact: "Contato", verify: "Verificar Produto" },
      home: {
        eyebrow: "A Coleção Oxygen", title1: "Ciência.", title2: "Em movimento.", description: "Um olhar mais próximo do nosso universo de compostos farmacêuticos e formulações de alta qualidade. Cada lote é rastreável, desde a documentação até o produto em suas mãos.", exploreBtn: "Explore a coleção", verifyTag: "Verificado por design.", strip1: "Qualidade Premium", strip2: "Testado em Laboratório", strip3: "Grau de Pesquisa", principlesEyebrow: "O Padrão Oxygen", principlesTitle: "Evidência acima de suposição.", principlesText: "Tratamos cada produto como um instrumento científico: especificações definidas, manuseio controlado e documentação clara. Sem ruído. Apenas material que os pesquisadores podem avaliar com confiança.", stat1: "Pureza de referência", stat2: "Rastreabilidade de lote", stat3: "Teste de Identidade", authEyebrow: "Integridade do Produto", authTitle: "Um código. Uma resposta clara.", authText: "Todo pacote Oxygen carrega um identificador único. Verifique-o contra nosso registro de produtos em segundos.", authBtn: "Iniciar verificação"
      },
      about: {
        eyebrow: "A Empresa", title1: "Pensamento científico.", title2: "Uma ambição em comum.", description: "Reunimos profissionais de engenharia, medicina e farmácia para apoiar o desenvolvimento e inovação no setor farmacêutico com excelência incomparável.", philTitle: "Nossa Filosofia", p1: "A Oxygen Pharma foi fundada com um princípio central: o acesso à ciência de ponta não deve ser um luxo, mas o padrão. Nossas formulações são resultado de pesquisas exaustivas e compromisso inabalável com a pureza.", p2: "Investimos agressivamente em infraestrutura de testes, tecnologias de liofilização e controle de temperatura para garantir que nossos peptídeos e compostos cheguem ao usuário final na sua forma mais estável e eficaz.", p3: "Acreditamos que a transparência é tão importante quanto a qualidade. É por isso que implementamos um sistema digital público de verificação de autenticidade para cada unidade que sai de nossos laboratórios.",
        pillarsEyebrow: "Nossos Pilares", pillarsTitle: "Padrões inflexíveis.", pill1Title: "Síntese Avançada", pill1Desc: "Utilizamos métodos de síntese em fase sólida e líquida combinados com purificação HPLC para atingir os mais altos níveis de pureza no mercado (superiores a 99%).", pill2Title: "Estabilidade Otimizada", pill2Desc: "Nossos produtos liofilizados são manipulados em ambientes sob temperatura controlada rigorosa, estendendo a estabilidade e eficácia do composto base.", pill3Title: "Antifalsificação Global", pill3Desc: "O mercado paralelo é o maior risco aos consumidores. Por isso, desenvolvemos a iniciativa Oxygen Verificado, com validação digital irreversível."
      },
      products: {
        eyebrow: "A Coleção", title: "Catálogo de Compostos", description: "Explore nossas formulações rigorosamente testadas e a documentação completa.", btn: "Ver detalhes", authEyebrow: "Garantia de Autenticidade", authTitle: "Confiança Verificável", authDesc: "Todos os produtos Oxygen possuem um selo holográfico raspável contendo um código único que atesta sua originalidade e pureza diretamente em nosso banco de dados.", authBtn: "Verificar meu produto"
      },
      auth: {
        eyebrow: "Autenticação Oficial", title: "Verifique seu Produto", description: "Digite o código de 12 dígitos encontrado na embalagem original para confirmar a autenticidade e segurança da sua formulação.", placeholder: "EX: XY9-8L4-ZQX", btn: "Verificar", info: "O código está localizado sob o selo prateado na lateral da caixa.", successTitle: "Produto Autêntico", successDesc: "Código verificado com sucesso pela", successDesc2: "Este é um produto Oxygen original.", verifyTime: "Verificado em:", warnTitle: "Código Já Verificado", warnDesc: "Atenção: Este código já foi consultado", warnDesc2: "anteriormente.", warnHelp: "Se você não realizou estas consultas, este produto pode ser uma falsificação. Recomendamos não utilizá-lo e contatar nosso suporte.", errTitle: "Código Não Encontrado", errDesc: "O código informado não existe em nossa base de dados. Por favor, verifique se foi digitado corretamente."
      },
      contact: {
        eyebrow: "Vamos Conversar", title: "Entre em Contato", description: "Nossa equipe técnica e comercial está disponível para esclarecer dúvidas sobre nossas formulações, certificações de qualidade ou parcerias comerciais.", emailTitle: "E-mail Corporativo", wppTitle: "WhatsApp", wppDesc: "Fale com um consultor", addrTitle: "Endereço Global", addrDesc: "104 St · Kuwait", addrDesc2: "Sede Operacional", formTitle: "Envie uma mensagem", name: "Nome Completo", email: "Endereço de E-mail", subject: "Assunto", msg: "Sua Mensagem", btn: "Enviar Mensagem", opt1: "Dúvida Técnica / Produto", opt2: "Suporte de Autenticação", opt3: "Vendas / Parcerias", opt4: "Outros"
      }
    }
  },
  en: {
    translation: {
      nav: { home: "Home", about: "About Us", products: "Products", contact: "Contact", verify: "Verify Product" },
      home: {
        eyebrow: "The Oxygen Collection", title1: "Science.", title2: "In motion.", description: "A closer look at our universe of pharmaceutical compounds and high-quality formulations. Every batch is traceable, from documentation to the product in your hands.", exploreBtn: "Explore the collection", verifyTag: "Verified by design.", strip1: "Premium Quality", strip2: "Lab Tested", strip3: "Research Grade", principlesEyebrow: "The Oxygen Standard", principlesTitle: "Evidence over assumption.", principlesText: "We treat every product as a scientific instrument: defined specifications, controlled handling, and clear documentation. No noise. Just material researchers can evaluate with confidence.", stat1: "Reference purity", stat2: "Batch traceability", stat3: "Identity Testing", authEyebrow: "Product Integrity", authTitle: "One code. A clear answer.", authText: "Every Oxygen package carries a unique identifier. Check it against our product registry in seconds.", authBtn: "Start verification"
      },
      about: {
        eyebrow: "The Company", title1: "Scientific thinking.", title2: "A common ambition.", description: "We bring together professionals in engineering, medicine, and pharmacy to support development and innovation in the pharmaceutical sector with unparalleled excellence.", philTitle: "Our Philosophy", p1: "Oxygen Pharma was founded with a core principle: access to cutting-edge science should not be a luxury, but the standard. Our formulations are the result of exhaustive research and an unwavering commitment to purity.", p2: "We invest heavily in testing infrastructure, freeze-drying technologies, and temperature control to ensure our peptides and compounds reach the end user in their most stable and effective form.", p3: "We believe transparency is as important as quality. That's why we implemented a public digital authenticity verification system for every unit leaving our labs.",
        pillarsEyebrow: "Our Pillars", pillarsTitle: "Uncompromising standards.", pill1Title: "Advanced Synthesis", pill1Desc: "We use solid and liquid phase synthesis methods combined with HPLC purification to achieve the highest purity levels in the market (over 99%).", pill2Title: "Optimized Stability", pill2Desc: "Our lyophilized products are handled in strictly controlled temperature environments, extending the stability and efficacy of the base compound.", pill3Title: "Global Anti-Counterfeiting", pill3Desc: "The parallel market is the biggest risk to consumers. Therefore, we developed the Oxygen Verified initiative, with irreversible digital validation."
      },
      products: {
        eyebrow: "The Collection", title: "Compound Catalog", description: "Explore our rigorously tested formulations and complete documentation.", btn: "View details", authEyebrow: "Authenticity Guarantee", authTitle: "Verifiable Trust", authDesc: "All Oxygen products have a scratch-off holographic seal containing a unique code that attests to their originality and purity directly in our database.", authBtn: "Verify my product"
      },
      auth: {
        eyebrow: "Official Authentication", title: "Verify your Product", description: "Enter the 12-digit code found on the original packaging to confirm the authenticity and safety of your formulation.", placeholder: "EX: XY9-8L4-ZQX", btn: "Verify", info: "The code is located under the silver seal on the side of the box.", successTitle: "Authentic Product", successDesc: "Code successfully verified for the", successDesc2: "This is an original Oxygen product.", verifyTime: "Verified at:", warnTitle: "Code Already Verified", warnDesc: "Attention: This code has already been checked", warnDesc2: "previously.", warnHelp: "If you did not perform these checks, this product may be a counterfeit. We recommend not using it and contacting our support.", errTitle: "Code Not Found", errDesc: "The entered code does not exist in our database. Please check if it was typed correctly."
      },
      contact: {
        eyebrow: "Let's Talk", title: "Get in Touch", description: "Our technical and commercial team is available to answer questions about our formulations, quality certifications, or commercial partnerships.", emailTitle: "Corporate Email", wppTitle: "WhatsApp", wppDesc: "Talk to a consultant", addrTitle: "Global Address", addrDesc: "104 St · Kuwait", addrDesc2: "Operational Headquarters", formTitle: "Send a message", name: "Full Name", email: "Email Address", subject: "Subject", msg: "Your Message", btn: "Send Message", opt1: "Technical / Product Query", opt2: "Authentication Support", opt3: "Sales / Partnerships", opt4: "Other"
      }
    }
  },
  es: {
    translation: {
      nav: { home: "Inicio", about: "Nosotros", products: "Productos", contact: "Contacto", verify: "Verificar Producto" },
      home: {
        eyebrow: "La Colección Oxygen", title1: "Ciencia.", title2: "En movimiento.", description: "Una mirada más cercana a nuestro universo de compuestos farmacéuticos y formulaciones de alta calidad. Cada lote es rastreable, desde la documentación hasta el producto en sus manos.", exploreBtn: "Explorar la colección", verifyTag: "Verificado por diseño.", strip1: "Calidad Premium", strip2: "Probado en Laboratorio", strip3: "Grado de Investigación", principlesEyebrow: "El Estándar Oxygen", principlesTitle: "Evidencia sobre suposición.", principlesText: "Tratamos cada producto como un instrumento científico: especificaciones definidas, manejo controlado y documentación clara. Sin ruido. Solo material que los investigadores pueden evaluar con confianza.", stat1: "Pureza de referencia", stat2: "Rastreabilidad de lote", stat3: "Prueba de Identidad", authEyebrow: "Integridad del Producto", authTitle: "Un código. Una respuesta clara.", authText: "Cada paquete Oxygen lleva un identificador único. Verifíquelo en nuestro registro de productos en segundos.", authBtn: "Iniciar verificación"
      },
      about: {
        eyebrow: "La Empresa", title1: "Pensamiento científico.", title2: "Una ambición en común.", description: "Reunimos profesionales en ingeniería, medicina y farmacia para apoyar el desarrollo e innovación en el sector farmacéutico con excelencia inigualable.", philTitle: "Nuestra Filosofía", p1: "Oxygen Pharma se fundó con un principio central: el acceso a la ciencia de vanguardia no debe ser un lujo, sino el estándar. Nuestras formulaciones son el resultado de investigaciones exhaustivas y un compromiso inquebrantable con la pureza.", p2: "Invertimos fuertemente en infraestructura de pruebas, tecnologías de liofilización y control de temperatura para garantizar que nuestros péptidos y compuestos lleguen al usuario final en su forma más estable y efectiva.", p3: "Creemos que la transparencia es tan importante como la calidad. Por eso implementamos un sistema digital público de verificación de autenticidad para cada unidad que sale de nuestros laboratorios.",
        pillarsEyebrow: "Nuestros Pilares", pillarsTitle: "Estándares inflexibles.", pill1Title: "Síntesis Avanzada", pill1Desc: "Utilizamos métodos de síntesis en fase sólida y líquida combinados con purificación HPLC para lograr los niveles de pureza más altos del mercado (más del 99%).", pill2Title: "Estabilidad Optimizada", pill2Desc: "Nuestros productos liofilizados se manipulan en entornos de temperatura estrictamente controlada, extendiendo la estabilidad y eficacia del compuesto base.", pill3Title: "Antifalsificación Global", pill3Desc: "El mercado paralelo es el mayor riesgo para los consumidores. Por lo tanto, desarrollamos la iniciativa Oxygen Verified, con validación digital irreversible."
      },
      products: {
        eyebrow: "La Colección", title: "Catálogo de Compuestos", description: "Explore nuestras formulaciones rigurosamente probadas y documentación completa.", btn: "Ver detalles", authEyebrow: "Garantía de Autenticidad", authTitle: "Confianza Verificable", authDesc: "Todos los productos Oxygen tienen un sello holográfico raspable que contiene un código único que certifica su originalidad y pureza directamente en nuestra base de datos.", authBtn: "Verificar mi producto"
      },
      auth: {
        eyebrow: "Autenticación Oficial", title: "Verifique su Producto", description: "Ingrese el código de 12 dígitos que se encuentra en el empaque original para confirmar la autenticidad y seguridad de su formulación.", placeholder: "EJ: XY9-8L4-ZQX", btn: "Verificar", info: "El código se encuentra bajo el sello plateado en el costado de la caja.", successTitle: "Producto Auténtico", successDesc: "Código verificado con éxito por", successDesc2: "Este es un producto original de Oxygen.", verifyTime: "Verificado a las:", warnTitle: "Código Ya Verificado", warnDesc: "Atención: Este código ya ha sido consultado", warnDesc2: "anteriormente.", warnHelp: "Si usted no realizó estas consultas, este producto podría ser una falsificación. Recomendamos no usarlo y contactar a nuestro soporte.", errTitle: "Código No Encontrado", errDesc: "El código ingresado no existe en nuestra base de datos. Por favor, compruebe si fue escrito correctamente."
      },
      contact: {
        eyebrow: "Hablemos", title: "Ponerse en Contacto", description: "Nuestro equipo técnico y comercial está disponible para resolver dudas sobre nuestras formulaciones, certificaciones de calidad o alianzas comerciales.", emailTitle: "Correo Corporativo", wppTitle: "WhatsApp", wppDesc: "Hablar con un asesor", addrTitle: "Dirección Global", addrDesc: "104 St · Kuwait", addrDesc2: "Sede Operativa", formTitle: "Enviar un mensaje", name: "Nombre Completo", email: "Correo Electrónico", subject: "Asunto", msg: "Su Mensaje", btn: "Enviar Mensaje", opt1: "Consulta Técnica / Producto", opt2: "Soporte de Autenticación", opt3: "Ventas / Alianzas", opt4: "Otros"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
