<?php



//include('fonctions.php');ddddd

//fonction qui dessine un rubisdddddscub en svg

//parametres X origine, Y origine, longeur, largeur, hauteur

echo rubikscube(0, 0, 100, 100, 100);



// Rubikscube

function rubikscube($Ox, $Oy, $long, $larg, $haut) {



//on re ajuste l'origine (on décale un peu (de 5) pour voir entièrement le rubikscube

$Ox=$Ox+5;

$Oy=$Oy+$larg+5;



//on crée les dimensions du plan de travail (on élargit un peu (de 10) par rapport au format net du rubikscube 

$hautnet=($haut+2*$larg+10);

$longnet=($Ox+2*$long+2*$larg+$long+10);





echo'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.$longnet.' '.$hautnet.'" preserveAspectRatio="xMinYMin meet">';



//création des faces du rubikscube

//face 0

echo '<g id="0">';

echo '<polygon points="'.($Ox).','.($Oy).' '.($Ox).','.($Oy+$haut).' '.($Ox+$long).','.($Oy+$haut).' '.($Ox+$long).','.($Oy).' '.($Ox).','.($Oy).'" stroke="black" fill="dodgerblue"/>';

echo '<text x="'.($Ox+$long/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">A</text>';

echo '</g>';

//face 1

echo '<g id="1">';

echo '<polygon points="'.($Ox+$long).','.($Oy).' '.($Ox+$long).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long).','.($Oy).'" stroke="black" fill="magenta"/>';

echo '<text x="'.($Ox+$long+$larg/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">B</text>';

echo '</g>';

//face 2

echo '<g id="2">';

echo '<polygon points="'.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg).','.($Oy).'" stroke="black" fill="cyan"/>';

echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">C</text>';

echo '</g>';

//face 3



echo '<g id="3">';

echo '<polygon points="'.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg+$long+$larg).','.($Oy).' '.($Ox+$long+$larg+$long).','.($Oy).'" stroke="black" fill="orangered"/>';

echo '<text x="'.($Ox+$long+$larg+$long+$larg/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">D</text>';

echo '</g>';

//face 4

echo '<g id="4">';

echo '<polygon points="'.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long+$larg).','.($Oy-$larg).' '.($Ox+$long+$larg+$long).','.($Oy-$larg).' '.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg).','.($Oy).'" stroke="black" fill="lawngreen"/>';

echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy-$larg/2+5).'" text-anchor="middle" fill="black" font-size="30">E</text>';

echo '</g>';

//face 5

echo '<g id="5">';

echo '<polygon points="'.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut+$larg).' '.($Ox+$long+$larg+$long).','.($Oy+$haut+$larg).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut).'" stroke="black" fill="gold"/>';

echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy+$haut+$larg/2+5).'" text-anchor="middle" fill="black" font-size="30">F</text>';

echo '</g>';


//au besoin voici les axes de symétrie ou de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du poligon en noir.
echo '<line x1="'.($Ox+$long).'" y1="'.$Oy.'" x2="'.($Ox+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; //Axe de pliage A/B
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage B/C
echo '<line x1="'.($Ox+$long+$larg+$long).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage C/D
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg+$long).'" y2="'.$Oy.'" style=" stroke:red"/>'; // Axe de pliage C/E
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.($Oy+$haut).'" x2="'.($Ox+$long+$larg+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage C/F


//on redefinit l'origine pour la face 6

$Ox=5+$long+$larg+$long+$larg;

$Oy=$larg+5;
$haut-=5;
//face 6

echo '<g id="6">';

echo '<polygon points="'.($Ox).','.($Oy+5).' '.($Ox).','.($Oy+$haut).' '.($Ox+$long).','.($Oy+$haut).' '.($Ox+$long).','.($Oy+5).' '.($Ox).','.($Oy+5).'" stroke="black" fill="red"/>';

echo '<text x="'.($Ox+$long/2).'" y="'.($Oy+$haut/2+7.5).'" text-anchor="middle" fill="black" font-size="30">G</text>';

echo '</g>';

echo '<line x1="'.($Ox).'" y1="'.($Oy+5).'" x2="'.($Ox).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; //Axe de pliage G/D


echo '</svg>';

}



?>
