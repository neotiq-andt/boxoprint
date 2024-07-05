function DesignBox(Ox, Oy, A, B, C) {

    //Détermination de l'épaisseur X
    var X=1;

    //Détermination de la largeur du trottoir T
    var T=16;


    //Détermination de la valeur de l'origine (Ox,Oy) en haut à gauche de la face 1
    var Ox=Ox+2*C+T+5;
    var Oy=Oy+2*C+T+5;

    //Détermination de la longueur et hauteur de la viewbox
    var longnet=((2*(T+2*C)+A+10+T+2*35+A+3+2*35+T+10));
    var hautnet=(2*(T+2*C)+B+10);

    var result = "";

    result += '<svg width="100%" height="720" xmlns="http://www+w3+org/2000/svg" viewBox="0 -5 '+(longnet+10)+' '+(hautnet+10)+'" preserveAspectRatio="xMidYMin meet">';
    //result +=  '<svg:rect width="'+(longnet)+'" height="'+(hautnet)+'" stroke="gray" fill="white"/>';

    //Création des faces du fond

    //face 0 base
    result += '<g id="0">';
    result += '<path id="0" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy)+' \
	L'+(Ox+A)+' '+(Oy)+' \
	L'+(Ox+A)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">0</text>';
    result +=  '</g>';

    //Haut--------------------------------------------

    //face 1
    result += '<g id="1">';
    result += '<path id="1" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy)+' \
	L'+(Ox)+' '+(Oy-C+X)+' \
	L'+(Ox+X)+' '+(Oy-C)+' \
	L'+(Ox+A-X)+' '+(Oy-C)+' \
	L'+(Ox+A)+' '+(Oy-C+X)+' \
	L'+(Ox+A)+' '+(Oy)+' \
	L'+(Ox)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">1</text>';
    result +=  '</g>';

    //face 2
    result += '<g id="2">';
    result += '<path id="2" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy-C)+' \
	L'+(Ox+X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+A-X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+A-X)+' '+(Oy-C)+' \
	L'+(Ox+X)+' '+(Oy-C)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C-C/2)+'" text-anchor="middle" fill="black" font-size="5">2</text>';
    result +=  '</g>';

    //face 3
    result += '<g id="3">';
    result += '<path id="3" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+X+T)+' '+(Oy-C-C+X-T)+' \
	L'+(Ox+A-X-T)+' '+(Oy-C-C+X-T)+' \
	L'+(Ox+A-X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+X)+' '+(Oy-C-C+X)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C-C+X-T/2)+'" text-anchor="middle" fill="black" font-size="5">3</text>';
    result +=  '</g>';

    //Bas--------------------------------------------

    //face 4
    result += '<g id="4">';
    result += '<path id="4" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B+C-X)+' \
	L'+(Ox+X)+' '+(Oy+B+C)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C)+' \
	L'+(Ox+A)+' '+(Oy+B+C-X)+' \
	L'+(Ox+A)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">4</text>';
    result +=  '</g>';

    //face 5
    result += '<g id="5">';
    result += '<path id="5" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy+B+C)+' \
	L'+(Ox+X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C)+' \
	L'+(Ox+X)+' '+(Oy+B+C)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C+C/2)+'" text-anchor="middle" fill="black" font-size="5">5</text>';
    result +=  '</g>';

    //face 6
    result += '<g id="6">';
    result += '<path id="6" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+X+T)+' '+(Oy+B+C+C-X+T)+' \
	L'+(Ox+A-X-T)+' '+(Oy+B+C+C-X+T)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+X)+' '+(Oy+B+C+C-X)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C+C-X+T/2)+'" text-anchor="middle" fill="black" font-size="5">6</text>';
    result +=  '</g>';

    //Gauche--------------------------------------------

    //face 7
    result += '<g id="7">';
    result += '<path id="7" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox-C+X)+' '+(Oy+X)+' \
	L'+(Ox-C)+' '+(Oy+X+X)+' \
	L'+(Ox-C)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C+X)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">7</text>';
    result +=  '</g>';

    //face 8
    result += '<g id="8">';
    result += '<path id="8" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox-C)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox-C-C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">8</text>';
    result +=  '</g>';

    //face 9
    result += '<g id="9">';
    result += '<path id="9" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox-C-C+X)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X-T)+' '+(Oy+X+X+T)+' \
	L'+(Ox-C-C+X-T)+' '+(Oy+B-X-X-T)+' \
	L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox-C-C-T/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">9</text>';
    result +=  '</g>';

    //Droite--------------------------------------------

    //face 10
    result += '<g id="10">';
    result += '<path id="10" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A+C-X)+' '+(Oy+X)+' \
	L'+(Ox+A+C)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C-X)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">10</text>';
    result +=  '</g>';

    //face 11
    result += '<g id="11">';
    result += '<path id="11" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A+C)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C+C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">11</text>';
    result +=  '</g>';

    //face 12
    result += '<g id="12">';
    result += '<path id="12" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X+T)+' '+(Oy+X+X+T)+' \
	L'+(Ox+A+C+C-X+T)+' '+(Oy+B-X-X-T)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C+C+T/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">12</text>';
    result +=  '</g>';

    //soufflet haut gauche

    //face 13
    result += '<g id="13">';
    result += '<path id="13" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox)+' '+(Oy-C+X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-5)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">13</text>';
    result +=  '</g>';

    //face 14
    result += '<g id="14">';
    result += '<path id="14" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox-C+X)+' '+(Oy+X)+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy-2)+'" text-anchor="middle" fill="black" font-size="5">14</text>';
    result +=  '</g>';

    //soufflet haut droit

    //face 15
    result += '<g id="15">';
    result += '<path id="15" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A)+' '+(Oy-C+X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+5)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">15</text>';
    result +=  '</g>';

    //face 16
    result += '<g id="16">';
    result += '<path id="16" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A+C-X)+' '+(Oy+X)+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy-2)+'" text-anchor="middle" fill="black" font-size="5">16</text>';
    result +=  '</g>';

    //soufflet bas gauche

    //face 17
    result += '<g id="17">';
    result += '<path id="17" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B+C-X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox-5)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">17</text>';
    result +=  '</g>';

    //face 18
    result += '<g id="18">';
    result += '<path id="18" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox-C+X)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy+B+5)+'" text-anchor="middle" fill="black" font-size="5">18</text>';
    result +=  '</g>';

    //soufflet bas droit

    //face 19
    result += '<g id="19">';
    result += '<path id="19" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B+C-X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox+A+5)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">19</text>';
    result +=  '</g>';

    //face 20
    result += '<g id="20">';
    result += '<path id="20" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A+C-X)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy+B+5)+'" text-anchor="middle" fill="black" font-size="5">20</text>';
    result +=  '</g>';

    // axes de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du plan (en noir)
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy)+' L'+(Ox+A)+' '+(Oy)+'"/>'; //Axe de pliage 0/1 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy-C)+' L'+(Ox+A-X)+' '+(Oy-C)+'"/>'; //Axe de pliage 1/2 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy-C-C+X)+' L'+(Ox+A-X)+' '+(Oy-C-C+X)+'"/>'; //Axe de pliage 2/3-90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B)+' L'+(Ox+A)+' '+(Oy+B)+'"/>'; //Axe de pliage 0/4 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy+B+C)+' L'+(Ox+A-X)+' '+(Oy+B+C)+'"/>'; //Axe de pliage 4/5 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy+B+C+C-X)+' L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+'"/>'; //Axe de pliage 5/6 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 0/7 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox-C)+' '+(Oy+X+X)+' L'+(Ox-C)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 7/8 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox-C-C+X)+' '+(Oy+X+X)+' L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 8/9 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 0/10 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A+C)+' '+(Oy+X+X)+' L'+(Ox+A+C)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 10/11 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 11/12 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy)+' L'+(Ox)+' '+(Oy-C+X)+'"/>'; //Axe de pliage 1/13 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy)+' L'+(Ox+A)+' '+(Oy-C+X)+'"/>'; //Axe de pliage 1/15 -180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B)+' L'+(Ox)+' '+(Oy+B+C-X)+'"/>'; //Axe de pliage 4/17 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B)+' L'+(Ox+A)+' '+(Oy+B+C-X)+'"/>'; //Axe de pliage 4/19 -180°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox-C+X)+' '+(Oy+X)+'"/>'; //Axe de pliage 7/14 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A+C-X)+' '+(Oy+X)+'"/>'; //Axe de pliage 10/16 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B-X)+' L'+(Ox-C+X)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 7/18 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B-X)+' L'+(Ox+A+C-X)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 10/20 90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 13/14 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 15/16 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B-X)+' L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 17/18 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B-X)+' L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 19/20 -90°


    //------------------------------------------------------------------------------------------------------------------------------------------------------

    //creation du couvercle

    //Détermination de la valeur de l'origine Ox' en haut à gauche de la face 1 du couvercle
    var Ox=Ox+(A+2*C+T+10+T+2*35);
    //Détermination des valeurs pour le couvercle de la largeur , de la hauteur et de la hauteur fixe de 35
    var A=A+3;
    var B=B+6;
    var C=35;

    //Création des faces du fond

    //face 0 base
    result += '<g id="0">';
    result += '<path id="0" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy)+' \
	L'+(Ox+A)+' '+(Oy)+' \
	L'+(Ox+A)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">0</text>';
    result +=  '</g>';

    //Haut--------------------------------------------

    //face 1
    result += '<g id="1">';
    result += '<path id="1" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy)+' \
	L'+(Ox)+' '+(Oy-C+X)+' \
	L'+(Ox+X)+' '+(Oy-C)+' \
	L'+(Ox+A-X)+' '+(Oy-C)+' \
	L'+(Ox+A)+' '+(Oy-C+X)+' \
	L'+(Ox+A)+' '+(Oy)+' \
	L'+(Ox)+' '+(Oy)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">1</text>';
    result +=  '</g>';

    //face 2
    result += '<g id="2">';
    result += '<path id="2" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy-C)+' \
	L'+(Ox+X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+A-X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+A-X)+' '+(Oy-C)+' \
	L'+(Ox+X)+' '+(Oy-C)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C-C/2)+'" text-anchor="middle" fill="black" font-size="5">2</text>';
    result +=  '</g>';

    //face 3
    result += '<g id="3">';
    result += '<path id="3" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+X+T)+' '+(Oy-C-C+X-T)+' \
	L'+(Ox+A-X-T)+' '+(Oy-C-C+X-T)+' \
	L'+(Ox+A-X)+' '+(Oy-C-C+X)+' \
	L'+(Ox+X)+' '+(Oy-C-C+X)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy-C-C+X-T/2)+'" text-anchor="middle" fill="black" font-size="5">3</text>';
    result +=  '</g>';

    //Bas--------------------------------------------

    //face 4
    result += '<g id="4">';
    result += '<path id="4" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B+C-X)+' \
	L'+(Ox+X)+' '+(Oy+B+C)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C)+' \
	L'+(Ox+A)+' '+(Oy+B+C-X)+' \
	L'+(Ox+A)+' '+(Oy+B)+' \
	L'+(Ox)+' '+(Oy+B)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">4</text>';
    result +=  '</g>';

    //face 5
    result += '<g id="5">';
    result += '<path id="5" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy+B+C)+' \
	L'+(Ox+X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C)+' \
	L'+(Ox+X)+' '+(Oy+B+C)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C+C/2)+'" text-anchor="middle" fill="black" font-size="5">5</text>';
    result +=  '</g>';

    //face 6
    result += '<g id="6">';
    result += '<path id="6" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+X+T)+' '+(Oy+B+C+C-X+T)+' \
	L'+(Ox+A-X-T)+' '+(Oy+B+C+C-X+T)+' \
	L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+' \
	L'+(Ox+X)+' '+(Oy+B+C+C-X)+'"/>';
    result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+B+C+C-X+T/2)+'" text-anchor="middle" fill="black" font-size="5">6</text>';
    result +=  '</g>';

    //Gauche--------------------------------------------

    //face 7
    result += '<g id="7">';
    result += '<path id="7" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox-C+X)+' '+(Oy+X)+' \
	L'+(Ox-C)+' '+(Oy+X+X)+' \
	L'+(Ox-C)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C+X)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">7</text>';
    result +=  '</g>';

    //face 8
    result += '<g id="8">';
    result += '<path id="8" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox-C)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox-C-C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">8</text>';
    result +=  '</g>';

    //face 9
    result += '<g id="9">';
    result += '<path id="9" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox-C-C+X)+' '+(Oy+X+X)+' \
	L'+(Ox-C-C+X-T)+' '+(Oy+X+X+T)+' \
	L'+(Ox-C-C+X-T)+' '+(Oy+B-X-X-T)+' \
	L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+' \
	L'+(Ox-C-C+X)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox-C-C-T/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">9</text>';
    result +=  '</g>';

    //Droite--------------------------------------------

    //face 10
    result += '<g id="10">';
    result += '<path id="10" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A+C-X)+' '+(Oy+X)+' \
	L'+(Ox+A+C)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C-X)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">10</text>';
    result +=  '</g>';

    //face 11
    result += '<g id="11">';
    result += '<path id="11" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A+C)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C+C/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">11</text>';
    result +=  '</g>';

    //face 12
    result += '<g id="12">';
    result += '<path id="12" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' \
	L'+(Ox+A+C+C-X+T)+' '+(Oy+X+X+T)+' \
	L'+(Ox+A+C+C-X+T)+' '+(Oy+B-X-X-T)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+' \
	L'+(Ox+A+C+C-X)+' '+(Oy+X+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C+C+T/2)+'" y="'+(Oy+B/2)+'" text-anchor="middle" fill="black" font-size="5">12</text>';
    result +=  '</g>';

    //soufflet haut gauche

    //face 13
    result += '<g id="13">';
    result += '<path id="13" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox)+' '+(Oy-C+X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-5)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">13</text>';
    result +=  '</g>';

    //face 14
    result += '<g id="14">';
    result += '<path id="14" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox-C+X)+' '+(Oy+X)+' \
	L'+(Ox)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy-2)+'" text-anchor="middle" fill="black" font-size="5">14</text>';
    result +=  '</g>';

    //soufflet haut droit

    //face 15
    result += '<g id="15">';
    result += '<path id="15" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A)+' '+(Oy-C+X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+5)+'" y="'+(Oy-C/2)+'" text-anchor="middle" fill="black" font-size="5">15</text>';
    result +=  '</g>';

    //face 16
    result += '<g id="16">';
    result += '<path id="16" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A+C-X)+' '+(Oy+X)+' \
	L'+(Ox+A)+' '+(Oy+X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy-2)+'" text-anchor="middle" fill="black" font-size="5">16</text>';
    result +=  '</g>';

    //soufflet bas gauche

    //face 17
    result += '<g id="17">';
    result += '<path id="17" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B+C-X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox-5)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">17</text>';
    result +=  '</g>';

    //face 18
    result += '<g id="18">';
    result += '<path id="18" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox)+' '+(Oy+B-X)+' \
	L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox-C+X)+' '+(Oy+B-X)+' \
	L'+(Ox)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox-C/2)+'" y="'+(Oy+B+5)+'" text-anchor="middle" fill="black" font-size="5">18</text>';
    result +=  '</g>';

    //soufflet bas droit

    //face 19
    result += '<g id="19">';
    result += '<path id="19" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B+C-X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox+A+5)+'" y="'+(Oy+B+C/2)+'" text-anchor="middle" fill="black" font-size="5">19</text>';
    result +=  '</g>';

    //face 20
    result += '<g id="20">';
    result += '<path id="20" fill="none" stroke-width="0.5" stroke="black" d=" \
	M'+(Ox+A)+' '+(Oy+B-X)+' \
	L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+' \
	L'+(Ox+A+C-X)+' '+(Oy+B-X)+' \
	L'+(Ox+A)+' '+(Oy+B-X)+'"/>';
    result +=  '<text x="'+(Ox+A+C/2)+'" y="'+(Oy+B+5)+'" text-anchor="middle" fill="black" font-size="5">20</text>';
    result +=  '</g>';

    // axes de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du plan (en noir)
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy)+' L'+(Ox+A)+' '+(Oy)+'"/>'; //Axe de pliage 0/1 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy-C)+' L'+(Ox+A-X)+' '+(Oy-C)+'"/>'; //Axe de pliage 1/2 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy-C-C+X)+' L'+(Ox+A-X)+' '+(Oy-C-C+X)+'"/>'; //Axe de pliage 2/3-90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B)+' L'+(Ox+A)+' '+(Oy+B)+'"/>'; //Axe de pliage 0/4 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy+B+C)+' L'+(Ox+A-X)+' '+(Oy+B+C)+'"/>'; //Axe de pliage 4/5 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+X)+' '+(Oy+B+C+C-X)+' L'+(Ox+A-X)+' '+(Oy+B+C+C-X)+'"/>'; //Axe de pliage 5/6 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 0/7 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox-C)+' '+(Oy+X+X)+' L'+(Ox-C)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 7/8 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox-C-C+X)+' '+(Oy+X+X)+' L'+(Ox-C-C+X)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 8/9 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 0/10 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A+C)+' '+(Oy+X+X)+' L'+(Ox+A+C)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 10/11 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A+C+C-X)+' '+(Oy+X+X)+' L'+(Ox+A+C+C-X)+' '+(Oy+B-X-X)+'"/>'; //Axe de pliage 11/12 -90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy)+' L'+(Ox)+' '+(Oy-C+X)+'"/>'; //Axe de pliage 1/13 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy)+' L'+(Ox+A)+' '+(Oy-C+X)+'"/>'; //Axe de pliage 1/15 -180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B)+' L'+(Ox)+' '+(Oy+B+C-X)+'"/>'; //Axe de pliage 4/17 180°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B)+' L'+(Ox+A)+' '+(Oy+B+C-X)+'"/>'; //Axe de pliage 4/19 -180°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox-C+X)+' '+(Oy+X)+'"/>'; //Axe de pliage 7/14 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A+C-X)+' '+(Oy+X)+'"/>'; //Axe de pliage 10/16 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B-X)+' L'+(Ox-C+X)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 7/18 90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B-X)+' L'+(Ox+A+C-X)+' '+(Oy+B-X)+'"/>'; //Axe de pliage 10/20 90°

    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+X)+' L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 13/14 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+X)+' L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy-(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 15/16 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox)+' '+(Oy+B-X)+' L'+(Ox-(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 17/18 -90°
    result += '<path fill="none" stroke-width="0.5" stroke="red" d=" M'+(Ox+A)+' '+(Oy+B-X)+' L'+(Ox+A+(C*Math.sin(45*Math.PI/180)))+' '+(Oy+B+(C*Math.sin(45*Math.PI/180)))+'"/>'; //Axe de pliage 19/20 -90°


    result +='</svg>';

    return result;
}
