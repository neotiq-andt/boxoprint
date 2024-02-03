
function epa1($Ox, $Oy, $long, $larg, $haut) {
    $long = $long * 10;
    $larg = $larg * 10;
    $haut = $haut * 10;

    $Ox = $Ox + 50;
    $Oy = $Oy + 50;

    let $hautnet = $haut + (500);
    let $longnet = ($Ox + $long + 500);

    let ret = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + $longnet + ' ' + $hautnet + '" preserveAspectRatio="xMinYMin meet">';

    ret += '<path id="A" fill="pink" stroke-width="0.5" stroke="black" d="M' + $Ox  + ' ' + $Oy + 'L' + ($Ox) + ' ' + ($Oy+$haut) + 'L' + ($Ox+7) + ' ' + ($Oy+$haut) + 'L' + ($Ox+7) + ' ' + ($Oy+$haut-1) + 'L' + ($Ox+$long-7) + ' '+ ($Oy+$haut-1) + 'L' + ($Ox+$long-7) + ' ' + ($Oy+$haut) + 'L' + ($Ox+$long) + ' ' + ($Oy+$haut) + 'L' + ($Ox+$long) + ' ' + ($Oy) + ' Z" />';

    ret += '<path id="B" fill="grey" stroke-width="0.5" stroke="black" d="M' + ($Ox+1) + ' ' + ($Oy+$haut) + ' q' + (0) + ' ' + (10) + ' ' + (9) + ' ' + (20) + 'L' + ($Ox+$long-10) + ' ' + ($Oy+$haut+20) + 'M' + ($Ox+$long-10) + ' ' + ($Oy+$haut+20) + ' q' + (9) + ' ' + (-10) + ' ' + (9) + ' ' + (-20) + 'L' + ($Ox+$long-7) + ' ' + ($Oy+$haut) + 'L' + ($Ox+$long-7) + ' ' + ($Oy+$haut-1) + 'L' + ($Ox+7) + ' ' + ($Oy+$haut-1) + 'L' + ($Ox+7) + ' ' + ($Oy+$haut) + 'L' + ($Ox+1) + ' ' + ($Oy+$haut) + '"/>';

    ret += '<line stroke-width="0.5" x1="' + ($Ox+7) + '" y1="' + ($Oy+$haut-1) + '" x2="' + ($Ox+$long-7) + '" y2="' + ($Oy+$haut-1) + '" style=" stroke:red"/>'; // raineur 5/6

    ret += '</svg>';

    return ret;
};

