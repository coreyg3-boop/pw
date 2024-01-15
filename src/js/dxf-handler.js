const convertDXFToOmaxColors = (svgContainer, data) => {

    const svgDiv = document.createElement('div');

    var svg = (new XMLSerializer()).serializeToString(svgContainer);
    var DOMURL = window.URL || window.webkitURL || window;

    const searchBG = '<g stroke="#000000" stroke-width="0.1%" fill="none" transform="matrix(1,0,0,-1,0,0)">';
    const replaceWithBG = '<g stroke="#000000" stroke-width="0.1%" fill="none" transform="matrix(1,0,0,-1,0,0)"> <g fill="black" stroke="black" stroke-width="1"> <rect x="0" y="0" width="100" height="100" style="fill:black;stroke:black;stroke-width:1;fill-opacity:1;stroke-opacity:1" /> </g>';
    const resultBG = svg.split(searchBG).join(replaceWithBG);
    const search1 = 'stroke="rgb(255, 0, 0)"';
    const replaceWith1 = 'stroke="rgb(255, 0, 0)" stroke-width="0.3%" class="quality1"';
    const result1 = resultBG.split(search1).join(replaceWith1);
    const search2 = 'stroke="rgb(255, 255, 0)"';
    const replaceWith2 = 'stroke="rgb(255, 0, 120)" stroke-width="0.3%" class="quality2"';
    const result2 = result1.split(search2).join(replaceWith2);
    const search3 = 'stroke="rgb(0, 255, 0)"';
    const replaceWith3 = 'stroke="rgb(128, 0, 128)" stroke-width="0.3%" class="quality3"';
    const result3 = result2.split(search3).join(replaceWith3);
    const search4 = 'stroke="rgb(0, 255, 255)"';
    const replaceWith4 = 'stroke="rgb(0, 255, 255)" stroke-width="0.3%" class="quality4"';
    const result4 = result3.split(search4).join(replaceWith4);
    const search5 = 'stroke="rgb(12, 12, 12)"';
    const replaceWith5 = 'stroke="rgb(0, 0, 255)" stroke-width="0.3%" class="quality5"';
    const result5 = result4.split(search5).join(replaceWith5);
    const searchTraverse = 'stroke="rgb(0, 0, 0)"';
    const replaceWithTraverse = 'stroke="rgb(0, 255, 0)" stroke-width="0.3%" class="qualityTraverse"';
    const resultTraverse = result5.split(searchTraverse).join(replaceWithTraverse);
    const searchHeadsUpTraverse = 'stroke="rgb(10, 10, 10)"';
    const replaceWithHeadsUpTraverse = 'stroke="rgb(10, 10, 10)" stroke-width="0.3%" class="qualityHeadsUpTraverse"';
    const resultHeadsUpTraverse = resultTraverse.split(searchHeadsUpTraverse).join(replaceWithHeadsUpTraverse);
    const searchLeads = 'stroke="rgb(128, 128, 128)"';
    const replaceWithLeads = 'stroke="rgb(255, 150, 0)" stroke-width="0.3%" class="qualityLeads"';
    const resultLeads = resultHeadsUpTraverse.split(searchLeads).join(replaceWithLeads);
    const searchScribe = 'stroke="rgb(10, 10, 10)"';
    const replaceWithScribe = 'stroke="rgb(10, 10, 10)" stroke-width="0.3%" class="qualityScribe"';
    const resultScribe = resultLeads.split(searchScribe).join(replaceWithScribe);
    const searchWaterOnly = 'stroke="rgb(10, 10, 10)"';
    const replaceWithWaterOnly = 'stroke="rgb(10, 10, 10)" stroke-width="0.3%" class="qualityWaterOnly"';
    const resultWaterOnly = resultScribe.split(searchWaterOnly).join(replaceWithWaterOnly);
    console.log(resultWaterOnly);
    console.log(svg);

    svgDiv.innerHTML += resultWaterOnly;

    return svgDiv;
}

export { convertDXFToOmaxColors }