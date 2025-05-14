// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC721} from "./ERC721.sol";

contract Whisky is ERC721 {
    /**
     * Format of metadata
     * {
     *  "name": "NFT Title",
     *  "description": "NFT Description",
     *  "image": "ipfs://",
     *  "external_url": "https://example.com", // link to the website/collection
     *  "attributes": [
     *     {
     *      "trait_type": "Author",
     *      "value": "0x123...789"
     *     },
     *     {
     *      "trait_type": "Date",
     *      "value": "2025-01-01"
     *     },
     *   ]
     * }
     */
    enum AssetStatus {
        Available, // 0
        Sold, // 1
        Archived // 2
    }

    enum AssetTxnStatus {
        Pending, // 0
        Completed, // 1
        Cancelled // 2
    }

    struct Asset {
        uint256 tokenId;
        uint256 price; // in wei
        AssetStatus status; // 0: available, 1: sold
        string metadataURI; // ipfs uri
    }

    struct AssetTxn {
        uint256 id;
        uint256 price; // in wei
        address seller;
        address buyer;
        uint256 timestamp;
        AssetTxnStatus status;
    }

    uint256 private _nextTokenId; // Start from 0
    mapping(uint256 => Asset) private _assets; // tokenId => Asset
    // Tracks the number of assets that are in `AssetStatus.Available` status
    uint256 private _availableAssetCount;
    mapping(uint256 => AssetTxn[]) private _assetTxns;

    constructor(
       
    ) ERC721("Whisky", "WHSKY") {
        
    } 

    event AssetSold(uint256 tokenId, uint256 price, string metadataURI, address owner, address buyer);
    event AssetCreated(uint256 tokenId, uint256 price, string metadataURI, address currentOwner);
    event AssetResell(uint256 tokenId, AssetStatus status, uint256 price); 

    function createAndSellAsset(
        uint256 _price, string memory _metadataURI 
    ) public {
        require(_price > 0, "Price must be greater than 0"); 
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty"); 

        uint256 tokenId = _nextTokenId++; 
        Asset memory asset = Asset({
            tokenId: tokenId,
            price: _price,
            status: AssetStatus.Available,
            metadataURI: _metadataURI
        });  
        _assets[tokenId] = asset; 
        _availableAssetCount++;
        _mint(msg.sender, tokenId); 

        emit AssetCreated(tokenId, _price, _metadataURI, msg.sender); 
        // emit AssetSold(tokenId, _price, _metadataURI, msg.sender, address(0)); // update _assetTxns
    } 


    function findAsset(
        uint256 _tokenId
    ) public view returns (
        uint256, AssetStatus, string memory, address
    ) {
        // require(_exists(tokenId), "Token does not exist"); 
        Asset memory asset = _assets[_tokenId];  

        return (
            asset.price,
            asset.status,
            asset.metadataURI,
            _requireOwner(_tokenId) 
        );
        
    } 
 
    function buyAsset(uint256 _tokenId) payable public {

        require(_exists(_tokenId));


        (uint256 _price, AssetStatus _status, string memory metadataURI, address _owner) = findAsset(_tokenId); 

        if (msg.sender == _owner || _status != AssetStatus.Available || msg.value < _price) {
            _assetTxns[_tokenId].push(AssetTxn({
                id: _assetTxns[_tokenId].length,
                price: _price,
                seller: _owner,
                buyer: msg.sender,
                timestamp: block.timestamp,
                status: AssetTxnStatus.Cancelled
            }));
            // revert("Transaction failed!");
            payable(msg.sender).transfer(msg.value);
            return; 
        }


        // require(msg.sender != _owner, "You already own this asset");
        // require(_status == AssetStatus.Available, "Asset is not available for sale"); 
        // require(msg.value >= _price, "Insufficient funds"); 

        _transfer(_owner, msg.sender, _tokenId); 

        if (msg.value > _price) {
            payable(msg.sender).transfer(msg.value - _price); // Refund excess amount
        }
        payable(_owner).transfer(_price); // Transfer the price to the seller
        _assets[_tokenId].status = AssetStatus.Sold; // Update asset status
        _availableAssetCount--; // Decrease available asset count
        _assetTxns[_tokenId].push(AssetTxn({
            id: _assetTxns[_tokenId].length,
            price: _price,
            seller: _owner,
            buyer: msg.sender,
            timestamp: block.timestamp,
            status: AssetTxnStatus.Completed
        })); 

        emit AssetSold(_tokenId, _price, metadataURI, _owner, msg.sender);
    }
    
    function resellAsset(
        uint256 _tokenId, uint256 _price
    ) public {
        require(msg.sender == _requireOwner(_tokenId), "You are not the owner of this asset");
        require(_price > 0, "Price must be greater than 0");  
        AssetStatus currentStatus = _assets[_tokenId].status;  
        _assets[_tokenId].price = _price;
        _assets[_tokenId].status = AssetStatus.Available; // Update asset status

        if (currentStatus != AssetStatus.Available) {
            _availableAssetCount++; // Increase available asset count
             
        }
         
        emit AssetResell(_tokenId, AssetStatus.Available, _price); 
    } 

    function findAllAssets() public view returns (
        uint256[] memory, uint256[] memory, string[] memory, AssetStatus[] memory, address[] memory 
    ) {
        uint256[] memory tokenIds = new uint256[](_nextTokenId);
        uint256[] memory prices = new uint256[](_nextTokenId);
        string[] memory metadataURIs = new string[](_nextTokenId);
        AssetStatus[] memory statuses = new AssetStatus[](_nextTokenId);
        address[] memory owners = new address[](_nextTokenId); 

        for (uint256 i = 0; i < _nextTokenId; i++) {
            Asset memory asset = _assets[i]; 
            tokenIds[i] = asset.tokenId;
            prices[i] = asset.price;
            metadataURIs[i] = asset.metadataURI;
            statuses[i] = asset.status;
            owners[i] = _requireOwner(i); 
        }
        return (tokenIds, prices, metadataURIs, statuses, owners); 
    } 

    function findAvailableAssets() public view returns (
        uint256[] memory, uint256[] memory, string[] memory, AssetStatus[] memory, address[] memory 
    ) {
        uint256[] memory tokenIds = new uint256[](_availableAssetCount);
        uint256[] memory prices = new uint256[](_availableAssetCount);
        string[] memory metadataURIs = new string[](_availableAssetCount);
        AssetStatus[] memory statuses = new AssetStatus[](_availableAssetCount);
        address[] memory owners = new address[](_availableAssetCount); 

        uint256 index = 0; 
        for (uint256 i = 0; i < _nextTokenId; i++) {
            Asset memory asset = _assets[i]; 
            if (asset.status == AssetStatus.Available) {
                tokenIds[index] = asset.tokenId;
                prices[index] = asset.price;
                metadataURIs[index] = asset.metadataURI;
                statuses[index] = asset.status;
                owners[index] = _requireOwner(i); 
                index++;
            }
        }
        return (tokenIds, prices, metadataURIs, statuses, owners); 
    }
    
    function findMyAssets() public view returns (
        uint256[] memory, uint256[] memory, string[] memory, AssetStatus[] memory 
    ) {
        uint256[] memory tokenIds = new uint256[](balanceOf(msg.sender));
        uint256[] memory prices = new uint256[](balanceOf(msg.sender));
        string[] memory metadataURIs = new string[](balanceOf(msg.sender));
        AssetStatus[] memory statuses = new AssetStatus[](balanceOf(msg.sender));

        uint256 index = 0; 
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (msg.sender == _requireOwner(i)) {
                Asset memory asset = _assets[i]; 
                tokenIds[index] = asset.tokenId;
                prices[index] = asset.price;
                metadataURIs[index] = asset.metadataURI;
                statuses[index] = asset.status;
                index++;
            }
        }
        return (tokenIds, prices, metadataURIs, statuses); 
    }  

    function getAssetTransactions (
        uint256 _tokenId 
    ) public view returns(
        uint256[] memory, uint256[] memory, address[] memory, address[] memory, uint256[] memory, AssetTxnStatus[] memory
    ) {
        AssetTxn[] memory assetTxns = _assetTxns[_tokenId];    
        uint256 length = assetTxns.length; 

        uint256[] memory ids = new uint256[](length);
        uint256[] memory prices = new uint256[](length);
        address[] memory sellers = new address[](length);
        address[] memory buyers = new address[](length);
        uint256[] memory timestamps = new uint256[](length);
        AssetTxnStatus[] memory statuses = new AssetTxnStatus[](length);
        for (uint256 i = 0; i < length; i++) {
            AssetTxn memory txn = assetTxns[i]; 
            ids[i] = txn.id;
            prices[i] = txn.price;
            sellers[i] = txn.seller;
            buyers[i] = txn.buyer;
            timestamps[i] = txn.timestamp;
            statuses[i] = txn.status;
        }

        return (ids, prices, sellers, buyers, timestamps, statuses);
    }

    // modifier onlyAvailableAsset(uint256 _tokenId) 

}
