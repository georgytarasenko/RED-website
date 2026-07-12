/* RED shared visualization theme — one look across every chart.
   Load before page scripts. Exposes REDVIZ globals. */
(function(){
  const SANS='Inter,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
  // ---- color grammar (documented, enforced) ----
  const C = {
    incumbent:'#8b1e2d',   // oxblood: incumbent / high concentration / density
    incumbentDk:'#6d121f',
    context:'#b9b3aa',     // warm grey: parliamentary / ordinary / context
    opposition:'#275d82',  // steel blue: opposition / negative change
    anomaly:'#c8a44b',     // gold: diagnostic excess ONLY
    ink:'#1a1a1f',
    muted:'#5c5c66',
    line:'#e2dfd8'
  };
  // sequential density scale — the ONE heatmap ramp for the whole site
  const DENSITY = [[0,'#faf9f7'],[0.25,'#e8c9b8'],[0.55,'#c65b4e'],[1,'#4a0812']];
  const NAMES={UR:'United Russia',KPRF:'KPRF (Communists)',LDPR:'LDPR',SR:'A Just Russia',
    Yabloko:'Yabloko',NovyeLyudi:'New People',Rodina:'Rodina',SPS:'SPS (Union of Right Forces)',
    APR:'Agrarian Party',Patrioty:'Patriots of Russia',PDPS:'Right Cause / Party of Growth',
    KPKR:'Communists of Russia',GrazhdPlatforma:'Civic Platform',PARNAS:'PARNAS',RPSS:'Freedom & Justice',
    ZelAlternativa:'Green Alternative',PartiyaPensionerov:'Party of Pensioners',Zelenye:'Greens',
    RPPSS:'Pensioners for Soc. Justice',PVR:"Party of Russia's Rebirth",NP:"People's Party",GS:'Civilian Power',
    PSS:'Party of Social Justice',DPR:'Democratic Party',against_all:'Against all',
    Putin:'Putin',Medvedev:'Medvedev',Zyuganov:'Zyuganov',Zhirinovsky:'Zhirinovsky',Yavlinskiy:'Yavlinsky',
    Kharitonov:'Kharitonov',Grudinin:'Grudinin',Prokhorov:'Prokhorov',Sobchak:'Sobchak',Davankov:'Davankov',
    Slutsky:'Slutsky',Glazyev:'Glazyev',Khakamada:'Khakamada',Mironov:'Mironov',Malyshkin:'Malyshkin',
    Bogdanov:'Bogdanov',Tuleev:'Tuleev',Titov_K:'Titov (K.)',Titov_B:'Titov (B.)',Suraykin:'Suraykin',
    Baburin:'Baburin',Pamfilova:'Pamfilova',IstinnyePatrioty:'True Patriots',Yedineniye:'Yedineniye',
    NKAR:'New Course-Auto Russia',ZaRusSvyuatuyu:"For Holy Rus'",Rus:"Rus'",NRPR:"People's Republican",
    VRES:'Great Russia-Eurasian U.',SLON:'SLON',PME:'Peace & Unity',RCDP:'Constitutional Democrats',BizDev:'Business Development'};
  // Party/candidate colors: public party colors where documented; candidate-only colors follow party family or campaign role.
  const PARTY_COLORS={
    UR:'#2364aa',Putin:C.incumbent,Medvedev:C.incumbent,
    KPRF:'#c8202f',Zyuganov:'#c8202f',Kharitonov:'#c8202f',Grudinin:'#c8202f',Suraykin:'#c8202f',KPKR:'#b51f2a',
    LDPR:'#2d72d9',Zhirinovsky:'#2d72d9',Slutsky:'#2d72d9',Malyshkin:'#2d72d9',
    SR:'#d99a00',Mironov:'#d99a00',Patrioty:'#c64f2f',Rodina:'#d6a400',
    Yabloko:'#2f8f4e',Yavlinskiy:'#2f8f4e',
    NovyeLyudi:'#00a6a6',Davankov:'#00a6a6',
    Zelenye:'#43a047',ZelAlternativa:'#00a878',
    SPS:'#f28c28',PDPS:'#6a8fca',PARNAS:'#7a5dc7',GrazhdPlatforma:'#7b8794',GS:'#7b8794',
    Prokhorov:'#5a78b8',Sobchak:'#c05a9d',Khakamada:'#8e5bbf',Bogdanov:'#6d9dc5',
    Titov_K:'#607d8b',Titov_B:'#607d8b',Tuleev:'#9a6a38',Glazyev:'#b85c38',Baburin:'#9b3a2f',Pamfilova:'#9b6ac8',
    APR:'#668d3c',RPPSS:'#8f7c46',PartiyaPensionerov:'#8f7c46',PVR:'#8c5d33',NP:'#558b6e',
    DPR:'#6c7a89',PSS:'#b08d57',RPSS:'#b08d57',against_all:'#6e6e76',
    IstinnyePatrioty:'#a54a35',Yedineniye:'#3d6f91',NKAR:'#667085',ZaRusSvyuatuyu:'#7c3f2f',
    Rus:'#7c3f2f',NRPR:'#6b5b95',VRES:'#8a6d3b',SLON:'#4d7c8a',PME:'#6a8d73',RCDP:'#6d7fa6',BizDev:'#4a7c9b'
  };
  const partyName=p=>NAMES[p]||p;
  const partyColor=p=>PARTY_COLORS[p]||C.context;
  function hexToRgb(hex){
    const h=String(hex||'#000').replace('#','');
    const v=h.length===3?h.split('').map(x=>x+x).join(''):h;
    return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16));
  }
  function rgbToCss(rgb){return `rgb(${rgb.map(v=>Math.round(v)).join(',')})`;}
  function mix(a,b,t){
    const A=Array.isArray(a)?a:hexToRgb(a), B=Array.isArray(b)?b:hexToRgb(b);
    return A.map((x,i)=>x+(B[i]-x)*t);
  }
  // numeric [r,g,b] stops — keep components until the final rgbToCss so interpolation never re-parses a formatted string
  function partyStopsRgb(p){
    const base=partyColor(p), dark=mix(base,'#121216',0.42);
    return [hexToRgb('#faf9f7'),mix('#faf9f7',base,0.34),mix('#faf9f7',base,0.72),dark];
  }
  function partyStops(p){return partyStopsRgb(p).map(rgbToCss);}
  function partySeqColor(p,t){
    t=Math.max(0,Math.min(1,t));
    const stops=partyStopsRgb(p), s=t*3, i=Math.min(2,Math.floor(s));
    return rgbToCss(mix(stops[i],stops[i+1],s-i));
  }
  const partyRamp=p=>`linear-gradient(90deg,${partyStops(p).join(',')})`;
  const partyScale=p=>partyStops(p).map((c,i)=>[i/3,c]);
  // canonical non-party ramps — one source of truth for both map pages.
  //   party share -> partySeqColor(party,t) | turnout -> seqColor(t) | change/shift -> divColor(t)
  //   anomaly highlight -> C.anomaly (gold) | no data -> '#d8d2c8'
  const SEQ_STOPS=[[250,249,247],[232,201,184],[198,91,78],[74,8,18]];
  function seqColor(t){t=Math.max(0,Math.min(1,t));const s=t*3,i=Math.min(2,Math.floor(s));return rgbToCss(mix(SEQ_STOPS[i],SEQ_STOPS[i+1],s-i));}
  function divColor(t){t=Math.max(-1,Math.min(1,t));return t<0?rgbToCss(mix([250,249,247],[39,93,130],-t)):rgbToCss(mix([250,249,247],[139,30,45],t));}
  const seqRamp=`linear-gradient(90deg,${SEQ_STOPS.map(c=>`rgb(${c})`).join(',')})`;
  const divRamp='linear-gradient(90deg,#275d82,#faf9f7,#8b1e2d)';
  const NODATA='#d8d2c8';

  // Plotly template applied via layout.template
  const TEMPLATE = {
    layout:{
      font:{family:SANS,color:C.ink,size:13},
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      colorway:[C.incumbent,C.opposition,C.anomaly,C.context,C.green='#3f6f5b','#2364aa','#c8202f','#00a6a6','#2f8f4e'],
      margin:{t:24,r:18,b:48,l:60},
      xaxis:{tickfont:{color:C.muted,size:11},titlefont:{color:C.ink,size:12},
             gridcolor:'rgba(0,0,0,0)',zerolinecolor:C.line,linecolor:C.line,ticks:'outside',tickcolor:C.line,ticklen:4},
      yaxis:{tickfont:{color:C.muted,size:11},titlefont:{color:C.ink,size:12},
             gridcolor:'#efece6',zerolinecolor:C.line,linecolor:'rgba(0,0,0,0)'},
      hoverlabel:{bgcolor:'#1a1a1f',bordercolor:'#1a1a1f',font:{family:SANS,color:'#fff',size:12}},
      legend:{font:{size:11,color:C.muted}}
    }
  };
  // base layout helper — merge template + overrides, titles live in HTML not Plotly
  function layout(extra){
    return Object.assign({template:TEMPLATE, font:{family:SANS,color:C.ink},
      paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
      margin:{t:24,r:18,b:48,l:60}}, extra||{});
  }
  const CONFIG={displayModeBar:false,responsive:true};
  window.REDVIZ={C,DENSITY,TEMPLATE,layout,CONFIG,SANS,NAMES,PARTY_COLORS,partyName,partyColor,partyStops,partySeqColor,partyRamp,partyScale,seqColor,divColor,seqRamp,divRamp,NODATA};
})();
