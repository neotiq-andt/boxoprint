//fonction qui dessine un rubisdddddscub en svg
//parametres X origine, Y origine, longeur, largeur, hauteur

// Rubikscube
function rubikscube($Ox, $Oy, $long, $larg, $haut) {
    $long = $long * 10;
    $larg = $larg * 10;
    $haut = $haut * 10;
    //on re ajuste l'origine (on décale un peu (de 5) pour voir entièrement le rubikscube
    $Ox = $Ox + 50;
    $Oy = $Oy + $larg + 50;

    //on crée les dimensions du plan de travail (on élargit un peu (de 10) par rapport au format net du rubikscube
    let $hautnet= ($haut+2*$larg+100);
    let $longnet = ($Ox+2*$long+2*$larg+$long+100);

    let ret = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + $longnet + ' ' + $hautnet + '" preserveAspectRatio="xMinYMin meet">';

    //création des faces du rubikscube
    //face 0
    ret += '<g id="A">';
    ret += '<polygon points="' + ($Ox) + ',' + ($Oy) + ' ' + ($Ox) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long) + ',' + ($Oy) + ' ' + ($Ox) + ',' + ($Oy) + '" stroke="black" fill="dodgerblue"/>';
    ret += '<text x="' + ($Ox+$long/2) + '" y="' + ($Oy+$haut/2+5)  + '" text-anchor="middle" fill="black" font-size="30">A</text>';
    ret += '</g>';

    //face 1
    ret += '<g id="B">';
    ret += '<polygon points="' + ($Ox+$long) + ',' + ($Oy) + ' ' + ($Ox+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy) + ' ' + ($Ox+$long) + ',' + ($Oy) + '" stroke="black" fill="magenta"/>';
    ret += '<text x="' + ($Ox+$long+$larg/2) + '" y="' + ($Oy+$haut/2+5) + '" text-anchor="middle" fill="black" font-size="30">B</text>';
    ret += '</g>';

    //face 2
    ret += '<g id="C">';
    ret += '<polygon points="' + ($Ox+$long+$larg) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy) + '" stroke="black" fill="cyan"/>';
    ret += '<text x="' + ($Ox+$long+$larg+$long/2) + '" y="' + ($Oy+$haut/2+5) + '" text-anchor="middle" fill="black" font-size="30">C</text>';
    ret += '</g>';

    //face 3
    ret += '<g id="D">';
    ret += '<polygon points="' + ($Ox+$long+$larg+$long) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg+$long+$larg) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg+$long+$larg) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy) + '" stroke="black" fill="orangered"/>';
    ret +='<text x="' + ($Ox+$long+$larg+$long+$larg/2) + '" y="' + ($Oy+$haut/2+5) + '" text-anchor="middle" fill="black" font-size="30">D</text>';
    ret += '</g>';

    //face 4
    ret += '<g id="E">';
    ret += '<polygon points="' + ($Ox+$long+$larg) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy-$larg) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy-$larg) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy) + '" stroke="black" fill="lawngreen"/>';
    ret += '<text x="' + ($Ox+$long+$larg+$long/2) + '" y="' + ($Oy-$larg/2+5) + '" text-anchor="middle" fill="black" font-size="30">E</text>';
    ret += '</g>';

    //face 5
    ret += '<g id="F">';
    ret += '<polygon points="' + ($Ox+$long+$larg) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy+$haut+$larg) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy+$haut+$larg) + ' ' + ($Ox+$long+$larg+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long+$larg) + ',' + ($Oy+$haut) +'" stroke="black" fill="gold"/>';
    ret += '<text x="' + ($Ox+$long+$larg+$long/2) + '" y="' + ($Oy+$haut+$larg/2+5) + '" text-anchor="middle" fill="black" font-size="30">F</text>';
    ret += '</g>';

    //au besoin voici les axes de symétrie ou de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du poligon en noir.
    ret += '<line x1="' + ($Ox+$long) + '" y1="' + $Oy + '" x2="' + ($Ox+$long) + '" y2="' + ($Oy+$haut) + '" style=" stroke:red"/>'; //Axe de pliage A/B
    ret += '<line x1="' + ($Ox+$long+$larg) + '" y1="' + $Oy + '" x2="' + ($Ox+$long+$larg) + '" y2="' + ($Oy+$haut) + '" style=" stroke:red"/>'; // Axe de pliage B/C
    ret += '<line x1="' + ($Ox+$long+$larg+$long) + '" y1="' + $Oy + '" x2="' + ($Ox+$long+$larg+$long) + '" y2="' + ($Oy+$haut) + '" style=" stroke:red"/>'; // Axe de pliage C/D
    ret += '<line x1="' + ($Ox+$long+$larg) + '" y1="' + $Oy + '" x2="' + ($Ox+$long+$larg+$long) + '" y2="' + $Oy + '" style=" stroke:red"/>'; // Axe de pliage C/E
    ret += '<line x1="' + ($Ox+$long+$larg) + '" y1="' + ($Oy+$haut) + '" x2="' + ($Ox+$long+$larg+$long) + '" y2="' + ($Oy+$haut) + '" style=" stroke:red"/>'; // Axe de pliage C/F

    //on redefinit l'origine pour la face 6
    $Ox = 5 + $long + $larg + $long + $larg;
    $Oy = $larg + 5;
    $haut -= 5;

    //face 6
    ret += '<g id="G">';
    ret += '<polygon points="' + ($Ox) + ',' + ($Oy+5) + ' ' + ($Ox) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long) + ',' + ($Oy+$haut) + ' ' + ($Ox+$long) + ',' + ($Oy+5) + ' ' + ($Ox) + ',' + ($Oy+5) + '" stroke="black" fill="red"/>';
    ret += '<text x="' + ($Ox+$long/2) + '" y="' + ($Oy+$haut/2+7.5) + '" text-anchor="middle" fill="black" font-size="30">G</text>';
    ret += '</g>';
    ret += '<line x1="' + ($Ox) + '" y1="' + ($Oy+5) + '" x2="' + ($Ox) + '" y2="' + ($Oy+$haut) + '" style=" stroke:red"/>'; //Axe de pliage G/D

    ret += '</svg>';
    return ret;
};

