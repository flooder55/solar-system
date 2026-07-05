function createPanelHTML() {
    var html = '';

    html += '<div class="panel-left" id="panel-left">';
    html += '  <div class="planet-hero">';
    html += '    <img id="planet-image" src="" alt="行星">';
    html += '    <div class="planet-hero-copy">';
    html += '      <p id="planet-subtitle"></p>';
    html += '      <h1 id="planet-name"></h1>';
    html += '    </div>';
    html += '  </div>';
    html += '  <h2 class="panel-title">基本属性</h2>';
    html += '  <div class="props-grid" id="props-grid"></div>';
    html += '</div>';

    html += '<div class="panel-right" id="panel-right">';
    html += '  <div class="knowledge-head">';
    html += '    <h2>知识点快记</h2>';
    html += '    <button class="refresh-btn" id="refresh-btn" type="button">↻</button>';
    html += '  </div>';
    html += '  <div class="fact-grid" id="fact-grid"></div>';
    html += '</div>';

    html += '<div class="planet-buttons" id="planet-buttons">';
    html += '  <button class="planet-btn" data-planet="Mercury">Mercury<small>水星</small></button>';
    html += '  <button class="planet-btn" data-planet="Venus">Venus<small>金星</small></button>';
    html += '  <button class="planet-btn" data-planet="Earth">Earth<small>地球</small></button>';
    html += '  <button class="planet-btn" data-planet="Mars">Mars<small>火星</small></button>';
    html += '  <button class="planet-btn" data-planet="Jupiter">Jupiter<small>木星</small></button>';
    html += '  <button class="planet-btn" data-planet="Saturn">Saturn<small>土星</small></button>';
    html += '  <button class="planet-btn" data-planet="Uranus">Uranus<small>天王星</small></button>';
    html += '  <button class="planet-btn" data-planet="Neptune">Neptune<small>海王星</small></button>';
    html += '</div>';

    document.body.insertAdjacentHTML('beforeend', html);
}

var planetMeta = {
    Mercury:  {cn:'水星',sub:'INNER PLANET · MERCURY',img:'images/pia15162-mercury-basins-messenger-16x9-1.webp'},
    Venus:    {cn:'金星',sub:'INNER PLANET · VENUS',  img:'images/venus-mariner-10-pia23791-fig2-16x9-1.webp'},
    Earth:    {cn:'地球',sub:'INNER PLANET · EARTH',  img:'images/blue-marble-apollo-17-16x9-1.webp'},
    Mars:     {cn:'火星',sub:'INNER PLANET · MARS',   img:'images/mars-full-globe-16x9-1.webp'},
    Jupiter:  {cn:'木星',sub:'GIANT PLANET · JUPITER',img:'images/jupiter-marble-pia22946-16x9-1.webp'},
    Saturn:   {cn:'土星',sub:'RINGED GIANT · SATURN', img:'images/saturn-farewell-pia21345-sse-banner-1920x640-1.webp'},
    Uranus:   {cn:'天王星',sub:'ICE GIANT · URANUS',   img:'images/uranus-pia18182-16x9-1.webp'},
    Neptune:  {cn:'海王星',sub:'ICE GIANT · NEPTUNE',  img:'images/pia01492-neptune-full-disk-16x9-1.webp'}
};

var planetProps = {
    Mercury: [['直径','4,880 km'],['质量','3.30×10²³ kg'],['日距','57.9M km'],['重力','0.38 g']],
    Venus:   [['直径','12,104 km'],['质量','4.87×10²⁴ kg'],['日距','108.2M km'],['重力','0.91 g']],
    Earth:   [['直径','12,742 km'],['质量','5.97×10²⁴ kg'],['日距','149.6M km'],['重力','1.00 g']],
    Mars:    [['直径','6,779 km'],['质量','6.42×10²³ kg'],['日距','227.9M km'],['重力','0.38 g']],
    Jupiter: [['直径','139,820 km'],['质量','1.90×10²⁷ kg'],['日距','778.6M km'],['重力','2.53 g']],
    Saturn:  [['直径','116,460 km'],['质量','5.68×10²⁶ kg'],['日距','1.43B km'],['重力','1.07 g']],
    Uranus:  [['直径','50,724 km'],['质量','8.68×10²⁵ kg'],['日距','2.87B km'],['重力','0.89 g']],
    Neptune: [['直径','49,244 km'],['质量','1.02×10²⁶ kg'],['日距','4.50B km'],['重力','1.14 g']]
};

var currentPlanet = null;

function getRandomFacts(arr, n) {
    var a = [];
    for (var i = 0; i < arr.length; i++) {
        a[i] = arr[i];
    }
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
    var result = [];
    for (var i = 0; i < n && i < a.length; i++) {
        result[i] = a[i];
    }
    return result;
}

function showPlanetPanel(planet) {
    var meta = planetMeta[planet];
    if (!meta) meta = planetMeta['Mercury'];

    document.getElementById('planet-image').src = meta.img;
    document.getElementById('planet-image').alt = meta.cn;
    document.getElementById('planet-subtitle').innerHTML = meta.sub;
    document.getElementById('planet-name').innerHTML = meta.cn;

    var props = planetProps[planet] || [];
    var propsHTML = '';
    for (var i = 0; i < props.length; i++) {
        propsHTML += '<div class="prop-card">';
        propsHTML += '  <span class="prop-label">' + props[i][0] + '</span>';
        propsHTML += '  <span class="prop-value">' + props[i][1] + '</span>';
        propsHTML += '</div>';
    }
    document.getElementById('props-grid').innerHTML = propsHTML;

    var facts = [];
    if (window.planetKnowledge && window.planetKnowledge[planet]) {
        facts = window.planetKnowledge[planet];
    }
    var picks = getRandomFacts(facts, 4);
    var factHTML = '';
    for (var i = 0; i < picks.length; i++) {
        factHTML += '<div class="fact-card">';
        factHTML += '  <span class="fact-index">' + (i + 1) + '</span>';
        factHTML += '  <p>' + picks[i] + '</p>';
        factHTML += '</div>';
    }
    document.getElementById('fact-grid').innerHTML = factHTML;

    currentPlanet = planet;
}

function openPanel(planet) {
    showPlanetPanel(planet);
    document.getElementById('panel-left').style.display = 'block';
    document.getElementById('panel-right').style.display = 'block';

    var btns = document.getElementsByClassName('planet-btn');
    for (var i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('data-planet') === planet) {
            btns[i].classList.add('active');
        } else {
            btns[i].classList.remove('active');
        }
    }

    if (window.PlanetDisaster && window.PlanetDisaster.trigger) {
        window.PlanetDisaster.trigger(planet);
    }
}

function closePanel() {
    document.getElementById('panel-left').style.display = 'none';
    document.getElementById('panel-right').style.display = 'none';

    var btns = document.getElementsByClassName('planet-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }

    currentPlanet = null;
    if (window.PlanetDisaster && window.PlanetDisaster.dismiss) {
        window.PlanetDisaster.dismiss();
    }
}

createPanelHTML();

var btns = document.getElementsByClassName('planet-btn');
for (var i = 0; i < btns.length; i++) {
    btns[i].onclick = function() {
        var planet = this.getAttribute('data-planet');

        // 点击切换
        if (currentPlanet === planet) {
            closePanel();
        } else {
            openPanel(planet);
        }
    };
}

document.getElementById('refresh-btn').onclick = function() {
    if (currentPlanet) {
        showPlanetPanel(currentPlanet);
    }
};




