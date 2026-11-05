export type Answers = Record<string, string>;
export type Field = { id: string; label: string; tipo: string; obrigatorio: boolean; opcoes?: string[]; ajuda?: string; limite_caracteres?: number; min?: number; step?: number; autocomplete?: string };
export type Step = { titulo: string; campos?: Field[] };
export function route(kind: string): number[] {
 return kind === 'Produtos para meu pet' ? [0, 3, 5] : kind === 'Outra dúvida' ? [0, 4, 5] : [0, 1, 2, 5];
}
export function visible(field: Field, answers: Answers) { return field.id !== 'especie_outra' || answers.especie === 'Outra'; }
export function entries(answers: Answers, steps: Step[]) {
 return route(answers.tipo_solicitacao).flatMap(i => (steps[i].campos || []).filter(f => visible(f, answers) && answers[f.id]?.trim()).map(f => [f.label, answers[f.id].trim()]));
}
export function message(answers: Answers, steps: Step[]) {
 return 'Olá, equipe do Pet Shop Babaloo! Vim pelo site e gostaria de solicitar atendimento.\n\n' + entries(answers, steps).map(([label, value]) => `${label}: ${value}`).join('\n') + '\n\nPodem confirmar a disponibilidade e informar o valor?';
}
export function whatsappUrl(number: string, text: string) { return `https://wa.me/${number}?text=${encodeURIComponent(text)}`; }
export function today() {
 const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const get = (type: string) => parts.find(p => p.type === type)!.value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
