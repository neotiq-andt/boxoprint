loadSVG('test3.svg', {
    base: "",
    scene: 0x343434,
    lines: false,
    line_color: 0xff0000,
    face_color: 0xd4d4d4,
    preset: "Default"
}, {
    "Default": {
        "0": {
            "Face A sur B": 0,
            "Face B sur A": 0,
            "Face B sur C": 0,
            "Face C sur B": 0,
            "Face D sur C": 0,
            "Face E sur C": 0,
            "Face F sur C": 0,
            "Face C sur D": 0,
            "Face G sur D": 0,
        }
    },
    "Fermer": {
        "0": {
            "Face A sur B": -90,
            "Face B sur A": 90,
            "Face B sur C": -90,
            "Face C sur B": 90,
            "Face D sur C": 90,
            "Face E sur C": 90,
            "Face F sur C": -90,
            "Face C sur D": -90,
            "Face G sur D": 91,
        }
    },
    "Ouvert": {
        "0": {
            "Face A sur B": 70,
            "Face B sur A": 90,
            "Face B sur C": -90,
            "Face C sur B": 90,
            "Face D sur C": 90,
            "Face E sur C": 90,
            "Face F sur C": -90,
            "Face C sur D": -90,
            "Face G sur D": -35,
        }
    }

});