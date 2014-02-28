var depth = 7;
var t_size = 195;

function init() {
    setDepthText("Recursion Depth: " + depth);
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var cc = canvas.getContext("2d");
        draw_triangles(cc);
    }
}

function draw_triangles(cc) {
    cc.clearRect(0, 0, canvas.width, canvas.height);
    
    var tx = (canvas.width / 2);
    var ty = 5;
    
    var lx = canvas.width - 5;
    var ly = canvas.height - 5;
    
    var rx = 5;
    var ry = canvas.height - 5;

    cc.beginPath();
    
    cc.moveTo(tx, ty);
    cc.lineTo(lx, ly);
    cc.lineTo(rx, ry);
    
    cc.closePath();
    cc.stroke();
    
    sub_t(0, ((tx + lx) / 2), ((ty + ly) / 2), 
    ((tx + rx) / 2), ((ty + ry) / 2), 
    ((lx + rx) / 2), ((ly + ry) / 2), cc);
}

// Algorithm from: http://lodev.org/cgtutor/sierpinski.html#With_Recursion_
function sub_t(d, x1, y1, x2, y2, x3, y3, cc) {
    if (d < depth) {
        cc.beginPath();
        
        cc.moveTo(x1, y1);
        cc.lineTo(x2, y2);
        cc.lineTo(x3, y3);
        
        cc.closePath();
        
        if (d % 2 == 0) {
            cc.fillStyle = "#981100";
        } else if (d % 3 == 0) {
            cc.fillStyle = "#A54808";
        } else {
            cc.fillStyle = "#A50868";
        }
        
        cc.fill();
        
        d++;
        sub_t(d, ((x1 + x2) / 2) + ((x2 - x3) / 2),
            ((y1 + y2) / 2) + ((y2 - y3) / 2),
            
            ((x1 + x2) / 2) + ((x1 - x3) / 2),
            ((y1 + y2) / 2) + ((y1 - y3) / 2),
            
            ((x1 + x2) / 2),
            ((y1 + y2) / 2), cc);
        
        
        sub_t(d, ((x3 + x2) / 2) + ((x2 - x1) / 2),
            ((y3 + y2) / 2) + ((y2 - y1) / 2),
            
            ((x3 + x2) / 2) + ((x3 - x1) / 2),
            ((y3 + y2) / 2) + ((y3 - y1) / 2),
            
            ((x3 + x2) / 2),
            ((y3 + y2) / 2), cc);
        
        sub_t(d, ((x1 + x3) / 2) + ((x3 - x2) / 2),
            ((y1 + y3) / 2) + ((y3 - y2) / 2),
            
            ((x1 + x3) / 2) + ((x1 - x2) / 2),
            ((y1 + y3) / 2) + ((y1 - y2) / 2),
            
            ((x1 + x3) / 2),
            ((y1 + y3) / 2), cc); 
    }
}

function depthUp() {
    depth = (depth >= 10) ? 10 : (++depth);
    init();
}

function depthDown() {
    depth = (depth <= 1) ? 1 : (--depth);
    init();
}

function setDepthText(str) {
    document.getElementById("depth").innerHTML = str;
}
