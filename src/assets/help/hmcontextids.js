var hmContextIds = new Array();
function hmGetContextId(query) {
    var urlParams;
    var match,
        pl = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    params = {};
    while (match = search.exec(query))
       params[decode(match[1])] = decode(match[2]);
    if (params["contextid"]) return decodeURIComponent(hmContextIds[params["contextid"]]);
    else return "";
}

hmContextIds["10"]="hlp_bienvenida.htm";
hmContextIds["20"]="hlp_introduccion.htm";
hmContextIds["30"]="hlp_instalacion.htm";
hmContextIds["40"]="hlp_estructura.htm";
hmContextIds["1000"]="hlp_zonasdeanalisis.htm";
hmContextIds["1100"]="hlp_zamif.htm";
hmContextIds["1110"]="hlp_definicionzamif.htm";
hmContextIds["1120"]="hlp_definicionlr.htm";
hmContextIds["1130"]="hlp_distancias.htm";
hmContextIds["1200"]="hlp_gdcf.htm";
hmContextIds["1210"]="hlp_dcf.htm";
hmContextIds["1220"]="hlp_dcflr.htm";
hmContextIds["1300"]="hlp_cph.htm";
hmContextIds["1310"]="hlp_cphlr.htm";
hmContextIds["2000"]="hlp_recursosnaturales.htm";
hmContextIds["2100"]="hlp_especies.htm";
hmContextIds["2110"]="hlp_definicionespecies.htm";
hmContextIds["2200"]="hlp_maderas.htm";
hmContextIds["2210"]="hlp_gfustal.htm";
hmContextIds["2220"]="hlp_fustal.htm";
hmContextIds["2230"]="hlp_dfustal.htm";
hmContextIds["2240"]="hlp_glatizal.htm";
hmContextIds["2250"]="hlp_latizal.htm";
hmContextIds["2260"]="hlp_dlatizal.htm";
hmContextIds["2270"]="hlp_gmontebravo.htm";
hmContextIds["2280"]="hlp_montebravo.htm";
hmContextIds["2290"]="hlp_dmontebravo.htm";
hmContextIds["2300"]="hlp_cambionetovalorrecursos.htm";
hmContextIds["2310"]="hlp_gcnvr.htm";
hmContextIds["2320"]="hlp_cnvr.htm";
hmContextIds["2330"]="hlp_dcnvr.htm";
hmContextIds["2340"]="hlp_cnvr_lr.htm";
hmContextIds["3000"]="hlp_mediosdecombate.htm";
hmContextIds["3100"]="hlp_cdr.htm";
hmContextIds["3200"]="hlp_dre.htm";
hmContextIds["3300"]="hlp_grupomedios.htm";
hmContextIds["3310"]="hlp_dgrupomedios.htm";
hmContextIds["3320"]="hlp_ratiosproduccion.htm";
hmContextIds["3400"]="hlp_dmedios.htm";
hmContextIds["4000"]="hlp_ejecucion.htm";
hmContextIds["4100"]="hlp_fdr.htm";
hmContextIds["4200"]="hlp_opcionesejecucion.htm";
hmContextIds["4210"]="hlp_dopciones.htm";
hmContextIds["4220"]="hlp_asignacionmedios.htm";
hmContextIds["4300"]="hlp_ejecucionsimulacion.htm";
