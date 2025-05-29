// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC721} from "./ERC721.sol";

contract Whisky is ERC721 {
    enum AssetStatus {
        Available,
        Archived
    }

    enum AssetTxnStatus {
        Completed,
        Cancelled
    }

    struct Asset {
        uint256 tokenId;
        uint256 price; // in wei
        AssetStatus status;
        string metadataURI;
        string name;
        uint256 timestamp;
    }

    struct ReturnedAsset {
        uint256 tokenId;
        address owner;
        uint256 price; // in wei
        AssetStatus status;
        string metadataURI;
        string name;
        uint256 timestamp;
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
    uint256 private _availableAssetCount = 0;
    mapping(uint256 => AssetTxn[]) private _assetTxns;

    constructor() ERC721("Whisky", "WHSKY") {}

    modifier isAvailable(uint256 _tokenId) {
        require(_assets[_tokenId].status == AssetStatus.Available, "Token not available");
        _;
    }

    modifier exist(uint256 _tokenId) {
        require(_exists(_tokenId), "Query non-exist token");
        _;
    }

    function _isOwner(
        address account,
        uint256 _tokenId
    ) internal view returns (bool) {
        return account == _requireOwner(_tokenId);
    }

    modifier isOwner(address account, uint256 _tokenId) {
        require(
            _isOwner(account, _tokenId),
            "You are not the owner of this asset"
        );
        _;
    }

    event AssetSold(
        uint256 tokenId,
        string name,
        uint256 price,
        string metadataURI,
        address owner,
        address buyer
    );
    event AssetCreated(
        uint256 tokenId,
        string name,
        uint256 price,
        string metadataURI,
        address currentOwner
    );
    event AssetResell(uint256 tokenId, AssetStatus status, uint256 price);

    function createAndSellAsset(
        uint256 _price,
        string memory _metadataURI,
        string memory name
    ) public {
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_metadataURI).length > 0, "Metadata URI cannot be empty");
        require(bytes(name).length > 0, "Name cannot be empty");

        uint256 tokenId = _nextTokenId++;
        Asset memory asset = Asset({
            tokenId: tokenId,
            price: _price,
            status: AssetStatus.Available,
            metadataURI: _metadataURI,
            name: name,
            timestamp: block.timestamp
        });
        _assets[tokenId] = asset;
        _availableAssetCount++;
        _mint(msg.sender, tokenId);

        emit AssetCreated(tokenId, name, _price, _metadataURI, msg.sender);
    }

    function findAsset(
        uint256 _tokenId
    )
        public
        view
        exist(_tokenId) 
        returns (
            ReturnedAsset memory
        )
    {
        Asset memory asset = _assets[_tokenId];
        return
            ReturnedAsset({
                tokenId: asset.tokenId,
                owner: _requireOwner(_tokenId),
                name: asset.name,
                price: asset.price,
                status: asset.status,
                metadataURI: asset.metadataURI,
                timestamp: asset.timestamp
            });
    }

    function buyAsset(
        uint256 _tokenId
    ) public payable isAvailable(_tokenId) exist(_tokenId) {
        ReturnedAsset memory asset = findAsset(_tokenId);

        if (msg.sender == asset.owner || asset.price > msg.value) {
            _assetTxns[_tokenId].push(
                AssetTxn({
                    id: _assetTxns[_tokenId].length,
                    price: asset.price,
                    seller: asset.owner,
                    buyer: msg.sender,
                    timestamp: block.timestamp,
                    status: AssetTxnStatus.Cancelled
                })
            );
            payable(msg.sender).transfer(msg.value);
            return;
        }

        _transfer(asset.owner, msg.sender, _tokenId);

        if (msg.value > asset.price) {
            payable(msg.sender).transfer(msg.value - asset.price); // Refund excess amount
        }
        payable(asset.owner).transfer(asset.price); // Transfer the price to the seller
        _assets[_tokenId].status = AssetStatus.Archived; // Update asset status
        _availableAssetCount--; // Decrease available asset count
        _assetTxns[_tokenId].push(
            AssetTxn({
                id: _assetTxns[_tokenId].length,
                price: asset.price,
                seller: asset.owner,
                buyer: msg.sender,
                timestamp: block.timestamp,
                status: AssetTxnStatus.Completed
            })
        );

        emit AssetSold(
            _tokenId,
            asset.name,
            asset.price,
            asset.metadataURI,
            asset.owner,
            msg.sender
        );
    }

    function resellAsset(
        uint256 _tokenId,
        uint256 _price
    ) public exist(_tokenId) isOwner(msg.sender, _tokenId) {
        require(_price > 0, "Price must be greater than 0");
        AssetStatus currentStatus = _assets[_tokenId].status;
        _assets[_tokenId].price = _price;
        _assets[_tokenId].status = AssetStatus.Available; // Update asset status

        if (currentStatus != AssetStatus.Available) {
            _availableAssetCount++; // Increase available asset count
        }

        emit AssetResell(_tokenId, AssetStatus.Available, _price);
    }

    function findAllAssets() public view returns (ReturnedAsset[] memory) {
        ReturnedAsset[] memory all = new ReturnedAsset[](_nextTokenId);

        for (uint256 i = 0; i < _nextTokenId; i++) {
            Asset memory asset = _assets[i];
            all[i] = ReturnedAsset({
                tokenId: asset.tokenId,
                owner: _requireOwner(asset.tokenId),
                name: asset.name,
                price: asset.price,
                status: asset.status,
                metadataURI: asset.metadataURI,
                timestamp: asset.timestamp
            });
        }

        return all;
    }

    function findAvailableAssets()
        public
        view
        returns (ReturnedAsset[] memory)
    {
        ReturnedAsset[] memory availableAsset = new ReturnedAsset[](
            _availableAssetCount
        );
        uint256 index = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_assets[i].status == AssetStatus.Available) {
                if (index >= _availableAssetCount) break;
                Asset memory asset = _assets[i];
                availableAsset[index] = ReturnedAsset({
                    tokenId: asset.tokenId,
                    owner: _requireOwner(asset.tokenId),
                    name: asset.name,
                    price: asset.price,
                    status: asset.status,
                    metadataURI: asset.metadataURI,
                    timestamp: asset.timestamp
                });
                index++;
            }
        }
        return availableAsset;
    }

    function getAssetsOf(address account) public view returns (Asset[] memory) {
        Asset[] memory assets = new Asset[](balanceOf(account)); 
        uint256 index = 0;
        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_isOwner(account, i)) {
                assets[index] = _assets[i];
                index++; 
            }
        }
        return assets; 
    }

    function getAssetTransactions(
        uint256 _tokenId
    ) public view exist(_tokenId) returns (AssetTxn[] memory) {
        return _assetTxns[_tokenId];
    }
}
