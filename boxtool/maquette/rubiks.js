/**
 *
 * Gestion de pliage des faces d'une boite en carton
 *
 * @version 1.3
 *
 * @since 1.3
 *     - gestion des faces complexe (multi mesh)
 *     - centre la base sur l'origine
 * @since 1.2
 *     - remplace de la balise text pas l'attribut id pour le text des faces
 *     - option pour l'affichage ou non du texte sur les faces
 * @since 1.1
 *     - gestion des faces par rapport aux axes de pliage du fichier source
 *     - paramétrage de des axes de pliage (visible + couleur)
 *     - parametrage de la couleur de la face interne
 *     - gestion du texte sur la face par rapport au fichier source.
 * @since 1.0: version initiale
 */

(function () {

    var renderer, stats, scene, camera, font;
    var cube, guiConfig;
    var _resolve;
    var _options;
    var _faces = {};

    var Cube = (function () {
        function Cube(filename) {
            this.filename = filename;
            this.sides = [];
            this.clones = [];
            this.labels = [];
            this.sideUI2 = {};
            this.gui = new dat.GUI({
                load: getPresetJSON(),
                preset: 'Default'
            });
            this.sceneUI = this.gui.addFolder('Scene');
            this.foldUI = this.gui.addFolder('Pliage');
            this.foldUI.open();
        };

        Cube.prototype = {
            filename: '',
            sides: [],
            clones: [],
            lines: [],
            labels: [],
            sideUI2: {},
            gui: null,
            sceneUI: null,
            foldUI: null,

            addProperty: function (info, callback) {
                this.sideUI2[info.name] = info.value;
                if (info.type == 1) {
                    c = this.sceneUI.addColor(this.sideUI2, info.name);
                    c.onChange(function (value) {
                        callback(value);
                    });
                } else
                    c = this.sceneUI.add(this.sideUI2, info.name);
                c.onFinishChange(function (value) {
                    callback(value);
                });
                return c;
            },

            reset: function () {
                this.gui.destroy();
            }
        }
        return Cube;
    })();


    function tripleProduct(a, b, c) {
        return a.clone().dot(
            (new THREE.Vector3()).crossVectors(b, c)
        );
    }

    /**
     * Fonction permettant de dire si [AB] contient [CD]
     */
    function validateDistance(a, b, c, d) {
        var ab = a.distanceTo(b);
        var cd = c.distanceTo(d);

        var ac = a.distanceTo(c);
        var ad = a.distanceTo(d);
        if (ac > ad) {
            var cb = c.distanceTo(b);
            return ((ad + cd + cb) == ab);
        } else {
            var db = d.distanceTo(b);
            return ((ac + cd + db) == ab);
        }

    }
    /**
     * Fonction permettant de vérifier que la ligne servant d'axe de pliage
     * se trouve sur une arrête d'une face
     */
    function calculateLine(a, b, line) {
        var c = line.geometry.vertices[0];
        var d = line.geometry.vertices[1];

        var ab = b.clone().sub(a);
        var ac = c.clone().sub(a);
        var ad = d.clone().sub(a);

        // On vérifie qu'on est sur le même plan
        if (tripleProduct(ab, ac, ad) === 0) {
            // On vérifie que les vecteurs sont colinéaires
            if (((ab.x * ac.y) - (ab.y * ac.x) == 0) &&
                ((ab.x * ad.y) - (ab.y * ad.x) == 0)) {
                // on vérifie que les lignes se superposent
                var d_ab = a.distanceTo(b);
                var d_cd = c.distanceTo(d);

                if (d_ab >= d_cd) {
                    return {
                        match: validateDistance(a, b, c, d),
                        diff: (d_ab == d_cd) ? 0 : 1
                    };
                } else {
                    return {
                        match: validateDistance(c, d, a, b),
                        diff: -1
                    };
                }
            }
        }
        return {
            match: false
        };
    }

    /**
     * Plie la face de 'angle'° en fonction de l'axe auto déterminé
     */
    function foldSide(pivot, angle) {
        if (pivot.config.ax.y)
            pivot.rotation.y = THREE.Math.degToRad(angle);
        if (pivot.config.ax.x)
            pivot.rotation.x = THREE.Math.degToRad(angle);
        render();
    }


    /**
     * Affiche un texte au centre d'une face (avec un recule de 1 sur z pour etre visible)
     */
    function printText(side, msg) {
        var color = 0x000000;
        var matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });

        var bbox = new THREE.Box3().setFromObject(side);
        var size = Math.min((bbox.max.x - bbox.min.x), (bbox.max.y - bbox.min.y), 25) - 5;
        if (size <= 0)
            size = 5;

        var shapes = font.generateShapes('' + msg, size);
        var tgeometry = new THREE.ShapeBufferGeometry(shapes);
        tgeometry.computeBoundingBox();
        var maxy = (tgeometry.boundingBox.max.y - tgeometry.boundingBox.min.y) / 2;
        var maxx = (tgeometry.boundingBox.max.x - tgeometry.boundingBox.min.x) / 2 + 5;

        tgeometry.translate(bbox.min.x + (bbox.max.x - bbox.min.x) / 2 - maxx,
            bbox.min.y + (bbox.max.y - bbox.min.y) / 2 - maxy, -0.06);

        text = new THREE.Mesh(tgeometry, matDark);
        side.add(text);
        cube.labels.push(text);
    }


    /**
     * Fonction de rotation avec redefinition de la position de l'axe de rotation
     * en fonction du repère d'origine de la scène
     */
    THREE.Object3D.prototype.rotateAroundWorldAxis = function () {

        var q1 = new THREE.Quaternion();
        return function (point, axis, angle) {

            q1.setFromAxisAngle(axis, angle);

            this.quaternion.multiplyQuaternions(q1, this.quaternion);

            this.position.sub(point);
            this.position.applyQuaternion(q1);
            this.position.add(point);

            return this;
        }

    }();


    /**
     * Fonction permettant de mettre la face dans un object
     * afin de lui permttre de pivoter sur le bon axe.
     * Ajoute une entrée dans l'interface pour piloter l'angle.
     */
    function createPivot(base, side, line) {
        var pivot = new THREE.Object3D();
        side.position.x = -line.p.x;
        pivot.position.x = line.p.x;
        side.position.y = -line.p.y;
        pivot.position.y = line.p.y;
        if (line.p.x != 0)
            pivot.config = {
                ax: {
                    y: 1
                }
            };
        if (line.p.y != 0)
            pivot.config = {
                ax: {
                    x: 1
                }
            };

        pivot.add(side);

        let l = "Face " + side.label + " sur " + base.label;
        cube.sideUI2[l] = 0;
        let c = cube.foldUI.add(cube.sideUI2, l, -180, 180);
        c.onChange(function (value) {
            foldSide(pivot, value);
        });
        c.onFinishChange(function (value) {
            foldSide(pivot, value);
        });
        return pivot;
    }

    /**
     * Ajoute la dépendance entre les faces
     */
    function displaySides(base) {
        for (var l = 0; base.lines.length > l; l++) {
            var line = base.lines[l];
            if (line.done)
                continue;

            line.done = true;
            for (var s = 0; line.sides.length > s; s++) {
                var side = line.sides[s];
                if (side.index != base.index) {
                    line.geometry.translate(0, 0, -0.06);
                    line.visible = _options.lines;
                    base.add(line);
                    base.add(createPivot(base, side, line));
                    displaySides(side);
                }
            }
        }
    }

    /**
     * Cette fonction recherche si l'arête de la face match
     * avec une ligne décrite pour le pliage
     */
    function checkFoldLine(a, b) {
        for (var i = 0; cube.lines.length > i; i++) {
            var line = cube.lines[i];
            var info = calculateLine(a, b, line);
            if (info.match) {
                // 0 meme longueur
                // 1 line plus petite
                // -1 line plus grande
                info.line = line;
                return info;
            }
        }
        return {
            match: false
        };
    }

    /**
     * Cette fonction permet de trouver les dependances entre les faces
     * et les lignes servant pour le pliage
     *
     * La face avec le plus de lignes de pliage sera la face de base
     * (sauf si une autre base est définie)
     */
    function calculateBase(list) {
        for (var i = 0; list.length > i; i++) {
            var side = list[i];
            for (var g = 0; side.children.length > g; g++) {
                var mesh = side.children[g];
                var coord = mesh.geometry.vertices;
                var f = coord[0];
                var l = 0;
                for (var j = 0; coord.length > (j + 1); j++) {
                    var a = coord[j];
                    l = coord[j + 1];
                    var info = checkFoldLine(a, l);
                    if (info.match) {
                        info.line.sides.push(side);
                        side.lines.push(info.line);
                        side.sideChildren2++;
                    }
                }
                if (l != 0) {
                    var info = checkFoldLine(f, l);
                    if (info.match) {
                        info.line.sides.push(side);
                        side.lines.push(info.line);
                        side.sideChildren2++;
                    }
                }
            }
        }
    }

    /**
     * Permet d'afficher les options éditables sur l'interface
     */
    function initializeProperties(filename) {
        cube.addProperty({
            name: "Image",
            value: filename
        }, (value) => {
            if (value !== filename) {
                cube.reset();
                scene.remove(cube.group);
                loadImage(value);
            }
        });

        cube.addProperty({
            name: "Scene",
            type: 1,
            value: _options.scene
        }, (value) => {
            if (value !== _options.scene) {
                _options.scene = value;
                scene.background = new THREE.Color(value);
            }
        });

        cube.addProperty({
            name: "Lignes",
            value: _options.lines
        }, (value) => {
            if (value !== _options.lines) {
                _options.lines = value;
                cube.lines.forEach(element => {
                    element.visible = _options.lines;
                });
            }
        });

        cube.addProperty({
            name: "Couleur lignes",
            type: 1,
            value: _options.line_color
        }, (value) => {
            if (value !== _options.line_color) {
                _options.line_color = value;
                cube.lines.forEach(element => {
                    element.material.color.setHex(value);
                });
            }
        });

        cube.addProperty({
            name: "Base",
            value: _options.base
        }, (value) => {
            if (value !== _options.base) {
                let file = cube.filename;
                cube.reset();
                scene.remove(cube.group);
                _options.base = value;
                loadImage(file);
            }
        });

        cube.addProperty({
            name: "Texte",
            value: _options.label
        }, (value) => {
            if (value !== _options.label) {
                _options.label = value;
                cube.labels.forEach(element => {
                    element.visible = _options.label;
                });
            }
        });

        cube.addProperty({
            name: "Double face",
            value: _options.face_mono
        }, (value) => {
            if (value !== _options.face_mono) {
                _options.face_mono = value;
                cube.clones.forEach(element => {
                    element.visible = !_options.face_mono;
                });
            }
        });
        cube.addProperty({
            name: "Couleur interne",
            type: 1,
            value: _options.face_color
        }, (value) => {
            if (value !== _options.face_color) {
                _options.face_color = value;
                cube.clones.forEach(element => {
                    element.material.color.setHex(value);
                });
            }
        });

    }

    /**
     * Chargement de l'image source
     */
    function loadImage(filename) {
        var loader = new THREE.SVGLoader();
        loader.load(filename, function (paths) {
            cube = new Cube(filename);
            cube.group = new THREE.Group();

            initializeProperties(filename);
            cube.group.scale.multiplyScalar(1);
            // cube.group.position.x = -200;
            // cube.group.position.y = 150;
            cube.group.scale.y *= -1;
            _faces = {};

            var l = 0;
            var sidx = 0;

            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var material = new THREE.MeshBasicMaterial({
                    color: path.color,
                    side: THREE.DoubleSide
                });
                var shapes = path.toShapes(true);
                var gr = null;
                for (var j = 0; j < shapes.length; j++) {
                    var shape = shapes[j];

                    if (shape.curves.length > 1) {
                        var geometry = new THREE.ShapeGeometry(shape);
                        var mesh = new THREE.Mesh(geometry, material);

                        var g = geometry.clone();
                        g.translate(0, 0, -0.05);
                        var m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
                            color: _options.face_color,
                            side: THREE.DoubleSide
                        }));

                        m.visible = !_options.face_mono;
                        mesh.add(m);
                        cube.clones.push(m);

                        if (j == 0) {
                            gr = new THREE.Group();
                            cube.sides.push(gr);
                            gr.label = path.label || ('' + sidx);
                            gr.index = sidx++;
                            _faces[gr.label] = gr.index;
                            gr.lines = [];
                            gr.sideChildren2 = 0;
                        }
                        gr.add(mesh);
                    } else {
                        var material = new THREE.LineBasicMaterial({
                            color: _options.line_color
                        });
                        var geometry = new THREE.ShapeGeometry(shape);
                        var line = new THREE.Line(geometry, material);
                        var a = line.geometry.vertices[0];
                        var b = line.geometry.vertices[1];
                        line.p = {
                            "x": a.x == b.x ? a.x : 0,
                            "y": a.y == b.y ? a.y : 0
                        };
                        line.index = l++;
                        line.sides = [];
                        cube.lines.push(line);
                    }
                }
            }
            calculateBase(cube.sides);

            var base = null;
            if (_options.base.length && _faces[_options.base] != undefined) {
                var idx = _faces[_options.base];
                if (idx >= 0)
                    base = cube.sides[idx];
            }
            if (base == null) {
                base = cube.sides[0];
                for (var i = 0; cube.sides.length > i; i++) {
                    var s = cube.sides[i];
                    if (s.sideChildren2 > base.sideChildren2)
                    base = s;
                }
            }

            cube.sides.forEach(element=>{
                printText(element, element.label);
            });

            var bbox = new THREE.Box3().setFromObject(base);
            cube.group.position.x = -bbox.min.x - (bbox.max.x - bbox.min.x) / 2;
            cube.group.position.y = bbox.min.y + (bbox.max.y - bbox.min.y) / 2;

            displaySides(base);
            cube.group.add(base);


            scene.add(cube.group);

            var p = new THREE.Vector3(0, 0, 0);
            var ax = new THREE.Vector3(1, 0, 0);
            cube.group.rotateAroundWorldAxis(p, ax, THREE.Math.degToRad(90));

            cube.gui.remember(cube.sideUI2);
            cube.gui.preset = _options.preset || "Default";
            _resolve(cube);

        });

    }

    /**
     * Création de l'environnement 3D
     */
    function init(filename) {
        var container = document.getElementById('container');
        //
        scene = new THREE.Scene();
        scene.background = new THREE.Color(_options.scene);
        //
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(-200, 200, 500);

        var loaderF = new THREE.FontLoader();
        loaderF.load('css/FreeMono_Regular.json', function (f) {
            font = f;
            loadImage(filename);
        });

        //
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        //
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.screenSpacePanning = true;
        //
        stats = new Stats();
        container.appendChild(stats.dom);
        //
        window.addEventListener('resize', onWindowResize, false);
    }

    /**
     * Détection du redimensionnement de la fenêtre
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Rafraishissement de l'affichage
     */
    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    /**
     * Rendu de la scene
     */
    function render() {
        renderer.render(scene, camera);
    }


    function getPresetJSON() {
        return {
            "preset": "Default",
            "closed": false,
            "remembered": guiConfig,
            "folders": {}
        };
    }

    /**
     * point d'entrée du projet
     */
    window.loadSVG = function (file, options = {}, params = {}) {
        _options = Object.assign({
            base: "",
            label: true,
            lines: false,
            scene: 0x343434,
            line_color: 0xff0000,
            face_mono: false,
            face_color: 0xffffff,
            preset: "Default"
        }, options);
        guiConfig = params;
        return new Promise((resolve, reject) => {
            _resolve = resolve;
            init(file);
            animate();
        });
    }


})();