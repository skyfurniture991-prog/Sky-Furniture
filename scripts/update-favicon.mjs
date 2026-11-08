import fs from 'fs';

const png = fs.readFileSync('public/sky-logo.png');
fs.writeFileSync('public/favicon.png', png);

const b64 = png.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="data:image/png;base64,${b64}" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>
`;

fs.writeFileSync('public/favicon.svg', svg);
console.log('Successfully updated public/favicon.svg and public/favicon.png');
