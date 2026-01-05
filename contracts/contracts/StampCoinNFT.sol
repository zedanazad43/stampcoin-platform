// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract StampCoinNFT is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl, IERC2981 {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant AUTHENTICATOR_ROLE = keccak256("AUTHENTICATOR_ROLE");
    
    uint256 private _tokenIdCounter;
    uint96 public constant ROYALTY_FEE = 500;
    address public royaltyReceiver;

    struct StampData {
        string physicalStampId;
        bool isAuthenticated;
        address authenticatedBy;
        uint256 authenticatedAt;
        uint8 confidenceScore;
        string certificateUri;
    }

    mapping(uint256 => StampData) public stampData;
    mapping(string => uint256) public physicalStampToToken;

    event StampMinted(uint256 indexed tokenId, address indexed to, string physicalStampId, string uri);
    event StampAuthenticated(uint256 indexed tokenId, address indexed authenticator, uint8 confidenceScore, string certificateUri);

    constructor(address _royaltyReceiver) ERC721("StampCoin", "STAMP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(AUTHENTICATOR_ROLE, msg.sender);
        royaltyReceiver = _royaltyReceiver;
    }

    function mintStamp(address to, string memory uri, string memory physicalStampId) public onlyRole(MINTER_ROLE) returns (uint256) {
        require(bytes(physicalStampId).length > 0, "Physical ID required");
        require(physicalStampToToken[physicalStampId] == 0, "Physical stamp already minted");
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        stampData[tokenId] = StampData(physicalStampId, false, address(0), 0, 0, "");
        physicalStampToToken[physicalStampId] = tokenId;
        emit StampMinted(tokenId, to, physicalStampId, uri);
        return tokenId;
    }

    function authenticateStamp(uint256 tokenId, uint8 confidenceScore, string memory certificateUri) external onlyRole(AUTHENTICATOR_ROLE) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(confidenceScore <= 100, "Score must be 0-100");
        require(!stampData[tokenId].isAuthenticated, "Already authenticated");
        stampData[tokenId].isAuthenticated = true;
        stampData[tokenId].authenticatedBy = msg.sender;
        stampData[tokenId].authenticatedAt = block.timestamp;
        stampData[tokenId].confidenceScore = confidenceScore;
        stampData[tokenId].certificateUri = certificateUri;
        emit StampAuthenticated(tokenId, msg.sender, confidenceScore, certificateUri);
    }

    function royaltyInfo(uint256, uint256 salePrice) external view override returns (address, uint256) {
        return (royaltyReceiver, (salePrice * ROYALTY_FEE) / 10000);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl, ERC721, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
