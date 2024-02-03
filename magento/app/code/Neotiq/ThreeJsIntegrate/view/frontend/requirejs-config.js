define('three', ['Neotiq_ThreeJsIntegrate/js/three/three'], function (THREE) {
    window.THREE = THREE;
    return THREE;
});

define('OrbitControls', ['Neotiq_ThreeJsIntegrate/js/three/OrbitControls'], function (OrbitControls) {
    window.OrbitControls = OrbitControls;
    return OrbitControls;
});

var config = {
    paths: {
        three: 'Neotiq_ThreeJsIntegrate/js/three/three',
        orbitControls: 'Neotiq_ThreeJsIntegrate/js/three/controls/OrbitControls',
    },
    shim: {
        'orbitControls': {
            deps: ['three']
        }
    }
};
