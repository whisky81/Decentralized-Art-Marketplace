// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC721 } from "./IERC721.sol"; // Assumes IERC721 inherits IERC165 and functions are not payable
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { IERC721Receiver } from "./IERC721Receiver.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ERC721 is IERC721, IERC165 {
    using Strings for uint256;

    // Token name and symbol
    string private _name;
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory name_, string memory symbol_) { // User's original param naming style for constructor
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() external view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() external view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address _owner) public view virtual override returns (uint256) {
        require(_owner != address(0), "ERC721: balance query for the zero address");
        return _balances[_owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 _tokenId) public view virtual override returns (address) {
        return _requireOwner(_tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) public virtual override {
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public virtual override {
        _safeTransfer(_from, _to, _tokenId, "");
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address _approved, uint256 _tokenId) public virtual override {
        // Token existence and authorization are checked within _approve
        _approve(_approved, _tokenId, msg.sender);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 _tokenId) public view virtual override returns (address) {
        _requireOwner(_tokenId); // Checks token existence
        return _tokenApprovals[_tokenId];
    }
    
    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address _operator, bool _approved) external virtual override {
        // _approveOperator handles the checks and emitting the event
        _approveOperator(msg.sender, _operator, _approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address _owner, address _operator) public view virtual override returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */

    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */




    function transferFrom(address _from, address _to, uint256 _tokenId) public virtual override {
        address owner = _requireOwner(_tokenId); // Checks existence and gets owner
        require(owner == _from, "ERC721: transfer from incorrect owner");
        require(_to != address(0), "ERC721: transfer to the zero address"); // Moved check earlier

        require(
            _isApprovedOrOwner(msg.sender, owner, _tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        _transfer(_from, _to, _tokenId);
    }

    // --- Internal Helper Functions ---

    /**
     * @dev Returns whether `_tokenId` exists.
     */
    function _exists(uint256 _tokenId) internal view virtual returns (bool) {
        return _owners[_tokenId] != address(0);
    }

    /**
     * @dev Returns the owner of the `_tokenId`. Reverts if token doesn't exist.
     */
    function _requireOwner(uint256 _tokenId) internal view virtual returns (address) {
        require(_exists(_tokenId), "ERC721: query for nonexistent token");
        return _owners[_tokenId];
    }

    /**
     * @dev Returns whether the `_spender` is the `_owner`, approved for `_tokenId`, or an operator for `_owner`.
     */
    function _isApprovedOrOwner(address _spender, address _owner, uint256 _tokenId) internal view virtual returns (bool) {
        // Note: _requireOwner(_tokenId) should have been called by the public function before this.
        return (_spender == _owner ||
                getApproved(_tokenId) == _spender || // Use public getApproved for consistency
                isApprovedForAll(_owner, _spender));
    }
    
    /**
     * @dev Sets `_approved` as the approved address for `_tokenId`, or clears approval if `_approved` is the zero address.
     * Requires `_auth` to be the owner of `_tokenId` or an operator for the owner.
     * Emits an {Approval} event.
     */
    function _approve(address _approved, uint256 _tokenId, address _auth) internal virtual {
        address owner = _requireOwner(_tokenId); // Checks token existence

        // Caller (_auth) must be the owner or an operator for the owner
        require(_auth == owner || isApprovedForAll(owner, _auth), "ERC721: approve caller is not owner nor approved for all");

        if (_approved != address(0)) { // Only check current owner if not clearing approval
            require(owner != _approved, "ERC721: approval to current owner");
        }
        
        if (_tokenApprovals[_tokenId] != _approved) {
            _tokenApprovals[_tokenId] = _approved;
            emit Approval(owner, _approved, _tokenId);
        }
    }

    /**
     * @dev Sets or unsets the approval of a `_operator` to manage all assets of `_owner`.
     * Emits an {ApprovalForAll} event.
     */
    function _approveOperator(address _owner, address _operator, bool _approved) internal virtual {
        require(_owner != address(0), "ERC721: approve from the zero address"); // Added check
        require(_operator != address(0), "ERC721: approve to the zero address");
        require(_operator != _owner, "ERC721: cannot approve self as operator"); // Retained logic from user's original setApprovalForAll

        if (_operatorApprovals[_owner][_operator] != _approved) {
            _operatorApprovals[_owner][_operator] = _approved;
            emit ApprovalForAll(_owner, _operator, _approved);
        }
    }

    /**
     * @dev Transfers `_tokenId` from `_from` to `_to`.
     * Updates state BEFORE emitting event to mitigate reentrancy risk.
     * Clears approvals for `_tokenId` as part of the transfer.
     * Assumes necessary checks (owner, zero address) have been performed by the caller.
     */
    function _transfer(address _from, address _to, uint256 _tokenId) internal virtual {
        // Authorization to clear approval: _from (the current owner) is implicitly authorized.
        _approve(address(0), _tokenId, _from); // Clear existing approval for the token

        // State updates (Effects)
        _balances[_from] -= 1;
        _balances[_to] += 1;
        _owners[_tokenId] = _to;

        // Emit event (Interaction)
        emit Transfer(_from, _to, _tokenId);
    }

    /**
     * @dev Safely transfers `_tokenId` from `_from` to `_to`.
     * Performs all necessary checks and calls {IERC721Receiver-onERC721Received} on contracts.
     */
    function _safeTransfer(address _from, address _to, uint256 _tokenId, bytes memory _data) internal virtual {
        address owner = _requireOwner(_tokenId); // Checks existence and gets owner
        require(owner == _from, "ERC721: transfer from incorrect owner");
        require(_to != address(0), "ERC721: transfer to the zero address");

        require(
            _isApprovedOrOwner(msg.sender, owner, _tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        _transfer(_from, _to, _tokenId); // Internal transfer which also clears approvals
        _checkOnERC721Received(_from, _to, _tokenId, _data); // Check receiver
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * Reverts if the target is not a contract or does not implement the interface.
     */
    function _checkOnERC721Received(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) private { // This helper is specific and not typically overridden
        if (_to.code.length > 0) { // Check if 'to' is a contract
            try IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data) returns (bytes4 retval) {
                require(retval == IERC721Receiver.onERC721Received.selector, "ERC721: transfer to non ERC721Receiver implementer");
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer (call reverted without reason)");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
    }

    /**
     * @dev Mints `_tokenId` and transfers it to `_to`.
     * Does not perform receiver check; use `_safeMint` for that.
     */
    function _mint(address _to, uint256 _tokenId) internal virtual {
        require(_to != address(0), "ERC721: mint to the zero address");
        require(!_exists(_tokenId), "ERC721: token already minted");

        _balances[_to] += 1;
        _owners[_tokenId] = _to;

        emit Transfer(address(0), _to, _tokenId);
    }

    /**
     * @dev Safely mints `_tokenId` and transfers it to `_to`.
     * Performs receiver check on contract recipients.
     */
    function _safeMint(address _to, uint256 _tokenId, bytes memory _data) internal virtual {
        _mint(_to, _tokenId);
        _checkOnERC721Received(address(0), _to, _tokenId, _data);
    }
    function _safeMint(address _to, uint256 _tokenId) internal virtual { // Overload for no data
        _safeMint(_to, _tokenId, "");
    }

}