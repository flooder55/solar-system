var
    scene,
    cam,
    rdr,
    sun,
    fld,
    orbs = [],
    texL = new THREE.TextureLoader();

// 行星数据
var planets = [
    ["Mercury", .38,  8, 4.2, .018, "textures/2k_mercury.jpg", 0xa8a838],
    ["Venus",   .85, 11, 1.6, .014, "textures/2k_venus_surface.jpg", 0xf4a060],
    ["Earth",   .95, 15,   1, .028, "textures/2k_earth_daymap.jpg", 0x4090ff],
    ["Mars",    .55, 19, .53, .026, "textures/2k_mars.jpg", 0xcc6030],
    ["Jupiter",   3, 26,.084, .055, "textures/2k_jupiter.jpg", 0xdda070],
    ["Saturn",  2.6, 34,.034,  .05, "textures/2k_saturn.jpg", 0xe8d080],
    ["Uranus",  1.7, 41,.012, .038, "textures/2k_uranus.jpg", 0x80c8c8],
    ["Neptune", 1.6, 48,.006, .036, "textures/2k_neptune.jpg", 0x4060d0]
];

var texDelay = 0;

function boot() {
    scene = new THREE.Scene();

    cam = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 2000);
    cam.position.set(65, 45, 95);
    cam.lookAt(0, 0, 0);

    rdr = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rdr.setSize(innerWidth, innerHeight);
    rdr.setPixelRatio(Math.min(devicePixelRatio, 2));
    rdr.domElement.id = "scene";
    rdr.domElement.style.display = "block";
    document.body.appendChild(rdr.domElement);

    scene.add(new THREE.AmbientLight(0x666666));
    var lt = new THREE.PointLight(0xffffff, 3.5, 480);
    lt.position.set(0, 0, 0);
    scene.add(lt);

    mkSun();
    mkWorld();
    mkStars();
    wire();

    addEventListener("resize", function () {
        cam.aspect = innerWidth / innerHeight;
        cam.updateProjectionMatrix();
        rdr.setSize(innerWidth, innerHeight);
    });
}

function mkSun() {
    sun = new THREE.Mesh(
        new THREE.SphereGeometry(4, 40, 40),
        new THREE.MeshBasicMaterial({ color: 0xffa51f })
    );
    scene.add(sun);

    var g = new THREE.Mesh(
        new THREE.SphereGeometry(5.8, 20, 20),
        new THREE.MeshBasicMaterial({
            color: 0xff5c00,
            transparent: true,
            opacity: .22,
            side: THREE.BackSide
        })
    );
    sun.add(g);
}

function mkWorld() {
    planets.forEach(function (d) {
        var R   = d[1],
            orb = d[2],
            spd = d[3],
            rot = d[4],
            img = d[5],
            clr = d[6];

        var og = new THREE.BufferGeometry(),
            pt = [];
        // 轨道
        for (var j = 0; j <= 128; j++) {
            var a = j / 128 * Math.PI * 2;
            pt.push(Math.cos(a) * orb, 0, Math.sin(a) * orb);
        }
        og.setAttribute("position", new THREE.Float32BufferAttribute(pt, 3));
        scene.add(new THREE.Line(og, new THREE.LineBasicMaterial({ color: 0x1a2440 })));

        // 行星组
        var g = new THREE.Group();
        g.position.x = orb;
        // o=轨道半径, s=公转速度, r=自转速度, a=初始角度
        g.userData = { o: orb, s: spd, r: rot, a: Math.random() * Math.PI * 2 };
        scene.add(g);
        orbs.push(g);

        // 土星环
        if (d[0] === "Saturn") {
            var ri = new THREE.Mesh(
                new THREE.RingGeometry(R * 1.55, R * 2.45, 72),
                new THREE.MeshStandardMaterial({
                    color: 0xccbb88,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: .78,
                    roughness: .82,
                    metalness: .08
                })
            );
            ri.rotation.x = Math.PI / 2.4;
            g.add(ri);
        }

        var sp = new THREE.Mesh(
            new THREE.SphereGeometry(R, 48, 48),
            new THREE.MeshStandardMaterial({
                color: clr,
                roughness: .78,
                metalness: .05
            })
        );
        g.add(sp);

        // 延迟加载纹理
        var _td = texDelay;
        texDelay += 120;
        (function (sphere, texturePath, delay) {
            setTimeout(function () {
                texL.load(texturePath,
                    function (t) {
                        t.encoding = THREE.sRGBEncoding;
                        sphere.material.map = t;
                        sphere.material.color.set(0xffffff);
                        sphere.material.needsUpdate = true;
                    },
                    undefined,
                    function () {}
                );
            }, 220 + delay);
        })(sp, img, _td);
    });
}

function mkStars() {
    var g = new THREE.BufferGeometry(),
        p = new Float32Array(2000 * 3);
    for (var i = 0; i < 2000 * 3; i += 3) {
        p[i]   = (Math.random() - .5) * 750;
        p[i+1] = (Math.random() - .5) * 750;
        p[i+2] = (Math.random() - .5) * 750;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    fld = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: .65 }));
    scene.add(fld);
}

var
    drag = false,
    mx = 0, my = 0,
    tx = .5,
    ty = .35,
    // 相机视角控制
    z = 125,
    // 镜头跟随
    following = false;

function wire() {
    addEventListener("touchstart", function (e) {
        drag = true;
        var t = e.touches[0];
        mx = t.clientX;
        my = t.clientY;
    });
    addEventListener("touchend", function () { drag = false; });
    addEventListener("touchmove", function (e) {
        if (!drag) return;
        var t = e.touches[0];
        tx += (t.clientX - mx) * .005;
        ty = Math.max(-1.4, Math.min(1.4, ty + (t.clientY - my) * .005));
        look();
        mx = t.clientX;
        my = t.clientY;
    });
    addEventListener("mousedown", function (e) { drag = true; mx = e.clientX; my = e.clientY; });
    addEventListener("mouseup", function () { drag = false; });
    addEventListener("mousemove", function (e) {
        if (!drag) return;
        tx += (e.clientX - mx) * .005;
        ty = Math.max(-1.4, Math.min(1.4, ty + (e.clientY - my) * .005));
        look();
        mx = e.clientX;
        my = e.clientY;
    });
}

function look() {
    cam.position.set(
        Math.cos(tx) * Math.cos(ty) * z,
        Math.sin(ty) * z,
        Math.sin(tx) * Math.cos(ty) * z
    );
    cam.lookAt(0, 0, 0);
}

function tick() {
    requestAnimationFrame(tick);

    if (sun) sun.rotation.y += .003;

    orbs.forEach(function (o) {
        var d = o.userData;
        d.a += d.s * .01;
        o.position.x = Math.cos(d.a) * d.o;
        o.position.z = Math.sin(d.a) * d.o;
        o.rotation.y += d.r;
    });
    // 跟随模式
    var ab = document.querySelector('.planet-btn.active');
    if (ab) {
        following = true;
        var pn = ab.getAttribute('data-planet');
        for (var k = 0; k < planets.length; k++) {
            if (planets[k][0] === pn && orbs[k]) {
                const wp = new THREE.Vector3();
                orbs[k].getWorldPosition(wp);
                cam.position.copy(new THREE.Vector3(wp.x + 0, wp.y + 5, wp.z + 10)); 
                cam.lookAt(wp);
                break;
            }
        }
    // 回到全景
    } else if (following) {
        following = false;
        tx = .5; ty = .35; z = 125;
        look();
    }

    rdr.render(scene, cam);
}

// 延迟启动
setTimeout(function () { boot(); tick(); }, 50);





