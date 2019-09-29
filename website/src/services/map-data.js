export function getMapSvgsForId(mapId) {
  return maps[mapId] || [];
}

const maps = {
  // Azeroth
  947: [
    {
      coordinates: "M182,577L193,573L201,570L210,547L218,548L222,545L234,550L240,552L250,555L258,556L268,558L272,555L280,565L289,566L299,556L302,547L304,537L305,529L314,523L320,515L322,507L312,498L311,484L309,481L312,474L312,467L307,460L311,445L309,443L311,428L305,420L306,413L301,406L300,398L297,389L302,389L308,399L317,393L316,384L310,380L303,384L296,383L294,378L287,378L287,374L290,371L299,372L300,367L299,364L292,364L290,360L300,361L306,360L313,369L322,370L323,364L328,360L328,354L329,344L328,340L323,341L319,342L318,334L317,313.00000762939453L318,302.00000762939453L313,296.00000762939453L315,291.00000762939453L322,288.00000762939453L326,284.00000762939453L335,285.00000762939453L342,285.00000762939453L354,284.00000762939453L363,280.00000762939453L364,275.00000762939453L362,268.00000762939453L350,264.00000762939453L343,263.00000762939453L336,259.00000762939453L331,253.00000762939453L331,248.00000762939453L331,245.00000762939453L339,238.00000762939453L346,237.00000762939453L352,245.00000762939453L360,249.00000762939453L364,245.00000762939453L368,240.00000762939453L375,241.00000762939453L378,236.00000762939453L378,228.00000762939453L374,221.00000762939453L369,215.00000762939453L362,211.00000762939453L352,210.00000762939453L345,212.00000762939453L339,214.00000762939453L335,214.00000762939453L331,213.00000762939453L327,215.00000762939453L324,215.00000762939453L326,210.00000762939453L333,205.00000762939453L335,199.00000762939453L336,190.00000762939453L333,183.00000762939453L329,178.00000762939453L328,174.00000762939453L332,168.00000762939453L336,158.00000762939453L338,149.00000762939453L333,144.00000762939453L326,141.00000762939453L320,140.00000762939453L316,134.00000762939453L306,129.00000762939453L300,125L293,120L284,120L277,122L271,125L263,124L258,129L250,130L244,133L205,101L201,89L194,78L182,73L173,72L163,72L154,71L144,79L137,88L129,90L126,99L128,112L133,123L140,130L150,138L159,137L171,140L179,141L191,160L186,165L183,176L181,192L181,207L179,220L171,228L164,234L171,243L167,250L159,253L150,252L140,254L134,257L129,262L125,272L128,280L136,287L140,298L144,307L143,319L140,328L136,335L128,342L125,347L123,360L124,369L120,376L123,386L121,397L121,409L122,419L115,423L108,430L109,444L105,450L107,464L110,474L117,486L126,486L132,485L134,492L131,498L127,507L124,517L132,524L127,532L125,541L129,552L134,564L137,573L147,576L154,575L161,572L169,574L177,578Z",
      goesTo: 1414 // Kalimdor
    }, {
      coordinates: "M732,563L743,561L749,552L744,543L738,541L741,535L746,529L759,527L773,523L787,518L804,511L813,505L823,500L826,484L823,475L832,468L836,458L835,447L827,440L826,437L830,436L844,440L851,432L850,420L844,415L847,407L852,389L849,375L844,365L849,352L855,342L862,333L861,322L851,317L847,313L840,303L837,288L828,279L828,268L835,262L834,253L842,242L842,232L844,220L842,211L847,208L861,202L876,195L879,187L874,172L877,162L882,154L878,145L882,139L892,139L898,136L899,126L905,117L908,107L904,95L906,90L914,85L910,74L907,65L900,56L891,52L879,50L874,52L863,50L854,55L849,73L850,83L846,89L839,99L835,107L826,107L817,115L806,118L795,124L773,134L750,143L732,150L726,148L719,145L714,147L704,145L701,155L696,161L689,156L677,162L666,170L667,186L675,193L683,198L685,211L688,227L686,238L681,252L677,262L683,275L689,286L699,289L707,282L711,276L711,269L712,263L709,260L714,256L725,258L729,251L740,249L747,248L758,260L766,269L767,277L761,279L755,278L749,290L746,299L743,303L745,311L740,316L733,312L728,309L720,312L710,317L703,314L695,316L689,320L685,323L684,334L688,345L696,351L700,362L699,373L696,384L692,392L696,405L702,416L706,428L704,433L696,435L690,442L682,451L683,462L686,474L692,482L701,487L708,495L715,501L722,499L726,506L721,507L719,517L713,516L713,524L715,534L713,539L713,545L715,554L722,561L731,562Z",
      goesTo: 1415 // Eastern Kingdoms
    }
  ],

  // Kalimdor
  1414: [
    {
      coordinates: "M582,378L593,382L601,384L606,397L615,395L615,388L622,383L622,376L625,367L620,361L613,362L609,346L609,333L606,317L602,311L602,307L600,306L604,302L607,297L611,293L603,287L594,285L588,288L583,290L578,288L574,294L569,299L569,304L572,314L568,321L566,334L567,349L571,361L575,373Z",
      goesTo: 1411 // Durotar
    }, {
      coordinates: "M568,301L577,289L587,288L595,283L620,292L642,294L661,290L663,278L656,268L644,262L639,252L640,240L650,242L657,251L669,245L671,236L680,239L685,226L680,215L669,209L655,206L641,209L630,209L619,210L608,222L600,237L590,243L575,246L576,263L569,273L565,288Z",
      goesTo: 1447 // Azshara
    }, {
      coordinates: "M574,244L585,241L597,237L608,218L621,206L632,182L628,170L622,163L630,148L635,135L632,125L622,117L614,116L605,110L600,107L589,112L579,115L568,114L557,120L556,124L558,137L555,145L548,152L540,153L531,152L522,152L524,164L527,175L523,181L524,186L533,185L544,181L555,182L566,185L575,191L580,200L581,209L576,216L569,224L572,234Z",
      goesTo: 1452 // Winterspring
    }, {
      coordinates: "M523.0000305175781,152L533.0000305175781,153L545.0000305175781,153L555.0000305175781,147L558.0000305175781,137L556.0000305175781,129L554.0000305175781,122L561.0000305175781,118L569.0000305175781,114L582.0000305175781,113L593.0000305175781,107L587.0000305175781,100L576.0000305175781,95L565.0000305175781,95L554.0000305175781,100L541.0000305175781,104L531.0000305175781,107L522.0000305175781,111L518.0000305175781,111L518.0000305175781,123L516.0000305175781,137L521.0000305175781,151Z",
      goesTo: 1450 // Moonglade
    }, {
      coordinates: "M481.0000305175781,246L490.0000305175781,255L500.0000305175781,256L512.0000305175781,255L516.0000305175781,252L516.0000305175781,240L506.0000305175781,235L498.0000305175781,230L496.0000305175781,222L492.0000305175781,212L493.0000305175781,203L499.0000305175781,196L509.0000305175781,190L523.0000305175781,185L525.0000305175781,176L527.0000305175781,170L524.0000305175781,164L521.0000305175781,153L512.0000305175781,153L505.0000305175781,153L498.0000305175781,157L491.0000305175781,156L486.0000305175781,162L476.0000305175781,171L473.0000305175781,183L469.0000305175781,199L472.0000305175781,209L469.0000305175781,219L468.0000305175781,228L470.0000305175781,238L480.0000305175781,242Z",
      goesTo: 1448 // Felwood
    }, {
      coordinates: "M435,242L447,239L454,233L466,229L472,211L469,201L471,187L475,169L492,156L500,156L518,154L521,151L517,138L516,114L497,124L484,132L475,141L458,142L451,155L439,153L434,178L443,179L443,196L437,201L440,211L439,222L430,229L424,234L428,242Z",
      goesTo: 1439 // Darkshore
    }, {
      coordinates: "M406,118L420,116L435,117L449,111L464,99L470,88L473,69L469,61L466,49L453,40L447,36L439,36L419,32L406,33L397,43L391,50L384,60L378,74L380,89L390,100L396,111Z",
      goesTo: 1438 // Teldrassil
    }, {
      coordinates: "M515,317L524,312L535,312L539,306L551,304L564,295L562,285L566,275L572,265L574,254L571,239L561,253L550,264L539,263L529,266L520,262L515,257L505,254L494,257L484,251L478,241L470,238L467,229L461,232L452,236L443,241L436,241L431,253L423,260L429,267L437,275L444,284L447,293L460,300L472,302L481,301L491,309L501,312Z",
      goesTo: 1440 // Ashenvale
    }, {
      coordinates: "M469,360L481,359L493,355L495,346L491,338L487,333L488,318L489,306L481,300L471,301L462,301L451,295L446,291L443,279L437,274L429,267L420,259L412,252L399,254L385,261L377,273L379,285L390,297L398,314L395,325L400,343L414,339L425,339L430,336L441,338L450,345L455,357Z",
      goesTo: 1442 // Stonetalon
    }, {
      coordinates: "M541,489L548,484L532,467L536,453L530,446L536,446L534,444L537,421L548,408L558,414L569,411L576,405L575,397L586,398L589,390L579,388L572,368L566,348L565,333L569,319L568,301L560,295L551,304L539,305L535,312L526,311L520,316L514,318L508,314L502,314L496,308L491,309L488,331L496,340L494,350L490,356L483,357L491,369L498,372L497,383L497,396L506,406L507,419L504,425L494,425L493,434L495,442L490,447L490,455L496,459L498,468L504,474L513,471L521,481L529,485Z",
      goesTo: 1413 // Stonetalon
    }, {
      coordinates: "M478,455L489,453L488,447L494,441L492,433L496,425L505,424L507,417L505,406L498,399L495,389L498,380L497,371L491,370L484,358L477,360L455,357L448,372L448,383L454,390L451,396L455,407L453,417L453,428L456,439L459,449L475,454Z",
      goesTo: 1412 // Stonetalon
    }, {
      coordinates: "M386,418L400,414L413,413L429,418L436,422L452,418L454,408L451,399L453,388L448,381L448,371L454,359L454,352L446,342L431,337L420,339L409,340L404,351L401,355L395,357L396,367L384,368L380,384L378,394L384,402L378,408L380,417Z",
      goesTo: 1443 // Desolace
    }, {
      coordinates: "M405,529L409,515L418,511L429,513L440,509L459,508L482,508L480,485L488,460L489,453L475,456L457,447L454,431L453,414L436,421L421,416L407,413L392,417L376,419L375,438L380,458L370,463L360,465L360,482L359,497L360,513L364,532L372,539L389,531Z",
      goesTo: 1444 // Feralas
    }, {
      coordinates: "M566,491L577,489L580,476L587,468L599,465L601,450L592,444L589,436L591,429L603,432L609,421L609,411L599,408L591,414L587,415L585,407L577,406L567,411L561,413L548,407L537,420L531,447L535,454L533,464L540,474L548,485Z",
      goesTo: 1445 // Dustwallow
    }, {
      coordinates: "M521,516L534,511L549,515L553,528L565,537L593,527L601,522L597,506L604,489L601,483L602,473L600,465L579,473L577,490L565,491L548,484L541,488L525,484L511,471L504,472L496,464L496,456L489,455L484,474L481,490L483,509L503,509Z",
      goesTo: 1441 // 1k
    }, {
      coordinates: "M539,624L554,623L570,637L586,628L589,612L589,610L595,602L594,594L601,588L606,580L617,566L613,559L603,555L601,527L589,527L567,534L553,529L553,517L544,512L532,511L524,514L530,527L535,536L533,556L521,574L513,574L515,590L507,605L507,612L533,625Z",
      goesTo: 1446 // Tanaris
    }, {
      coordinates: "M468,626L477,611L493,606L505,609L515,592L514,573L525,568L533,552L532,531L525,522L523,515L488,507L476,522L468,535L469,572L463,579L466,610Z",
      goesTo: 1449 // Un'goro
    }, {
      coordinates: "M409,646L424,642L441,650L464,641L467,620L464,577L468,574L468,552L467,534L490,509L461,507L440,509L432,514L419,511L409,515L404,530L396,530L386,551L377,565L377,577L385,584L377,596L380,613L382,629L390,640L400,648Z",
      goesTo: 1451 // Silithus
    }
  ],

  // Eastern Kingdoms
  1415: [
    {
      coordinates: "M530,188L557,185L564,177L580,175L589,180L627,179L631,166L621,148L618,129L604,120L601,109L588,111L581,115L537,112L533,122L521,128L527,142L530,162L541,170L539,181Z",
      goesTo: 1423 // Eastern Plaguelands
    }, {
      coordinates: "M500,178L511,172L521,181L533,184L540,177L536,169L529,166L529,150L524,142L520,129L516,124L516,116L508,104L494,110L489,129L493,147L481,160L481,172L494,178Z",
      goesTo: 1422 // Western Plaguelands
    }, {
      coordinates: "M382,176L411,168L432,168L476,172L480,160L493,152L492,134L489,132L497,107L476,111L464,123L448,123L440,118L418,121L411,135L400,130L386,135L372,143L367,155L371,167Z",
      goesTo: 1420 // Tirisfal
    }, {
      coordinates: "M389,238L411,242L422,239L431,244L434,232L448,224L440,202L447,198L461,183L457,173L440,171L428,168L411,168L389,179L398,191L396,208L401,224Z",
      goesTo: 1421 // Silverpine
    }, {
      coordinates: "M447,220L456,214L466,220L476,214L487,203L494,211L510,208L506,197L517,188L510,180L503,177L494,182L477,173L457,173L464,180L455,192L441,201L441,211L444,221Z",
      goesTo: 1416 // Alterac
    }, {
      coordinates: "M457,248L471,243L480,253L491,263L499,257L497,243L507,229L513,220L508,210L493,209L490,203L482,205L470,217L461,220L457,215L448,220L447,227L434,232L432,242L432,255L443,257L448,248Z",
      goesTo: 1424 // Hillsbrad
    }, {
      coordinates: "M524,225L539,233L547,228L560,227L570,240L582,243L593,232L592,222L594,207L603,191L624,185L621,177L587,180L578,175L557,181L542,188L524,186L520,185L506,198L510,220Z",
      goesTo: 1425 // Hinterlands
    }, {
      coordinates: "M526,281L549,280L567,278L578,270L582,252L582,243L570,239L563,228L547,227L541,232L513,221L502,239L497,257L498,270L506,279L519,282Z",
      goesTo: 1417 // Arathi
    }, {
      coordinates: "M529,342.00000762939453L550,340.00000762939453L563,342.00000762939453L571,333.00000762939453L576,329.00000762939453L577,318.00000762939453L569,307.00000762939453L563,308.00000762939453L546,297.00000762939453L540,282.00000762939453L507,279.00000762939453L497,286.00000762939453L488,285.00000762939453L478,303.00000762939453L472,316.00000762939453L478,328.00000762939453L492,332.00000762939453L506,330.00000762939453L517,338.00000762939453Z",
      goesTo: 1437 // Wetlands
    }, {
      coordinates: "M442,422L463,412L462,402L471,396L485,397L494,390L512,388L523,388L532,368L527,357L523,345L525,341L516,338L511,331L500,331L493,332L479,332L471,329L463,333L454,326L444,324L436,328L425,336L416,331L407,332L396,337L392,351L400,365L405,369L404,375L411,383L409,390L416,398L413,410L428,417L438,423Z",
      goesTo: 1426 // Dun Morogh
    }, {
      coordinates: "M522,389L533,388L549,382L563,388L578,388L583,374L585,360L580,356L580,348L564,339L545,340L527,342L523,345L527,360L530,370L525,379Z",
      goesTo: 1432 // Loch Modan
    }, {
      coordinates: "M513,421L524,423L533,421L557,429L570,426L583,426L595,417L588,398L588,392L574,390L555,386L550,382L541,386L528,390L521,390L512,397L514,409L512,420Z",
      goesTo: 1418 // Badlands
    }, {
      coordinates: "M463,418L479,422L491,427L508,426L514,424L513,409L511,397L520,390L512,387L503,388L494,389L486,396L472,397L463,402L463,413Z",
      goesTo: 1427 // Searing Gorge
    }, {
      coordinates: "M479,455L495,457L506,461L524,456L535,461L544,458L548,445L549,435L543,425L534,421L522,424L504,425L488,426L479,423L470,420L463,419L455,442L465,438L471,448Z",
      goesTo: 1428 // Burning Steppes
    }, {
      coordinates: "M435,503L445,500L456,501L469,494L484,496L499,496L505,491L503,483L503,459L495,457L477,455L472,452L469,439L460,440L454,442L450,446L445,446L440,443L432,445L424,452L417,457L420,473L429,488Z",
      goesTo: 1429 // Elwynn Forest
    }, {
      coordinates: "M502,496L511,501L521,499L528,495L538,496L546,499L566,488L571,485L571,483L586,485L599,491L606,480L605,465L598,458L584,455L565,454L554,458L545,456L537,461L528,458L524,455L513,460L505,460L504,480L508,489Z",
      goesTo: 1433 // Redridge
    }, {
      coordinates: "M451,573L462,568L468,553L463,544L450,539L445,530L440,524L436,510L434,495L425,484L413,481L401,491L391,502L391,518L396,533L413,545L415,553L424,553L426,561L436,560L441,559L444,569Z",
      goesTo: 1436 // Westfall
    }, {
      coordinates: "M456,540L472,535L494,533L501,530L498,518L499,496L480,497L469,496L457,501L450,502L445,500L436,505L439,519L442,528L449,538Z",
      goesTo: 1431 // Duskwood
    }, {
      coordinates: "M517,543L519,538L524,529L523,517L523,508L518,500L507,500L504,499L501,495L497,498L499,508L497,516L500,530L512,535Z",
      goesTo: 1430 // Deadwind
    }, {
      coordinates: "M525,521L534,516L548,516L560,521L568,528L577,526L581,506L575,494L566,488L545,499L532,494L518,499L523,507L522,517Z",
      goesTo: 1435 // Swamp of Sorrows
    }, {
      coordinates: "M445,645L453,641L470,638L470,619L459,621L462,609L471,603L473,598L484,599L506,593L517,586L516,567L516,558L516,540L514,536L501,532L489,535L472,537L463,540L469,552L465,564L459,572L453,575L444,576L438,579L437,585L433,583L429,597L433,605L428,616L433,629L441,641Z",
      goesTo: 1434 // Stranglethorn
    }, {
      coordinates: "M522,582L536,582L547,581L549,573L562,568L569,558L571,543L568,529L561,522L546,516L527,521L522,534L516,541L516,559L516,580Z",
      goesTo: 1419 // Blasted Lands
    }
  ],

  // Mulgore
  1412: [
    {
      coordinates: "M420,240L436,223L427,203L438,189L471,164L474,136L446,128L422,134L396,127L376,136L356,113L331,120L324,138L338,160L351,164L358,181L347,192L356,212L389,214L399,232Z",
      goesTo: 1456 // TB
    }
  ],

  // Durotar
  1411: [
    {
      coordinates: "M435,87L466,84L484,77L480,42L447,44L428,48L428,80Z",
      goesTo: 1454 // Org
    }
  ],

  // Tirisfal
  1420: [
    {
      coordinates: "M614,557L642,551L667,529L674,475L674,445L662,432L620,431L594,433L567,441L563,475L564,512L574,527L590,548Z",
      goesTo: 1458 // UC
    }
  ],

  // Elwynn
  1429: [
    {
      coordinates: "M307,354L337,336L362,319L351,284L331,267L324,230L316,220L334,214L356,205L347,180L335,156L275,152L248,159L223,186L195,197L175,176L156,176L149,155L138,195L132,216L127,243L139,257L136,269L158,280L155,307L176,311L196,302L236,306L264,308L286,340Z",
      goesTo: 1453 // SW
    }
  ],

  // Dun Morogh
  1426: [
    {
      coordinates: "M534,248L553,242L582,238L592,218L586,191L568,176L538,180L504,195L504,225Z",
      goesTo: 1455 // IF
    }
  ],

  // Teldrassil
  1438: [
    {
      coordinates: "M337,423L350,371L337,324L307,280L277,274L252,290L219,317L209,328L208,379L211,421L216,441L262,448L315,434Z",
      goesTo: 1457 // Darnassus
    }
  ],
};
