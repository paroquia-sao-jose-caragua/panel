export type EventSchedule = {
  id: string;
  communityId: string;
  title: string;
  type:
    | 'mass' // Para celebrações litúrgicas, como missas, batizados, crisma, casamentos e outras celebrações oficiais da Igreja.
    | 'pilgrimage' // Para eventos de peregrinação, como visitas a santuários ou locais religiosos
    | 'service' // Para eventos de caridade e volunátios, como arrecadações, doações, ações sociais, visitas a asilos ou hospitais, multirões de limpeza, etc.
    | 'formation' // Para formações catequéticas, doutrinárias, espirituais ou treinamentos práticos
    | 'feast' // Para festas religiosas, como festas de padroeiros, quermesse ou outras celebrações tradicionais
    | 'anniversary' // Para aniversários importantes, como a fundação da paróquia, ordenações ou jubileus
    | 'conference' // Para conferências, seminários ou encontros teológicos
    | 'meeting' // Reuniões gerais, como reuniões de conselho paroquial, comissões ou grupos de trabalho
    | 'retreat' // Retiro espiritual ou encontros de reflexão
    | 'liturgical_event' // Eventos litúrgicos especiais, como procissões, orações, adorações ou celebrações fora do comum
    | 'ordination' // Ordenações sacerdotais ou diaconais
    | 'community_event' // Eventos culturais ou sociais, promovidos pela paróquia, como almoços,  apresentações musicais, peças teatrais, exposições de arte sacra, etc.
    | 'other';
  eventDate: string;
  startTime: string;
  endTime?: string;
  customLocation?: string;
  orientations?: string;
  createdAt: string;
  updatedAt?: string;
};
