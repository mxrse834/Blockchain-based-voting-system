// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    address public admin;
    bool public electionActive;

    string[] public candidates;
    mapping(address => bool) public hasVoted;
    mapping(uint => uint) public votes;

    constructor() {
        admin = msg.sender;
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

    function addCandidate(string memory _name) external onlyAdmin {
        candidates.push(_name);
    }

    function castVote(uint candidateId) external {
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

    function getCandidateCount() external view returns (uint) {
        return candidates.length;
    }
}
