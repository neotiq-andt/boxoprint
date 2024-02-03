<?php

//include('fonctions.php');
//fonction qui dessine un rubikscub en svg
//parametres X origine, Y origine, longeur, largeur, hauteur
echo rubikscube(0, 0, 100, 100, 100);

// Rubikscube
function rubikscube($Ox, $Oy, $long, $larg, $haut) {

//on re ajuste l'origine (on décale un peu (de 5) pour voir entièrement le rubikscube
$Ox=$Ox+5;
$Oy=$Oy+$larg+5;

//on crée les dimensions du plan de travail (on élargit un peu (de 10) par rapport au format net du rubikscube 
$hautnet=($haut+2*$larg+10);
$longnet=($Ox+2*$long+2*$larg+10);


echo'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.$longnet.' '.$hautnet.'" preserveAspectRatio="xMinYMin meet">';

//création des faces du rubikscube
//face A
echo '<g id="A">';
echo '<polygon points="'.($Ox).','.($Oy).' '.($Ox).','.($Oy+$haut).' '.($Ox+$long).','.($Oy+$haut).' '.($Ox+$long).','.($Oy).' '.($Ox).','.($Oy).'" stroke="black" fill="dodgerblue"/>';
echo '<text x="'.($Ox+$long/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">A</text>';
echo '</g>';
//face B
echo '<g id="B">';
echo '<polygon points="'.($Ox+$long).','.($Oy).' '.($Ox+$long).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long).','.($Oy).'" stroke="black" fill="magenta"/>';
echo '<text x="'.($Ox+$long+$larg/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">B</text>';
echo '</g>';
//face C
echo '<g id="C">';
echo '<polygon points="'.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg).','.($Oy).'" stroke="black" fill="cyan"/>';
echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">C</text>';
echo '</g>';
//face D
echo '<g id="D">';
echo '<polygon points="'.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg+$long+$larg).','.($Oy).' '.($Ox+$long+$larg+$long).','.($Oy).'" stroke="black" fill="orangered"/>';
echo '<text x="'.($Ox+$long+$larg+$long+$larg/2).'" y="'.($Oy+$haut/2+5).'" text-anchor="middle" fill="black" font-size="30">D</text>';
echo '</g>';
//face E
echo '<g id="E">';
echo '<polygon points="'.($Ox+$long+$larg).','.($Oy).' '.($Ox+$long+$larg).','.($Oy-$larg).' '.($Ox+$long+$larg+$long).','.($Oy-$larg).' '.($Ox+$long+$larg+$long).','.($Oy).' '.($Ox+$long+$larg).','.($Oy).'" stroke="black" fill="lawngreen"/>';
echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy-$larg/2+5).'" text-anchor="middle" fill="black" font-size="30">E</text>';
echo '</g>';
//face F
echo '<g id="F">';
echo '<polygon points="'.($Ox+$long+$larg).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut+$larg).' '.($Ox+$long+$larg+$long).','.($Oy+$haut+$larg).' '.($Ox+$long+$larg+$long).','.($Oy+$haut).' '.($Ox+$long+$larg).','.($Oy+$haut).'" stroke="black" fill="gold"/>';
echo '<text x="'.($Ox+$long+$larg+$long/2).'" y="'.($Oy+$haut+$larg/2+5).'" text-anchor="middle" fill="black" font-size="30">F</text>';
echo '</g>';

//au besoin voici les axes de symétrie ou de pliage (en rouge) d'une face par rapport à l'autre. Ces lignes viennent se supperposer sur les traits du poligon en noir.
echo '<line x1="'.($Ox+$long).'" y1="'.$Oy.'" x2="'.($Ox+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; //Axe de pliage A/B
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage B/C
echo '<line x1="'.($Ox+$long+$larg+$long).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage C/D
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.$Oy.'" x2="'.($Ox+$long+$larg+$long).'" y2="'.$Oy.'" style=" stroke:red"/>'; // Axe de pliage C/E
echo '<line x1="'.($Ox+$long+$larg).'" y1="'.($Oy+$haut).'" x2="'.($Ox+$long+$larg+$long).'" y2="'.($Oy+$haut).'" style=" stroke:red"/>'; // Axe de pliage C/F

echo '</svg>';
}

?>