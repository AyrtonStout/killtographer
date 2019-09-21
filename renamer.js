const fs = require('fs');


const raceToId = {
    'human': 1,
    'orc': 2,
    'dwarf': 3,
    'nightelf': 4,
    'undead': 5,
    'tauren': 6,
    'gnome': 7,
    'troll': 8,
    'goblin': 9,
    'bloodelf': 10,
    'draenei': 11
};

const classToId = {
    Warrior: 1,
    Paladin: 2,
    Hunter: 3,
    Rogue: 4,
    Priest: 5,
    Deathknight: 6,
    Shaman: 7,
    Mage: 8,
    Warlock: 9,
    Druid: 11
};

const genderToId = {
    'f': 3,
    'm': 2
};

const files = fs.readdirSync('icons');

console.log(files);

files.forEach(file => {
  const [clazz, race, gender, level] = file.split('-');

  const newName = `${classToId[clazz]}-${raceToId[race]}-${genderToId[gender]}-${level}`;

  fs.renameSync(`icons/${file}`, `icons/${newName}`);
  console.log(newName);
});



