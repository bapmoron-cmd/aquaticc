
/* AQUATICC V7 - export PDF visuel */
async function aquaticcPortrait(who){
 const p=crew[who]||crew.elise;
 return new Promise(done=>{const img=new Image();img.onload=()=>done(img);img.onerror=()=>done(null);img.src=assetUrl(p.src)});
}
downloadEvaluationPDF=async function(){
 const buttons=[...document.querySelectorAll('button[onclick="downloadEvaluationPDF()"]')];
 buttons.forEach(x=>{x.dataset.original=x.textContent;x.textContent='Création du PDF…';x.disabled=true});
 try{
  const PDF=await aquaticcPdfLibrary(),pdf=new PDF({unit:'mm',format:'a4',compress:true});
  const L=17,R=193,usable=R-L;let y=40,page=1;
  const off=officialV5(),o=objectiveV5(),fb=feedbackV5();
  const who=off.complete?(off.score>=14?'leroy':off.score>=10?'elise':'ombre'):(o.score>=14?'elise':o.score>=10?'tom':'ombre');
  const person=crew[who],portrait=await aquaticcPortrait(who),name=state.names||'Binôme non renseigné';
  const safe=s=>pdfSafe(s);
  function head(){pdf.setFillColor(7,23,40);pdf.rect(0,0,210,31,'F');pdf.setFillColor(233,71,79);pdf.rect(0,29,210,2,'F');pdf.setFont('helvetica','bold');pdf.setFontSize(17);pdf.setTextColor(246,195,116);pdf.text('AQUATICC / DOSSIER ROUGE',L,13);pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(212,233,242);pdf.text('BTS ATI - Bilan et correction argumentee',L,23)}
  function foot(){pdf.setDrawColor(197,214,224);pdf.line(L,284,R,284);pdf.setFontSize(8);pdf.setFont('helvetica','normal');pdf.setTextColor(100,119,129);pdf.text('Comprendre une installation a partir de ses documents',L,290);pdf.text('Page '+page,R,290,{align:'right'})}
  function next(){foot();pdf.addPage();page++;y=40;head()}
  function need(v){if(y+v>277)next()}
  function write(str,{size=9,bold=false,indent=0,color=[34,52,65]}={}){
   pdf.setFont('helvetica',bold?'bold':'normal');pdf.setFontSize(size);pdf.setTextColor(...color);
   const ls=pdf.splitTextToSize(safe(str||' '),usable-indent),step=size*.43+1.5;
   for(const x of ls.length?ls:[' ']){need(step+1);pdf.text(x,L+indent,y);y+=step}y+=2;
  }
  function section(str){need(16);y+=4;pdf.setFillColor(17,51,73);pdf.roundedRect(L,y-7,usable,12,2,2,'F');pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.setTextColor(249,198,122);pdf.text(safe(str).slice(0,92),L+5,y+1);y+=14}
  function stat(x,w,title,value){pdf.setFillColor(17,48,68);pdf.roundedRect(x,166,w,30,3,3,'F');pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(185,209,220);pdf.text(title,x+6,175);pdf.setFontSize(20);pdf.setFont('helvetica','bold');pdf.setTextColor(255,201,114);pdf.text(value,x+6,188)}
  // Couverture inspirée de l'écran de débrief
  pdf.setFillColor(7,17,31);pdf.rect(0,0,210,297,'F');pdf.setFillColor(231,72,82);pdf.rect(0,0,6,297,'F');
  pdf.setFillColor(14,44,67);pdf.roundedRect(L,29,176,99,5,5,'F');
  pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.setTextColor(239,104,110);pdf.text('DOSSIER CONFIDENTIEL / EVALUATION',L+11,43);
  pdf.setFontSize(29);pdf.setTextColor(253,200,115);pdf.text('AQUATICC',L+11,64);
  pdf.setFontSize(20);pdf.setTextColor(244,249,255);pdf.text('BILAN DE MISSION',L+11,78);
  pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.setTextColor(207,225,235);
  pdf.text(pdf.splitTextToSize('Comprendre le fonctionnement d une installation a partir des documents techniques.',144),L+11,95);
  pdf.setTextColor(242,248,251);pdf.setFontSize(11);pdf.text(safe('Binome : '+name),L,145);
  pdf.setFontSize(9);pdf.text('Date : '+new Date().toLocaleDateString('fr-FR'),L,155);
  stat(L,84,'Score automatique',o.score.toFixed(1).replace('.',',')+'/20');
  stat(L+92,84,'Note du formateur',off.complete?off.score.toFixed(1).replace('.',',')+'/20':'A valider');
  pdf.setFillColor(19,45,63);pdf.roundedRect(L,206,176,61,4,4,'F');
  if(portrait){try{pdf.addImage(portrait,'PNG',L+6,212,42,48,undefined,'FAST')}catch(e){}}
  pdf.setFont('helvetica','bold');pdf.setFontSize(16);pdf.setTextColor(255,203,119);pdf.text(safe(person.name),L+54,222);
  pdf.setFontSize(9);pdf.setFont('helvetica','normal');pdf.setTextColor(221,232,240);
  pdf.text(pdf.splitTextToSize(safe(fb.message),112).slice(0,6),L+54,237);
  pdf.setFontSize(8);pdf.setTextColor(180,197,210);pdf.text('Le score automatique ne remplace pas l evaluation des reponses redigees.',L,278);
  foot();next();
  section('01 / SYNTHESE');
  write('Equipe : '+name,{bold:true,size:11});write('Grade : '+grade()+'  -  XP : '+scoreXP());
  write('Questions : '+progress()+'/27  |  Mini-defis : '+miniWon()+'/24');
  write('Score indicatif : '+o.score.toFixed(1)+'/20 ('+o.correct+'/'+o.total+' reponses objectives)',{bold:true});
  write('Note officielle : '+(off.complete?off.score.toFixed(1)+'/20':'A renseigner par le formateur'),{bold:true,color:[150,60,65]});
  write('Les analyses documentaires, les preuves et le compte rendu ne sont pas notes automatiquement.');
  section('02 / LE DEBRIEF DE '+person.name.toUpperCase());
  write(fb.message,{bold:true,size:10});
  if(who==='ombre')write('Elise : reviens aux folios. Toute hypothese doit etre presentee comme probable tant qu elle n est pas confirmee.');
  section('03 / BILAN DES SIX MISSIONS');
  for(let i=0;i<missions.length;i++){const z=v7Stats(i),t=v7Lessons[i];write('Mission '+(i+1)+' - '+missions[i].title+' : '+z.qcount+'/'+z.qtotal+' questions, '+z.mini+'/'+z.mtotal+' defis.',{bold:true});write('A retenir : '+t.lesson,{size:8.6,indent:3})}
  section('04 / CONSEILS PERSONNALISES');
  const advice=fb.advice.length?fb.advice:[{t:'Methode',advice:'Citer la piece, le repere et le niveau de certitude.'}];
  advice.forEach(a=>write(a.t+' : '+a.advice));
  section('05 / BAREME OFFICIEL');
  criteriaV5.forEach(c=>write(c.label+' : '+(v5.grades[c.id]??'non evalue')+' / '+c.max));
  if(v5.comment)write('Commentaire formateur : '+v5.comment,{bold:true});
  section('06 / CORRECTION ARGUMENTEE');
  let reading=false;
  for(const line of correctionV5().split('\n')){
   if(line.startsWith('CORRECTION DES QUESTIONS FERMÉES')||line.startsWith('CORRECTION ARGUMENTÉE DES 24')||line.startsWith('QUESTIONS RÉDIGÉES')||line==='RAPPORT PROFESSIONNEL'){reading=true;section(line);continue}
   if(!reading)continue;
   write(line,{size:8.5,bold:/^(Q\d+|Défi \d+|Réponse attendue|Résultat|Justification|Explication)/.test(line)});
  }
  foot();pdf.save('AQUATICC_V7_BILAN_'+(name.replace(/[^a-z0-9_-]/gi,'_').slice(0,40)||'binome')+'.pdf');
 }catch(e){alert('Export PDF indisponible : '+e.message+'. Utilisez Imprimer / Enregistrer en PDF.')}
 finally{buttons.forEach(b=>{b.disabled=false;b.textContent=b.dataset.original||'Télécharger le PDF'})}
};
