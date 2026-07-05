(function() {

var ANIM_MAP = {
    earthquake: function() {
        return '<div class="anim-earthquake"><div class="ground"></div>'
            + '<div class="crack"></div><div class="crack"></div>'
            + '<div class="crack"></div><div class="crack"></div></div>';
    },
    tsunami: function() {
        return '<div class="anim-tsunami">'
            + '<div class="wave"></div><div class="wave"></div><div class="wave"></div></div>';
    },
    wind: function() {
        return '<div class="anim-wind"><div class="planet-silhouette"></div>'
            + '<div class="wind-line"></div><div class="wind-line"></div>'
            + '<div class="wind-line"></div><div class="wind-line"></div></div>';
    },
    volcano: function() {
        return '<div class="anim-volcano"><div class="mountain"></div>'
            + '<div class="lava-particle"></div><div class="lava-particle"></div>'
            + '<div class="lava-particle"></div><div class="lava-particle"></div></div>';
    },
    solar: function() {
        var s = '<div class="anim-solar"><div class="sun-core"></div>';
        for (var i = 0; i < 8; i++) s += '<div class="flare"></div>';
        return s + '</div>';
    },
    dust: function() {
        var s = '<div class="anim-dust">';
        for (var i = 0; i < 10; i++) s += '<div class="dust-particle"></div>';
        return s + '</div>';
    },
    freeze: function() {
        var s = '<div class="anim-freeze">';
        for (var i = 0; i < 5; i++) s += '<div class="ice-crystal"></div>';
        return s + '</div>';
    },
    meteor: function() {
        return '<div class="anim-meteor"><div class="meteor"></div>'
            + '<div class="meteor"></div><div class="meteor"></div></div>';
    },
    vortex: function() {
        return '<div class="anim-vortex"><div class="vortex-ring"></div>'
            + '<div class="vortex-ring"></div><div class="vortex-ring"></div>'
            + '<div class="vortex-eye"></div></div>';
    },
    acid: function() {
        var s = '<div class="anim-acid">';
        for (var i = 0; i < 8; i++) s += '<div class="acid-drop"></div>';
        return s + '</div>';
    },
    radiation: function() {
        return '<div class="anim-radiation"><div class="rad-core"></div>'
            + '<div class="rad-ring"></div><div class="rad-ring"></div>'
            + '<div class="rad-ring"></div></div>';
    },
    diamond: function() {
        var s = '<div class="anim-diamond">';
        for (var i = 0; i < 7; i++) s += '<div class="gem"></div>';
        return s + '</div>';
    }
};

var DISASTER_DATA = {

    Mercury: [{name:'太阳风暴侵袭',desc:'猛烈的太阳耀斑和日冕物质抛射直击水星，表面温度骤升，外逸层原子被大量剥离。',source:'太阳影响',anim:'solar',rarity:'uncommon',danger:4,weight:30},{name:'极端温差崩裂',desc:'水星昼夜温差超过600°C，地表岩石在热胀冷缩中剧烈崩裂，形成新的叶状悬崖。',source:'自身灾害',anim:'earthquake',rarity:'common',danger:2,weight:50},{name:'陨石撞击风暴',desc:'无大气保护的水星遭受小型陨石群密集轰击，表面新增数百个撞击坑。',source:'外部撞击',anim:'meteor',rarity:'common',danger:3,weight:50},{name:'太阳引力共振撕裂',desc:'近日点附近太阳潮汐力达到峰值，引发水星内部构造应力释放，全球性地震。',source:'太阳影响',anim:'radiation',rarity:'rare',danger:4,weight:20}],

    Venus: [{name:'硫酸云暴',desc:'金星浓密的硫酸云层剧烈翻滚，全星球笼罩在腐蚀性酸雾之中，能见度降为零。',source:'自身灾害',anim:'acid',rarity:'common',danger:4,weight:50},{name:'温室效应失控',desc:'大气温室效应急剧恶化，表面温度飙升至500°C以上，地表岩石开始软化。',source:'自身灾害',anim:'vortex',rarity:'rare',danger:5,weight:20},{name:'超级火山喷发',desc:'金星地表冕状火山群同时喷发，熔岩洪流覆盖数百万平方公里，大气毒化加剧。',source:'自身灾害',anim:'volcano',rarity:'uncommon',danger:5,weight:30},{name:'太阳辐射穿透',desc:'太阳风异常强烈，穿透金星电离层，高能粒子直达大气中层，引发电离层崩塌。',source:'太阳影响',anim:'radiation',rarity:'uncommon',danger:3,weight:30}],

    Earth: [{name:'大地震',desc:'板块边界剧烈错动，里氏8.5级地震撕裂大地，城市坍塌，海床隆起。',source:'自身灾害',anim:'earthquake',rarity:'common',danger:4,weight:50},{name:'巨型海啸',desc:'海底地震引发百米巨浪，以每小时800公里的速度横扫大洋，吞噬沿岸一切。',source:'自身灾害',anim:'tsunami',rarity:'uncommon',danger:5,weight:30},{name:'超级火山喷发',desc:'黄石超级火山猛烈喷发，火山灰覆盖半个大陆，全球气温骤降，进入火山冬天。',source:'自身灾害',anim:'volcano',rarity:'rare',danger:5,weight:20},{name:'太阳耀斑电磁暴',desc:'X级太阳耀斑直击地球磁层，全球电网崩溃，卫星通讯中断，极光蔓延至赤道。',source:'太阳影响',anim:'solar',rarity:'uncommon',danger:3,weight:30}],

    Mars: [{name:'全球沙尘暴',desc:'火星表面风速骤升至每秒80米，红色沙尘遮蔽整个行星，持续数月不见天日。',source:'自身灾害',anim:'dust',rarity:'common',danger:2,weight:50},{name:'极地冰盖崩塌',desc:'火星南极冰盖大规模崩塌，释放巨量二氧化碳，短暂改变火星大气压。',source:'自身灾害',anim:'freeze',rarity:'uncommon',danger:3,weight:30},{name:'太阳风大气剥离',desc:'强烈太阳风暴冲击火星，缺乏磁层保护的火星大气被加速剥离到太空。',source:'太阳影响',anim:'radiation',rarity:'uncommon',danger:4,weight:30},{name:'塔尔西斯火山群复苏',desc:'沉睡了数亿年的奥林帕斯山区域出现岩浆活动迹象，火星地震频发。',source:'自身灾害',anim:'volcano',rarity:'rare',danger:4,weight:20}],

    Jupiter: [{name:'大红斑风暴强化',desc:'大红斑风速突破每小时700公里，直径急剧扩张，吞噬周围云带，持续数周。',source:'自身灾害',anim:'vortex',rarity:'common',danger:3,weight:50},{name:'彗星撞击事件',desc:'一颗舒梅克-列维级彗星撞入木星大气，释放相当于百万颗氢弹的能量，留下地球大小的疤痕。',source:'外部撞击',anim:'meteor',rarity:'rare',danger:5,weight:20},{name:'磁层超级亚暴',desc:'木星磁层发生剧烈能量释放，极光亮度暴增百倍，辐射带粒子密度达到致命水平。',source:'自身灾害',anim:'radiation',rarity:'uncommon',danger:4,weight:30},{name:'木星环粒子风暴',desc:'木星环中的带电尘埃被磁层加速至亚光速，形成环绕行星的致命粒子风暴。',source:'自身灾害',anim:'dust',rarity:'uncommon',danger:3,weight:30}],

    Saturn: [{name:'环内粒子风暴',desc:'土星环内冰晶颗粒受牧羊卫星引力扰动，形成环形粒子风暴，环结构剧烈变形。',source:'自身灾害',anim:'dust',rarity:'common',danger:2,weight:50},{name:'大白斑超级风暴',desc:'土星北半球爆发三十年一遇的大白斑，风暴眼直径超过地球，持续数月光照。',source:'自身灾害',anim:'vortex',rarity:'uncommon',danger:4,weight:30},{name:'卫星碎片环雨',desc:'土星环物质受引力扰动加速坠入大气，形成持续数日的壮观环雨现象。',source:'自身灾害',anim:'meteor',rarity:'common',danger:3,weight:50},{name:'六边形风暴异变',desc:'北极六边形风暴几何结构突然紊乱，风速突破每小时1800公里，颜色转为深红。',source:'自身灾害',anim:'vortex',rarity:'rare',danger:4,weight:20}],

    Uranus: [{name:'极夜超级寒潮',desc:'天王星极夜半球温度跌破-224°C，大气甲烷凝结成冰晶，形成史无前例的极寒区域。',source:'自身灾害',anim:'freeze',rarity:'common',danger:3,weight:50},{name:'甲烷云超级风暴',desc:'天王星大气中甲烷云层剧烈对流，风速达到每秒400米，蓝绿色云层被撕裂。',source:'自身灾害',anim:'wind',rarity:'uncommon',danger:3,weight:30},{name:'磁层螺旋扭曲',desc:'天王星倾斜的磁层与太阳风剧烈作用，磁尾呈螺旋状扭曲，辐射带粒子暴增。',source:'太阳影响',anim:'radiation',rarity:'rare',danger:4,weight:20},{name:'环系统碎裂',desc:'天王星暗环中的牧羊卫星轨道失稳，环内碎块相互碰撞，产生新的尘埃环。',source:'自身灾害',anim:'dust',rarity:'uncommon',danger:2,weight:30}],

    Neptune: [{name:'大暗斑超级风暴',desc:'海王星大气中形成新的地球大小的暗斑风暴，风速突破每小时2100公里，接近超音速。',source:'自身灾害',anim:'vortex',rarity:'common',danger:4,weight:50},{name:'超音速风切变',desc:'海王星赤道区域风速达到每秒600米的极端值，是太阳系最快的风，撕裂一切云层结构。',source:'自身灾害',anim:'wind',rarity:'uncommon',danger:5,weight:30},{name:'钻石雨风暴',desc:'海王星幔层中的甲烷在极端压力下分解，碳原子凝结为钻石晶体，如雨般坠向核心。',source:'自身灾害',anim:'diamond',rarity:'rare',danger:2,weight:20},{name:'海卫一逆行扰动',desc:'海卫一的逆行轨道引发剧烈潮汐力，海王星内部加热异常，大气活动空前激烈。',source:'卫星影响',anim:'radiation',rarity:'rare',danger:3,weight:20}]
};

var RARITY_CN = { common:'普通', uncommon:'罕见', rare:'稀有', legendary:'传说' };

function dangerLabel(n) {
    return {1:'低危',2:'中危',3:'高危',4:'极高危',5:'灭世级'}[n] || '未知';
}
function dangerCSS(n) {
    return n >= 5 ? 'danger-extreme' : n >= 4 ? 'danger-high' : 'danger-medium';
}
function renderStars(n) {
    var s = '';
    for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= n ? 'star-on' : 'star-off') + '">★</span>';
    return s;
}

function pickDisaster(planetName) {
    var list = DISASTER_DATA[planetName];
    if (!list || !list.length) return null;
    var tw = 0, i;
    for (i = 0; i < list.length; i++) tw += list[i].weight;
    var r = Math.random() * tw, acc = 0;
    for (i = 0; i < list.length; i++) {
        acc += list[i].weight;
        if (r <= acc) return list[i];
    }
    return list[list.length - 1];
}

var _timer = null, _overlay = null;

function dismiss() {
    if (_timer) { clearTimeout(_timer); _timer = null; }
    if (_overlay && _overlay.parentNode) {
        _overlay.parentNode.removeChild(_overlay);
        _overlay = null;
    }
}

function showDisaster(planetName) {
    dismiss();
    if (Math.random() > 0.3) return;

    var d = pickDisaster(planetName);
    if (!d) return;

    var animHTML = (ANIM_MAP[d.anim] || ANIM_MAP['vortex'])();
    var dc = dangerCSS(d.danger);

    var ov = document.createElement('div');
    ov.className = 'disaster-overlay';
    ov.innerHTML = '<div class="disaster-panel">'
        + '<div class="disaster-anim">' + animHTML + '</div>'
        + '<h2 class="disaster-title ' + dc + '">⚠ ' + d.name + '</h2>'
        + '<p class="disaster-desc">' + d.desc + '</p>'
        + '<div class="disaster-attrs">'
        + '<span class="rarity-badge ' + d.rarity + '">◆ ' + (RARITY_CN[d.rarity] || d.rarity) + '</span>'
        + '<span style="color:#cbb8b8;font-size:12px;">来源：' + d.source + '</span>'
        + '<span class="danger-stars" title="危险等级：' + dangerLabel(d.danger) + '">' + renderStars(d.danger) + '</span>'
        + '</div>'
        + '<div class="disaster-timer"><div class="disaster-timer-fill"></div></div>'
        + '<p class="disaster-skip-hint">点击任意位置可提前关闭 · ' + dangerLabel(d.danger) + '灾害</p>'
        + '</div>';

    ov.addEventListener('click', function(e) {
        if (e.target === ov || e.target.closest('.disaster-panel')) dismiss();
    });

    document.body.appendChild(ov);
    _overlay = ov;
    _timer = setTimeout(dismiss, 10000); // 10s 自动关闭

}

window.PlanetDisaster = {
    trigger: showDisaster,
    dismiss: dismiss,
    getDisasters: function(p) { return DISASTER_DATA[p] || []; }
};

})();



