function DesignBoxV2(Ox, Oy, A, B, C) {
    A = A * 10;
    B = B * 10;
    C = C * 10;

    //Détermination de l'épaisseur X
    var X=20;
    //Détermination de la patte de collage PC
    var PC=250;
    //Détermination de la valeur de l'origine (Ox,Oy) en haut à gauche de la face 1
    var Ox=Ox+PC+50;
    var Oy=Oy+C/2+50;
    //Détermination de la longueur et hauteur de la viewbox
    var longnet=(PC+2*A+100);
    var hautnet=(2*C/2+B+100);
    var result = "";
    result += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 '+(longnet+10)+' '+(hautnet+10)+'" preserveAspectRatio="xMidYMin meet">';
    //Création des faces
    //face 0
    result +=  '<g id="0">';
    result +=  '<polygon points="'+(Ox)+','+(Oy)+' '+(Ox-PC)+','+(Oy+PC*Math.tan(30*Math.PI/180))+' '+(Ox-PC)+','+(Oy+B-PC*Math.tan(30*Math.PI/180))+' '+(Ox)+','+(Oy+B)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
    result +=  '<text x="'+(Ox-PC/2)+'" y="'+(Oy+B/2+3)+'" text-anchor="middle" fill="black" font-size="10">0</text>';
    result +=  '</g>';
    //face 1
    result += '<g id="1">';
    result += '<path id="1" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox)+' '+(Oy)+' \
        L'+(Ox)+' '+(Oy-X)+' \
        Q'+(Ox+A/4)+' '+(Oy-X+C/2)+' '+(Ox+A/2)+' '+(Oy-X+C/2)+' \
        Q'+(Ox+3*A/4)+' '+(Oy-X+C/2)+' '+(Ox+A)+' '+(Oy-X)+' \
        L'+(Ox+A)+' '+(Oy+B+X)+' \
        Q'+(Ox+3*A/4)+' '+(Oy+X+B-C/2)+' '+(Ox+A/2)+' '+(Oy+X+B-C/2)+' \
        Q'+(Ox+A/4)+' '+(Oy+X+B-C/2)+' '+(Ox)+' '+(Oy+X+B)+' \
        L'+(Ox)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="10">1</text>';
    result +=  '</g>';
    //face 2
    result += '<g id="2">';
    result += '<path id="2" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox+A)+' '+(Oy)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+C/2)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A+A-X)+' '+(Oy)+' \
        L'+(Ox+A+A-X)+' '+(Oy+B)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+B-C/2)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A)+' '+(Oy+B)+' \
        L'+(Ox+A)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A+A/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="10">2</text>';
    result +=  '</g>';
    //face 3
    result += '<g id="3">';
    result += '<path id="3" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox)+' '+(Oy-X)+' \
        Q'+(Ox+A/4)+' '+(Oy-X-C/2)+' '+(Ox+A/2)+' '+(Oy-X-C/2)+' \
        Q'+(Ox+3*A/4)+' '+(Oy-X-C/2)+' '+(Ox+A)+' '+(Oy-X)+' \
        Q'+(Ox+3*A/4)+' '+(Oy-X+C/2)+' '+(Ox+A/2)+' '+(Oy-X+C/2)+' \
        Q'+(Ox+A/4)+' '+(Oy-X+C/2)+' '+(Ox)+' '+(Oy-X)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-X)+'" text-anchor="middle" fill="black" font-size="10">3</text>';
    result +=  '</g>';
    //face 4
    result += '<g id="4">';
    result += '<path id="4" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox)+' '+(Oy+X+B)+' \
        Q'+(Ox+A/4)+' '+(Oy+X+B+C/2)+' '+(Ox+A/2)+' '+(Oy+X+B+C/2)+' \
        Q'+(Ox+3*A/4)+' '+(Oy+X+B+C/2)+' '+(Ox+A)+' '+(Oy+X+B)+' \
        Q'+(Ox+3*A/4)+' '+(Oy+X+B-C/2)+' '+(Ox+A/2)+' '+(Oy+X+B-C/2)+' \
        Q'+(Ox+A/4)+' '+(Oy+X+B-C/2)+' '+(Ox)+' '+(Oy+X+B)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+X+B)+'" text-anchor="middle" fill="black" font-size="10">4</text>';
    result +=  '</g>';
    //face 5
    result += '<g id="5">';
    result += '<path id="5" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox+A)+' '+(Oy)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy-C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy-C/2)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy-C/2)+' '+(Ox+A+A-X)+' '+(Oy)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+C/2)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A+A/2)+'" y="'+(Oy)+'" text-anchor="middle" fill="black" font-size="10">5</text>';
    result +=  '</g>';
    //face 6
    result += '<g id="6">';
    result += '<path id="6" fill="white" stroke-width="0.5" stroke="black" d=" \
        M'+(Ox+A)+' '+(Oy+B)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+B-C/2)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A+A-X)+' '+(Oy+B)+' \
        Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+B+C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+B+C/2)+' \
        Q'+(Ox+A+A/4-X/2)+' '+(Oy+B+C/2)+' '+(Ox+A)+' '+(Oy+B)+'"/>';
    result +=  '<text x="'+(Ox+A+A/2)+'" y="'+(Oy+B)+'" text-anchor="middle" fill="black" font-size="10">6</text>';
    result +=  '</g>';
    // axes de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du plan (en noir)
    result += '<line x1="'+(Ox)+'" y1="'+(Oy)+'" x2="'+(Ox)+'" y2="'+(Oy+B)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 0/1
    result += '<line x1="'+(Ox+A)+'" y1="'+(Oy)+'" x2="'+(Ox+A)+'" y2="'+(Oy+B)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
    //result += '<line x1="'+(Ox)+'" y1="'+(Oy-X)+'" x2="'+(Ox+A)+'" y2="'+(Oy-X)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
    //result += '<line x1="'+(Ox)+'" y1="'+(Oy+B+X)+'" x2="'+(Ox+A)+'" y2="'+(Oy+B+X)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
    //result += '<line x1="'+(Ox+A)+'" y1="'+(Oy)+'" x2="'+(Ox+A+A-X)+'" y2="'+(Oy)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
    //result += '<line x1="'+(Ox+A)+'" y1="'+(Oy+B)+'" x2="'+(Ox+A+A-X)+'" y2="'+(Oy+B)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
    result += '<path id="Line1" fill="white" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy-X)+' Q'+(Ox+A/4)+' '+(Oy-X+C/2)+' '+(Ox+A/2)+' '+(Oy-X+C/2)+' Q'+(Ox+3*A/4)+' '+(Oy-X+C/2)+' '+(Ox+A)+' '+(Oy-X)+'"/>'; //Axe de pliage 3/1
    result += '<path id="Line2" fill="white" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B+X)+' Q'+(Ox+A/4)+' '+(Oy+B+X-C/2)+' '+(Ox+A/2)+' '+(Oy+B+X-C/2)+' Q'+(Ox+3*A/4)+' '+(Oy+B+X-C/2)+' '+(Ox+A)+' '+(Oy+B+X)+'"/>'; //Axe de pliage 4/1
    result += '<path id="Line3" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy)+' Q'+(Ox+A+A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+C/2)+' Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+C/2)+' '+(Ox+A+A-X)+' '+(Oy)+'"/>'; //Axe de pliage 5/2
    result += '<path id="Line4" fill="white" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B)+' Q'+(Ox+A+A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A+A/2-X/2)+' '+(Oy+B-C/2)+' Q'+(Ox+A+3*A/4-X/2)+' '+(Oy+B-C/2)+' '+(Ox+A+A-X)+' '+(Oy+B)+'"/>'; //Axe de pliage 6/2
    result +='</svg>';
    return result;
};
