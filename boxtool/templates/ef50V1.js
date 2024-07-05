//ef50V1
function DesignBox(Ox, Oy, A, B, C) {
	A = A * 10;
	B = B * 10;
	C = C * 10;

	var X=1;

	//Détermination de la largeur de la patte de collage
	if(A < 2000){
		var PC=130;
	}else{
		var PC=150;
	}

	//Détermination de la hauteur de la pette rentrante
	if(A < 1000){
		var PR=120;
	}else{
		var PR=160;
	}

	//Détermination de la valeur des filets de verrouillage Z et Y
	if(A < 1000){
		var Z=70;
		var Y=50
	}else{
		var Z=100;
		var Y=70
	}

	//Détermination de la hauteur des rabats HR
	if((PR+B-X)/2>(A/2)-0.5){
		var HR=((A/2)-0.5);
	}else{
		var HR=((PR+B-X)/2);
	}

	//Détermination de la valeur de l'origine (Ox,Oy) en haut à gauche de la face 1
	var Ox=Ox+PC+5;
	var Oy=Oy+PR+B+5;

	//Détermination de la longueur et hauteur de la viewbox
	var longnet=(PC+2*A+2*B+10);
	var hautnet=(2*PR+2*B+C+10);

	var result = "";

	result += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+longnet+' '+hautnet+'" preserveAspectRatio="xMinYMin meet">';

	//Création des faces avec méthode polygon

	//face 0
	result +=  '<g id="0">';
	result +=  '<polygon points="'+(Ox)+','+(Oy)+' '+(Ox-PC)+','+ Math.round((Oy+PC*Math.tan(15*Math.PI/180)))+' '+(Ox-PC)+','+ Math.round((Oy+C-PC/Math.tan(45*Math.PI/180)-X))+' '+(Ox)+','+(Oy+C-X)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox-PC/2)+'" y="'+(Oy+C/2+3)+'" text-anchor="middle" fill="black" font-size="10">0</text>';
	result +=  '</g>';

	//face 1
	result +=  '<g id="1">';
	result +=  '<polygon points="'+(Ox)+','+(Oy-X)+' '+(Ox)+','+(Oy+C-X)+' '+(Ox+X)+','+(Oy+C)+' '+(Ox+A)+','+(Oy+C)+' '+(Ox+A)+','+(Oy-X)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+C/2+3)+'" text-anchor="middle" fill="black" font-size="10">1</text>';
	result +=  '</g>';

	//face 2
	result +=  '<g id="2">';
	result +=  '<polygon points="'+(Ox+A)+','+(Oy)+' '+(Ox+A)+','+(Oy+C)+' '+(Ox+A+B)+','+(Oy+C)+' '+(Ox+A+B)+','+(Oy)+' '+(Ox+A)+','+(Oy)+'" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B/2)+'" y="'+(Oy+C/2+3)+'" text-anchor="middle" fill="black" font-size="10">2</text>';
	result +=  '</g>';

	//face 3
	result += '<g id="3">';
	result += '<polygon points="'+(Ox+A+B)+','+(Oy)+' '+(Ox+A+B)+','+(Oy+C)+' '+(Ox+A+B+A)+','+(Oy+C)+' '+(Ox+A+B+A)+','+(Oy)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result += '<text x="'+(Ox+A+B+A/2)+'" y="'+(Oy+C/2+3)+'" text-anchor="middle" fill="black" font-size="10">3</text>';
	result += '</g>';

	//face 4
	result += '<g id="4">';
	result += '<polygon points="'+(Ox+A+B+A)+','+(Oy)+' '+(Ox+A+B+A)+','+(Oy+C)+' '+(Ox+A+B+A+B-X)+','+(Oy+C)+' '+(Ox+A+B+A+B-X)+','+(Oy)+' '+(Ox+A+B+A)+','+(Oy)+'" stroke="black" stroke-width="0.5" fill="white"/>';
	result += '<text x="'+(Ox+A+B+A+B/2)+'" y="'+(Oy+C/2+3)+'" text-anchor="middle" fill="black" font-size="10">4</text>';
	result += '</g>';

	//face 5
	result += '<g id="5">';
	result += '<polygon points="'+(Ox)+','+(Oy-X)+' '+(Ox)+','+(Oy-X-B+X)+' '+(Ox+Z)+','+(Oy-X-B+X)+' '+(Ox+Z)+','+(Oy-X-B+X+2)+' '+(Ox+Z)+','+(Oy-X-B+X+1)+' '+(Ox+A-Z)+','+(Oy-X-B+X+1)+' '+(Ox+A-Z)+','+(Oy-X-B+X+2)+' '+(Ox+A-Z)+','+(Oy-X-B+X)+' '+(Ox+A)+','+(Oy-X-B+X)+' '+(Ox+A)+','+(Oy-X)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result += '<text x="'+(Ox+A/2)+'" y="'+(Oy-B/2+3)+'" text-anchor="middle" fill="black" font-size="10">5</text>';
	result += '</g>';

	//face 6 PR supérieure définie par la méthode Path avec courbe de bézier M(point de départ) Q(point d'inflexion) (point d'arrivée) en valeur absolue (q en valeur relative par rapport au point de départ)
	result += '<g id="6">';
	result += '<path id="6" fill="white" stroke-width="0.5" stroke="black" d="M'+(Ox+X)+' '+(Oy-X-B+X)+' Q'+(Ox+X)+' '+(Oy-X-B+X-PR/2)+' '+(Ox+Z)+' '+(Oy-X-B+X-PR)+'L'+(Ox+A-Z)+' '+(Oy+X-B-X-PR)+' M'+(Ox+A-Z)+' '+(Oy+X-B-X-PR)+' Q'+(Ox+A-X)+' '+(Oy+X-B-X-PR/2)+' '+(Ox+A-X)+' '+(Oy+X-B-X)+' L'+(Ox+A-Z)+' '+(Oy+X-B-X)+' L'+(Ox+A-Z)+' '+(Oy+X-B-X+1)+' L'+(Ox+Z)+' '+(Oy+X-B-X+1)+' L'+(Ox+Z)+' '+(Oy+X-B-X)+' L'+(Ox+X)+' '+(Oy+X-B-X)+'"/>';
	result += '<text x="'+(Ox+A/2)+'" y="'+(Oy-X-B+X-PR/2+3)+'" text-anchor="middle" fill="black" font-size="10">6</text>';
	result += '</g>';

	//face 7
	result +=  '<g id="7">';
	result +=  '<polygon points="'+(Ox+A)+','+(Oy)+' '+(Ox+A)+','+(Oy-HR)+' '+(Ox+A+B-X-5)+','+(Oy-HR)+' '+Math.round((Ox+A+B-X-3*Math.cos(45*Math.PI/180)))+','+Math.round((Oy-Y-2*Math.sin(45*Math.PI/180)))+' '+(Ox+A+B-X)+','+(Oy-Y)+' '+(Ox+A+B-X)+','+(Oy)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B/2)+'" y="'+(Oy-HR/2+3)+'" text-anchor="middle" fill="black" font-size="10">7</text>';
	result +=  '</g>';

	//face 8
	result +=  '<g id="8">';
	result +=  '<polygon points="'+(Ox+A+B+A+X)+','+(Oy)+' '+(Ox+A+B+A+X)+','+(Oy-Y)+' '+Math.round((Ox+A+B+A+X+3*Math.cos(45*Math.PI/180)))+','+Math.round((Oy-Y-2*Math.sin(45*Math.PI/180)))+' '+(Ox+A+B+A+X+5)+','+(Oy-HR)+' '+(Ox+A+B+B+A-3*X)+','+(Oy-HR)+' '+(Ox+A+B+B+A-X)+','+(Oy)+' z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B+A+B/2)+'" y="'+(Oy-HR/2+3)+'" text-anchor="middle" fill="black" font-size="10">8</text>';
	result +=  '</g>';

	//face 9
	// tan alpha = (y2-y1)/(x2-x1) on connait 2 points du fond auto A(0,0) B(long/2,larg/2 donc on a la pente reste à la multiplier par le côté adj pour avoir le cot2 opp X 7/10=1/2+1/5 de la largeur
	// hauteur d'un triangle rectangle oh=(ab*ac)/bc comme hypothénuse = $ret alors la hauteur = sin(45)*cos(45)/ret
	result +=  '<g id="9">';
	result +=  '<polygon points="'+(Ox+X)+','+(Oy+C)+' \
	'+Math.round((Ox+X+(7*B/10)*Math.tan(5*Math.PI/180)))+','+(Oy+C+7*B/10)+' \
	'+Math.round((Ox+A/2-Math.tan(45*Math.PI/180)*((7*B/10)-(B/2+3))))+','+(Oy+C+7*B/10)+' \
	'+(Ox+A/2+0.5)+','+(Oy+C+B/2+3)+' \
	'+(Ox+A/2)+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+','+Math.round((Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X))+' \
	'+(Ox+A-X-Y)+','+(Oy+C+Y)+' \
	'+(Ox+A-X)+','+(Oy+C)+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A/2)+'" y="'+(Oy+C+B/4+3)+'" text-anchor="middle" fill="black" font-size="10">9</text>';
	result +=  '</g>';

	//face 10
	result +=  '<g id="10">';
	result +=  '<polygon points="'+Math.round((Ox+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)+Math.tan(45*Math.PI/180)*B/5))+','+(Oy+C+7*B/10)+' \
	'+(Ox+A-2)+','+(Oy+C+7*B/10)+' \
	'+(Ox+A-2)+','+Math.round((Oy+C+Y+Math.tan(45*Math.PI/180)*(X+Y-2)))+' \
	'+Math.round((Ox+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+','+Math.round((Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X))+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+Math.round(((Ox+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+((Ox+A)-(Ox+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)))/2))+'" y="'+(Oy+C+B/2)+'" text-anchor="middle" fill="black" font-size="10">10</text>';
	result +=  '</g>';

	//face 11
	result +=  '<g id="11">';
	result +=  '<polygon points="'+(Ox+A+X)+','+(Oy+C)+' \
	'+Math.round((Ox+A+X+Math.tan(7*Math.PI/180)*B/2))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A+B-Math.tan(45*Math.PI/180)*B/2-X))+','+(Oy+C+B/2)+' \
	'+(Ox+A+B-X)+','+(Oy+C)+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B/2)+'" y="'+(Oy+C+B/4+3)+'" text-anchor="middle" fill="black" font-size="10">11</text>';
	result +=  '</g>';

	//face 12
	// tan alpha = (y2-y1)/(x2-x1) on connait 2 points du fond auto A(0,0) B(long/2,larg/2 donc on a la pente reste à la multiplier par le côté adj pour avoir le cot2 opp X 7/10=1/2+1/5 de la largeur
	// hauteur d'un triangle rectangle oh=(ab*ac)/bc comme hypothénuse = $ret alors la hauteur = sin(45)*cos(45)/ret
	result +=  '<g id="12">';
	result +=  '<polygon points="'+(Ox+A+B+X)+','+(Oy+C)+' \
	'+Math.round((Ox+A+B+X+(7*B/10)*Math.tan(5*Math.PI/180)))+','+(Oy+C+7*B/10)+' \
	'+Math.round((Ox+A+B+A/2-Math.tan(45*Math.PI/180)*((7*B/10)-(B/2+3))))+','+(Oy+C+7*B/10)+' \
	'+(Ox+A+B+A/2+0.5)+','+(Oy+C+B/2+3)+' \
	'+(Ox+A+B+A/2)+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A+B+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A+B+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+','+(Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X)+' \
	'+(Ox+A+B+A-X-Y)+','+(Oy+C+Y)+' \
	'+(Ox+A+B+A-X)+','+(Oy+C)+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B+A/2)+'" y="'+(Oy+C+B/4+3)+'" text-anchor="middle" fill="black" font-size="10">12</text>';
	result +=  '</g>';

	//face 13
	result +=  '<g id="13">';
	result +=  '<polygon points="'+(Ox+A+B+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A+B+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)+Math.tan(45*Math.PI/180)*B/5))+','+(Oy+C+7*B/10)+' \
	'+(Ox+A+B+A-2)+','+(Oy+C+7*B/10)+' \
	'+(Ox+A+B+A-2)+','+(Oy+C+Y+Math.tan(45*Math.PI/180)*(X+Y-2))+' \
	'+Math.round((Ox+A+B+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+','+(Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X)+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+Math.round(((Ox+A+B+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+((Ox+A+B+A)-(Ox+A+B+A-(Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B)))/2))+'" y="'+(Oy+C+B/2)+'" text-anchor="middle" fill="black" font-size="10">13</text>';
	result +=  '</g>';

	//face 14
	result +=  '<g id="14">';
	result +=  '<polygon points="'+(Ox+A+X+B+A)+','+(Oy+C)+' \
	'+Math.round((Ox+A+X+B+A+Math.tan(7*Math.PI/180)*B/2))+','+(Oy+C+B/2)+' \
	'+Math.round((Ox+A+B+A+B-Math.tan(45*Math.PI/180)*B/2-X))+','+(Oy+C+B/2)+' \
	'+(Ox+A+B-X+B+A)+','+(Oy+C)+' \
	z" stroke="black" stroke-width="0.5" fill="white"/>';
	result +=  '<text x="'+(Ox+A+B+A+B/2)+'" y="'+(Oy+C+B/4+3)+'" text-anchor="middle" fill="black" font-size="10">14</text>';
	result +=  '</g>';

	//au besoin voici les axes de symétrie ou de pliage (en rouge) d'une face par rapport à l'autre+ Ces lignes viennent se supperposer sur les traits du poligon en noir+
	result += '<line x1="'+(Ox)+'" y1="'+Oy+'" x2="'+(Ox)+'" y2="'+(Oy+C-X)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 0/1
	result += '<line x1="'+(Ox+A)+'" y1="'+Oy+'" x2="'+(Ox+A)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; //Axe de pliage 1/2
	result += '<line x1="'+(Ox+A+B)+'" y1="'+Oy+'" x2="'+(Ox+A+B)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 2/3
	result += '<line x1="'+(Ox+A+B+A)+'" y1="'+Oy+'" x2="'+(Ox+A+B+A)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 3/4
	result += '<line x1="'+(Ox)+'" y1="'+(Oy-X)+'" x2="'+(Ox+A)+'" y2="'+(Oy-X)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 1/5
	result += '<line x1="'+(Ox+Z)+'" y1="'+(Oy-X-B+X+1)+'" x2="'+(Ox+A-Z)+'" y2="'+(Oy-X-B+X+1)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 5/6
	result += '<line x1="'+(Ox+A)+'" y1="'+(Oy)+'" x2="'+(Ox+A+B-X)+'" y2="'+(Oy)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 2/7
	result += '<line x1="'+(Ox+A+B+A+B-X)+'" y1="'+(Oy)+'" x2="'+(Ox+A+B+A+X)+'" y2="'+(Oy)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 4/8
	result += '<line x1="'+Math.round((Ox+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+'" y1="'+(Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X)+'" x2="'+Math.round((Ox+A-Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+'" y2="'+Math.round((Oy+C+Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 9/10
	result += '<line x1="'+(Ox+X)+'" y1="'+(Oy+C)+'" x2="'+(Ox+A-X)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 1/9
	result += '<line x1="'+(Ox+A+B+X)+'" y1="'+(Oy+C)+'" x2="'+(Ox+A+B+A-X)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 3/12
	result += '<line x1="'+(Ox+A+X)+'" y1="'+(Oy+C)+'" x2="'+(Ox+A+B-X)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 2/11
	result += '<line x1="'+(Ox+A+X+B+A)+'" y1="'+(Oy+C)+'" x2="'+(Ox+A+B-X+B+A)+'" y2="'+(Oy+C)+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 4/14
	result += '<line x1="'+Math.round((Ox+A+B+A-Math.tan(45*Math.PI/180)*(Y+Math.pow((X*Math.sin(45*Math.PI/180)),2)/X)))+'" y1="'+Math.round((Oy+C+Y+Math.pow(X*Math.sin(45*Math.PI/180),2)/X))+'" x2="'+Math.round((Ox+A+B+A-Math.tan(45*Math.PI/180)*Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+'" y2="'+Math.round((Oy+C+Math.pow((B*Math.cos(45*Math.PI/180)),2)/B))+'" stroke="red" stroke-width="0.5"/>'; // Axe de pliage 12/13
	result +='</svg>';

	return result;
};



