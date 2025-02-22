"use client"; // Required for state & hooks

import CreatePoll from "./CreatePoll"; // Import CreatePoll component
//import Vote from "./Vote";

const VotingPlatformPage = () => {
    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">🗳️ Voting Platform</h1>
                <CreatePoll />
            </div>



        </div>
    );
};

export default VotingPlatformPage;
