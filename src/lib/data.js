import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const ratingDistribution = [
    { stars: 5, percentage: 45 },
    { stars: 4, percentage: 23 },
    { stars: 3, percentage: 12 },
    { stars: 2, percentage: 8 },
    { stars: 1, percentage: 12 },
];

export const reviews = [
    {
        id: 1,
        author: "Luana M.",
        date: "28/10/2024",
        rating: 5,
        title: "Som quente e envolvente",
        content:
            "A cápsula de origem já traz uma assinatura analógica deliciosa. Liguei ao meu amplificador e em minutos estava a ouvir discos com um palco sonoro muito mais aberto do que o meu modelo antigo.",
    },
    {
        id: 2,
        author: "Bruno T.",
        date: "19/10/2024",
        rating: 4,
        title: "Construção sólida",
        content:
            "O chassis é pesado e praticamente não vibra. O braço em carbono surpreendeu e o Bluetooth ajuda quando quero ligar a colunas activas. Só senti falta de um manual em PT mais detalhado.",
    },
    {
        id: 3,
        author: "Daniela P.",
        date: "05/10/2024",
        rating: 5,
        title: "Perfeito para voltar ao vinil",
        content:
            "Nunca tinha montado um gira-discos e a equipa agendou a calibração em casa. Explicaram como ajustar o peso e trocar cápsulas. Agora passo as noites a redescobrir álbuns clássicos.",
    },
    {
        id: 4,
        author: "Inês L.",
        date: "29/09/2024",
        rating: 4,
        title: "Design e desempenho",
        content:
            "A tampa acrílica cai na perfeição e o acabamento combinou com o meu móvel media center. Só reduzi uma estrela porque a entrega atrasou um dia.",
    },
    {
        id: 5,
        author: "Ricardo G.",
        date: "11/09/2024",
        rating: 3,
        title: "Pré-phono competente",
        content:
            "O pré-amplificador interno cumpre bem, mas ligado a um externo dedicado o som abre ainda mais. Mesmo assim é um conjunto muito completo para o preço.",
    },
];

export const highlights = [
    "Prato em alumínio fundido com amortecimento anti-ressonância",
    "Braço em carbono com contrapeso e anti-skating ajustáveis",
    "Pré-amplificador phono integrado com saídas RCA e Bluetooth 5.3",
    "Inclui cápsula magnética móvel, tapete em cortiça e tampa acrílica",
];

export const badges = [
    { icon: ShieldCheck, label: "3 anos de garantia premium" },
    { icon: Truck, label: "Entrega rastreada e segurada" },
    { icon: RotateCcw, label: "Calibração gratuita durante 30 dias" },
];
