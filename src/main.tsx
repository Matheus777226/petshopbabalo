import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { business as b } from './config';
import steps from './steps.json';
import { entries, message, route, today, visible, whatsappUrl, type Answers, type Field } from './message';
import { SmoothScroll } from './SmoothScroll';
import './style.css';

function Questionnaire() {
 const [answers, setAnswers] = useState<Answers>({});
 const [position, setPosition] = useState(0);
 const [errors, setErrors] = useState<Record<string,string>>({});
 const [copyStatus, setCopyStatus] = useState('');
 const title = useRef<HTMLHeadingElement>(null);
 const previousPosition = useRef(0);
 const activeRoute = route(answers.tipo_solicitacao);
 const index = activeRoute[position];
 const current = steps[index];
 useEffect(() => { if (previousPosition.current !== position) title.current?.focus({preventScroll:true}); previousPosition.current = position; }, [position]);
 const fields = (current.campos || []).filter(f => visible(f, answers));
 function next() {
  const found: Record<string,string> = {};
  fields.forEach(f => {
   const value = answers[f.id]?.trim();
   if (f.obrigatorio && !value) found[f.id] = 'Preencha este campo para continuar.';
   if (value && f.tipo === 'number' && (!Number.isFinite(Number(value)) || Number(value) < .1 || Math.abs(Number(value)*10-Math.round(Number(value)*10))>.0001)) found[f.id] = 'Informe um peso positivo com até uma casa decimal.';
   if (value && f.tipo === 'date' && value < today()) found[f.id] = 'Escolha hoje ou uma data futura.';
  });
  setErrors(found);
  if (Object.keys(found).length) { requestAnimationFrame(() => document.getElementById(Object.keys(found)[0])?.focus()); return; }
  setPosition(p => p+1);
 }
 function change(id: string, value: string) { setAnswers(a => ({...a,[id]:value})); setErrors(e => ({...e,[id]:''})); setCopyStatus(''); }
 function field(f: Field) {
  const props = {id:f.id,name:f.id,value:answers[f.id] || '',required:f.obrigatorio,'aria-invalid':!!errors[f.id],'aria-describedby':`${f.id}-help ${f.id}-error`,onChange:(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>change(f.id,e.target.value)};
  const help = <><small id={`${f.id}-help`}>{f.ajuda || ''}</small><span className="error" id={`${f.id}-error`}>{errors[f.id] || ''}</span></>;
  if (f.tipo === 'radio') return <fieldset key={f.id} id={f.id} tabIndex={-1} aria-describedby={`${f.id}-help ${f.id}-error`}><legend>{f.label} <small>{f.obrigatorio ? '(obrigatório)' : '(opcional)'}</small></legend><div className="choices">{f.opcoes?.map(option=><label className="choice" key={option}><input type="radio" name={f.id} checked={answers[f.id]===option} onChange={()=>change(f.id,option)} required={f.obrigatorio}/><span>{option}</span></label>)}</div>{help}</fieldset>;
  return <div className="field" key={f.id}><label htmlFor={f.id}>{f.label} <small>{f.obrigatorio?'(obrigatório)':'(opcional)'}</small></label>{f.tipo==='select'?<select {...props}><option value="">Selecione</option>{f.opcoes?.map(o=><option key={o}>{o}</option>)}</select>:f.tipo==='textarea'?<textarea {...props} maxLength={f.limite_caracteres || 600} rows={4}/>:<input {...props} type={f.tipo} maxLength={f.limite_caracteres || 120} min={f.tipo==='date'?today():f.min} step={f.step} autoComplete={f.autocomplete || 'off'}/>} {help}</div>;
 }
 return <div className="question-card"><div className="progress-label"><span>SEU PRÓXIMO PASSO</span><span>Etapa {position+1} de {activeRoute.length}</span></div><progress value={position+1} max={activeRoute.length}/><h3 ref={title} tabIndex={-1}>{current.titulo}</h3><form noValidate onSubmit={e=>{e.preventDefault(); if(index!==5) next();}}>
 {index===5 ? <><p>Confira sua solicitação. Você ainda precisará tocar em enviar no WhatsApp.</p><dl className="review">{entries(answers,steps).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="notice">Preços, serviços e disponibilidade serão confirmados pela equipe. Esta solicitação não é uma reserva.</p><div className="edit-actions">{activeRoute.slice(0,-1).map((i,p)=><button type="button" className="text-button" key={i} onClick={()=>{setPosition(p);setErrors({});}} >Editar: {steps[i].titulo}</button>)}</div><a className="button full" href={whatsappUrl(b.whatsapp,message(answers,steps))}>Continuar no WhatsApp →</a><button className="text-button" type="button" onClick={async()=>{try {await navigator.clipboard.writeText(message(answers,steps));setCopyStatus('Mensagem copiada.');} catch {setCopyStatus('Não foi possível copiar. Selecione o texto abaixo.');}}}>Copiar mensagem</button><span role="status">{copyStatus}</span>{copyStatus.startsWith('Não')&&<textarea aria-label="Mensagem para copiar" readOnly value={message(answers,steps)} rows={8}/>}<a className="text-button" href="tel:+5547984719918">Prefere ligar? {b.phone}</a></> : fields.map(field)}
 <div className="form-actions">{position>0&&<button type="button" className="button secondary" onClick={()=>{setPosition(p=>p-1);setErrors({});}}>← Voltar</button>}{index!==5&&<button className="button" type="submit">Continuar →</button>}</div></form><p className="privacy">Suas respostas ficam apenas nesta página até você decidir enviá-las pelo WhatsApp.</p></div>;
}
function App() {
 const [menu,setMenu] = useState(false);
 const toggle = useRef<HTMLButtonElement>(null);
 const nav = useRef<HTMLElement>(null);
 useEffect(()=>{ if(menu) nav.current?.querySelector('a')?.focus(); },[menu]);
 return <><SmoothScroll/><a className="skip" href="#conteudo">Pular para o conteúdo</a><div className="topline">Cuidado pet no coração do Tribess · Blumenau, SC</div><header onKeyDown={e=>{if(e.key==='Escape'){setMenu(false);toggle.current?.focus();}}}><div className="header-inner"><a className="brand" href="#inicio" aria-label="Babaloo, início"><span className="brand-mark" aria-hidden="true">b.</span><span>Babaloo<small>PET SHOP & ESTÉTICA</small></span></a><button ref={toggle} className="menu-toggle" aria-expanded={menu} aria-controls="navigation" onClick={()=>setMenu(!menu)}>Menu {menu?'−':'+'}</button><nav id="navigation" ref={nav} className={menu?'open':''} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setMenu(false);}}>{[['#servicos','Nossos cuidados'],['#sobre','A Babaloo'],['#contato','Onde estamos']].map(([href,label])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}<a className="button small" href="#solicitar-atendimento" onClick={()=>setMenu(false)}>Vamos conversar →</a></nav></div></header>
 <main id="conteudo"><section className="hero wrap" id="inicio"><div className="hero-copy"><span className="eyebrow">PARA QUEM É PARTE DA FAMÍLIA</span><h1>Cuidado e carinho para o seu <em>melhor amigo.</em></h1><p>Do banho aos pequenos mimos do dia a dia. Conheça a Babaloo, o pet shop do seu bairro em Blumenau.</p><div className="hero-actions"><a className="button" href="#solicitar-atendimento">Solicitar atendimento <span>→</span></a><a className="underlink" href={b.map}>Como chegar →</a></div><div className="location-tag"><span aria-hidden="true">⌖</span> Tribess, Blumenau · SC</div></div><div className="hero-art">{b.photo?<img src={b.photo} alt="Fachada rosa do Pet Shop Babaloo no bairro Tribess" width="640" height="700"/>:<><span className="art-caption">PET SHOP BABALOO</span><div className="pet-illustration" aria-hidden="true"><span className="ear left"/><span className="ear right"/><div className="dog-face"><i className="eye left"/><i className="eye right"/><span className="muzzle"><i/></span></div><span className="collar"/></div><span className="art-word">Amor em<br/><em>cada cuidado.</em></span></>}<span className="art-sticker">Feito de carinho.<br/>Pensado para pets.</span></div></section>
 <div className="ribbon" aria-hidden="true"><span>BANHO & TOSA</span><b>✳</b><span>CARINHO DE VERDADE</span><b>✳</b><span>PRODUTOS PET</span><b>✳</b><span>PERTINHO DE VOCÊ</span></div>
 <section id="servicos" className="section wrap"><div className="section-heading"><div><span className="eyebrow">DO JEITINHO QUE ELES MERECEM</span><h2>Pequenos cuidados.<br/>Um grande amor.</h2></div><p>Um espaço para cuidar do seu companheiro e encontrar o que faz parte da rotina dele.</p></div><div className="service-grid">{[['01','✂','Banho e tosa','Para conversar sobre o banho, a tosa e os cuidados com a pelagem do seu pet.'],['02','✳','Estética animal','Conte para a equipe quais cuidados seu melhor amigo precisa.'],['03','♡','Loja pet','Alimentação, acessórios e mimos: consulte produtos, preços e disponibilidade.']].map(([n,icon,title,text])=><article className="service" key={n}><div className="service-top"><span className="service-icon" aria-hidden="true">{icon}</span><small>{n}</small></div><h3>{title}</h3><p>{text}</p><a href="#solicitar-atendimento">Quero saber mais <span>→</span><span className="sr-only"> sobre {title}</span></a></article>)}</div></section>
 <section id="sobre" className="about wrap"><div className="about-art"><span aria-hidden="true">♡</span><p>Seu pet tem<br/>um lugar especial<br/><em>por aqui.</em></p><small>BABALOO · TRIBESS</small></div><div><span className="eyebrow">PRAZER, SOMOS A BABALOO</span><h2>Da nossa vizinhança<br/>para a sua família.</h2><p>Estamos na Rua Hermann Tribess, em Blumenau. Por aqui, você encontra banho e tosa, estética animal e uma loja de produtos para a rotina do seu pet.</p><p>Quer conhecer o espaço ou tirar uma dúvida? Converse com a gente e conte um pouquinho sobre seu companheiro.</p><a className="underlink" href={b.instagram}>Conheça nosso Instagram →</a></div></section>
 <section id="solicitar-atendimento" className="booking"><div className="wrap booking-grid"><div className="booking-copy"><span className="eyebrow">VAMOS CUIDAR DO SEU PET?</span><h2>A conversa começa<br/>com um <em>oi.</em></h2><p>Conte o que você precisa. Ao finalizar, você poderá enviar sua solicitação pelo WhatsApp.</p><ol><li>Escolha o que você procura</li><li>Conte um pouco mais</li><li>Revise e converse com a equipe</li></ol><small>Sem compromisso. O atendimento e a disponibilidade serão confirmados pela Babaloo.</small></div><Questionnaire/></div></section>
 <section id="contato" className="section wrap contact"><div><span className="eyebrow">PERTINHO DE VOCÊ</span><h2>Vem conhecer<br/>a Babaloo.</h2><p>{b.address}<br/>CEP {b.cep}</p><a className="underlink" href="tel:+5547984719918">{b.phone}</a></div><div className="address-card"><span aria-hidden="true">⌖</span><h3>Nos encontramos no Tribess.</h3><p>Rua Hermann Tribess, 1944<br/>Blumenau, Santa Catarina</p><a className="button" href={b.map}>Abrir no Google Maps →</a></div></section></main><footer className="wrap"><a className="brand" href="#inicio">Babaloo<small>PET SHOP & ESTÉTICA</small></a><p>Cuidado e carinho para quem faz parte da família.</p><a href={b.instagram}>Instagram →</a><small>© {new Date().getFullYear()} Pet Shop Babaloo</small></footer></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
