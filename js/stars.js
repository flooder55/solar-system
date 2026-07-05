(function () {
    var c = document.getElementById("stars"),
        w = innerWidth,
        h = innerHeight;
    c.width = w;
    c.height = h;
    var ctx = c.getContext("2d");

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < 220; i++) {
            var x = Math.random() * w,
                y = Math.random() * h;
            var r = Math.random() * 1.6 + .2,
                a = Math.random() * .7 + .2;
            ctx.fillStyle = "rgba(255,255,255," + a + ")";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 7);
            ctx.fill();
        }
    }

    draw();

    addEventListener("resize", function () {
        w = c.width = innerWidth;
        h = c.height = innerHeight;
        draw();
    });
})();

