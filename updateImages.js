const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, 'src', 'data', 'mockProducts.js');
let data = fs.readFileSync(mockPath, 'utf8');

const imageMap = {
  milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=400&q=80',
  butter: 'https://images.unsplash.com/photo-1589134731309-902ee909f2df?w=400&q=80',
  cheese: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80',
  ghee: 'https://images.unsplash.com/photo-1614051065604-db8ca31b23cc?w=400&q=80',
  lassi: 'https://images.unsplash.com/photo-1571505353526-7d6f51be0f24?w=400&q=80',
  ice: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80',
  
  chips: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80',
  biscuit: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
  bhujia: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  dal: 'https://images.unsplash.com/photo-1585933646706-7b434b9e2c60?w=400&q=80',
  chocolate: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80',
  noodle: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
  
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
  pepsi: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
  sprite: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',
  energy: 'https://images.unsplash.com/photo-1527661591450-b4da4867afb4?w=400&q=80',
  tea: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80',
  coffee: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1abc4?w=400&q=80',
  
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  atta: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
  salt: 'https://images.unsplash.com/photo-1610444302636-f3316db05e5d?w=400&q=80',
  sugar: 'https://images.unsplash.com/photo-1581428982868-e410dd187a90?w=400&q=80',
  masala: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
  ketchup: 'https://images.unsplash.com/photo-1604322408014-996ff5ff6197?w=400&q=80',
  flakes: 'https://images.unsplash.com/photo-1521249666012-32a188be23d7?w=400&q=80',
  
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  chilli: 'https://images.unsplash.com/photo-1588636734166-4e55eab2be6a?w=400&q=80',
  ginger: 'https://images.unsplash.com/photo-1599598425947-3300262b7194?w=400&q=80',
  garlic: 'https://images.unsplash.com/photo-1533132644243-7f98fbde14c7?w=400&q=80',
  cabbage: 'https://images.unsplash.com/photo-1549470919-ffb27f31139e?w=400&q=80',
  carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  
  dishwash: 'https://images.unsplash.com/photo-1584820927498-cafe5c15291e?w=400&q=80',
  cleaner: 'https://images.unsplash.com/photo-1585421514284-efa8dea661a5?w=400&q=80',
  surf: 'https://images.unsplash.com/photo-1610555356070-d1fb07b6bfb5?w=400&q=80',
  ariel: 'https://images.unsplash.com/photo-1610555356070-d1fb07b6bfb5?w=400&q=80',
  soap: 'https://images.unsplash.com/photo-1600857062241-9c869eaad6ff?w=400&q=80',
  colgate: 'https://images.unsplash.com/photo-1559868770-b7fb3f848b61?w=400&q=80',
  shampoo: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80',
  bag: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&q=80'
};

const processed = data.replace(/{[\s\S]*?name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g, (match, name, oldImg) => {
   let newImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'; // fallback grocery image
   const n = name.toLowerCase();
   
   for (const key in imageMap) {
     if (n.includes(key)) {
       newImg = imageMap[key];
       break;
     }
   }
   
   // Hardcode some defaults if not caught
   if (n.includes('bhindi') || n.includes('peas') || n.includes('coriander') || n.includes('capsicum')) {
      newImg = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80';
   }
   if (n.includes('tide') || n.includes('wheel')) {
      newImg = 'https://images.unsplash.com/photo-1610555356070-d1fb07b6bfb5?w=400&q=80';
   }
   if (n.includes('lifebuoy') || n.includes('dove') || n.includes('lux')) {
     newImg = 'https://images.unsplash.com/photo-1600857062241-9c869eaad6ff?w=400&q=80';
   }

   return match.replace(oldImg, newImg);
});

fs.writeFileSync(mockPath, processed, 'utf8');
console.log("Images updated to real high-res Unsplash photography!");
