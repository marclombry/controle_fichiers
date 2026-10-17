window.AppState = (() => {
const state={sources:[],errors:[],analyzed:false,options:{characters:true,structure:true,duplicates:false,postalPad:false,countryISO:false,removeFrance:false,uppercase:false,removeAccents:false,street:false,region:false},zones:{METROPOLE:true,DROM:true,COM:true,ETRANGER:true,INCONNU:true},dupe:{enabled:false,exclude:false,threshold:90,pairs:0},dictionary:{AVENUE:'AV',BOULEVARD:'BD',IMPASSE:'IMP',ALLEE:'ALL',ROUTE:'RTE',CHEMIN:'CHE',PLACE:'PL',RESIDENCE:'RES'},journal:[],page:{postal:1,structure:1,analysis:1},view:'import',profileName:''};
const PAGE_SIZE=50;
function clearState(){state.sources=[];state.errors=[];state.analyzed=false;state.journal=[];state.page={postal:1,structure:1,analysis:1};state.dupe={enabled:false,exclude:false,threshold:90,pairs:0};state.options={characters:true,structure:true,duplicates:false,postalPad:false,countryISO:false,uppercase:false,removeAccents:false,street:false,region:false};state.zones={METROPOLE:true,DROM:true,COM:true,ETRANGER:true,INCONNU:true};state.dictionary={AVENUE:'AV',BOULEVARD:'BD',IMPASSE:'IMP',ALLEE:'ALL',ROUTE:'RTE',CHEMIN:'CHE',PLACE:'PL',RESIDENCE:'RES'};state.view='import';}

return {state,PAGE_SIZE,clearState};
})();
