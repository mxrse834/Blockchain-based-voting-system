// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureVoting {
    address public admin;
    bool public electionActive;

    string[] public candidates;
    mapping(address => bool) public hasVoted;
    mapping(uint => uint) public votes; // candidateId => vote count

    constructor(string[] memory _candidates) {
        admin = msg.sender;
        candidates = _candidates;
        electionActive = false;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function startElection() external onlyAdmin {
        electionActive = true;
    }

    function endElection() external onlyAdmin {
        electionActive = false;
    }

    function vote(uint candidateId) external {
        require(electionActive, "Election not active");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        votes[candidateId]++;
    }

    function getCandidates() external view returns (string[] memory) {
        return candidates;
    }

    function getVotes(uint candidateId) external view returns (uint) {
        return votes[candidateId];
    }
}
