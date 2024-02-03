<?php

echo epa1(0, 0, 100, 100, 50);

function epa1($Ox, $Oy, $long, $larg, $haut) {


$Ox=$Ox+5;
$Oy=$Oy+5;

$hautnet=$haut+(50);
$longnet=($Ox+$long+50);

echo'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '.$longnet.' '.$hautnet.'" preserveAspectRatio="xMinYMin meet">';


echo '<path id="1" fill="pink" stroke-width="0.5" stroke="black" d="
M'.($Ox).' '.($Oy).'
L'.($Ox).' '.($Oy+$haut).'
L'.($Ox+7).' '.($Oy+$haut).'
L'.($Ox+7).' '.($Oy+$haut-1).'
L'.($Ox+$long-7).' '.($Oy+$haut-1).'
L'.($Ox+$long-7).' '.($Oy+$haut).'
L'.($Ox+$long).' '.($Oy+$haut).'
L'.($Ox+$long).' '.($Oy).' Z" />';


echo '<path id="2" fill="grey" stroke-width="0.5" stroke="black" d="
M'.($Ox+1).' '.($Oy+$haut).' q'.(0).' '.(10).' '.(9).' '.(20).'
L'.($Ox+$long-10).' '.($Oy+$haut+20).'
M'.($Ox+$long-10).' '.($Oy+$haut+20).' q'.(9).' '.(-10).' '.(9).' '.(-20).'
L'.($Ox+$long-7).' '.($Oy+$haut).'
L'.($Ox+$long-7).' '.($Oy+$haut-1).'
L'.($Ox+7).' '.($Oy+$haut-1).'
L'.($Ox+7).' '.($Oy+$haut).'
L'.($Ox+1).' '.($Oy+$haut).'"/>';

echo '<line stroke-width="0.5" x1="'.($Ox+7).'" y1="'.($Oy+$haut-1).'" x2="'.($Ox+$long-7).'" y2="'.($Oy+$haut-1).'" style=" stroke:red"/>'; // raineur 5/6

echo '</svg>';

}
?>
