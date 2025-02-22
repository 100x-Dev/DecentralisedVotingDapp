// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingPlatform {
    struct Poll {
        uint id;
        string question;
        bool isActive;
        address creator;
        uint[] votes;
        mapping(address => bool) hasVoted;
    }

    uint public pollCount;
    mapping(uint => Poll) public polls;
    mapping(uint => string[]) public pollOptions;

    event PollCreated(uint indexed pollId, string question, address creator);
    event Voted(uint indexed pollId, uint optionIndex, address voter, uint totalVotes);
    event PollClosed(uint indexed pollId, address closer);

    modifier onlyActivePoll(uint _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        _;
    }

    function createPoll(string memory _question, string[] memory _options) public {
        require(_options.length > 1, "Poll must have at least two options");

        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.question = _question;
        newPoll.isActive = true;
        newPoll.creator = msg.sender;
        newPoll.votes = new uint[](_options.length);

        pollOptions[pollCount] = _options;

        emit PollCreated(pollCount, _question, msg.sender);
        pollCount++;
    }

    function vote(uint _pollId, uint _optionIndex) public onlyActivePoll(_pollId) {
        Poll storage poll = polls[_pollId];

        require(_optionIndex < pollOptions[_pollId].length, "Invalid option index");
        require(!poll.hasVoted[msg.sender], "You have already voted");

        poll.votes[_optionIndex]++;
        poll.hasVoted[msg.sender] = true;

        emit Voted(_pollId, _optionIndex, msg.sender, poll.votes[_optionIndex]);
    }

    function getPoll(uint _pollId) public view returns (string memory, string[] memory, bool) {
        return (polls[_pollId].question, pollOptions[_pollId], polls[_pollId].isActive);
    }

    function getPollVotes(uint _pollId) public view returns (uint[] memory) {
        return polls[_pollId].votes;
    }

    function closePoll(uint _pollId) public {
        require(polls[_pollId].creator == msg.sender, "Only creator can close poll");
        require(polls[_pollId].isActive, "Poll is already closed");
        polls[_pollId].isActive = false;

        emit PollClosed(_pollId, msg.sender);
    }

    /**
     * @dev Returns the list of active polls with their questions
     */
    function getActivePolls() public view returns (uint[] memory, string[] memory) {
        uint activeCount = 0;

        // First, determine the number of active polls
        for (uint i = 0; i < pollCount; i++) {
            if (polls[i].isActive) {
                activeCount++;
            }
        }

        // Create arrays to store active poll IDs and their questions
        uint[] memory activePollIds = new uint[](activeCount);
        string[] memory activeQuestions = new string[](activeCount);

        uint index = 0;
        for (uint i = 0; i < pollCount; i++) {
            if (polls[i].isActive) {
                activePollIds[index] = polls[i].id;
                activeQuestions[index] = polls[i].question;
                index++;
            }
        }

        return (activePollIds, activeQuestions);
    }
}
