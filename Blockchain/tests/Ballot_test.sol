// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/3_Ballot.sol";

contract BallotTest {

    bytes32[] proposalNames;

    Ballot ballotToTest;

    function beforeAll () public {
        proposalNames.push(bytes32(bytes("candidate1")));
        ballotToTest = new Ballot(proposalNames);
    }

    function checkWinningProposal () public {
        ballotToTest.vote(0);
        Assert.equal(ballotToTest.winningProposal(), uint(0), "proposal at index 0 should be the winning proposal");
        Assert.equal(ballotToTest.winnerName(), bytes32(bytes("candidate1")), "candidate1 should be the winner name");
    }

    function checkWinningProposalWithReturnValue () public view returns (bool) {
        return ballotToTest.winningProposal() == 0;
    }
}