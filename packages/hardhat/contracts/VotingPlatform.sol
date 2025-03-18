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

    function getPollOptions(uint _pollId) public view returns (string[] memory) {
        return pollOptions[_pollId];
    }

    function closePoll(uint _pollId) public {
        require(polls[_pollId].creator == msg.sender, "Only creator can close poll");
        require(polls[_pollId].isActive, "Poll is already closed");
        polls[_pollId].isActive = false;

        emit PollClosed(_pollId, msg.sender);
    }

    function getAllPolls() public view returns (uint[] memory, string[] memory, bool[] memory) {
        uint[] memory pollIds = new uint[](pollCount);
        string[] memory questions = new string[](pollCount);
        bool[] memory statuses = new bool[](pollCount);

        for (uint i = 0; i < pollCount; i++) {
            pollIds[i] = polls[i].id;
            questions[i] = polls[i].question;
            statuses[i] = polls[i].isActive;
        }

        return (pollIds, questions, statuses);
    }

    function getUserPolls(address _user) public view returns (uint[] memory, string[] memory, bool[] memory) {
        uint count = 0;

        // Count how many polls the user has created
        for (uint i = 0; i < pollCount; i++) {
            if (polls[i].creator == _user) {
                count++;
            }
        }

        // Create arrays for user's polls
        uint[] memory userPollIds = new uint[](count);
        string[] memory userQuestions = new string[](count);
        bool[] memory userStatuses = new bool[](count);

        uint index = 0;
        for (uint i = 0; i < pollCount; i++) {
            if (polls[i].creator == _user) {
                userPollIds[index] = polls[i].id;
                userQuestions[index] = polls[i].question;
                userStatuses[index] = polls[i].isActive;
                index++;
            }
        }

        return (userPollIds, userQuestions, userStatuses);
    }
}
