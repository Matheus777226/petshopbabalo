import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {entries,message,route,today,whatsappUrl} from './message.ts';
const steps=JSON.parse(readFileSync(new URL('./steps.json',import.meta.url)));
test('quatro ramificações selecionam somente os campos pertinentes',()=>{
 for(const kind of steps[0].campos[0].opcoes){
  const a={tipo_solicitacao:kind,nome_tutor:'João & Maria',nome_pet:'Mel',especie:'Cão',especie_outra:'Dado antigo',descricao_produto:'Ração',duvida:'Olá?'};
  const text=message(a,steps);
  assert.ok(text.includes('João & Maria'));
  assert.equal(text.includes('Dado antigo'),false);
  assert.equal(text.includes('Ração'),kind==='Produtos para meu pet');
  assert.equal(text.includes('Olá?'),kind==='Outra dúvida');
  assert.equal(text.includes('Mel'),['Banho e tosa','Estética e cuidados'].includes(kind));
  assert.equal(route(kind).at(-1),5);
 }
});
test('outra espécie aparece somente quando selecionada',()=>{
 const a={tipo_solicitacao:'Banho e tosa',especie:'Outra',especie_outra:'Coelho'};
 assert.ok(entries(a,steps).some(([,v])=>v==='Coelho'));
});
test('link preserva acentos, quebras e caracteres especiais',()=>{
 const text='Olá!\nJoão & Maria + 10% #pet';
 assert.equal(new URL(whatsappUrl('5547984719918',text)).searchParams.get('text'),text);
});
test('dia local usa formato ISO para comparação de datas',()=>assert.match(today(),/^\d{4}-\d{2}-\d{2}$/));
