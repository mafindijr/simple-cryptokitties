export const SIMPLE_KITTIES_ABI = [
  "function _tokenIdCounter() view returns (uint256)",
  "function kitties(uint256) view returns (uint256 genes, uint256 birthTime, uint256 momId, uint256 dadId, uint256 generation)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function breed(uint256 momId, uint256 dadId) returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
] as const;
