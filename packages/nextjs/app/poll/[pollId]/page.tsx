"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollPage() {
    const { pollId } = useParams(); // Get pollId from the URL
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Fetch Poll Data using Scaffold-ETH Hook
    const { data: pollData, isLoading } = useScaffoldReadContract({
        contractName: "VotingPlatform",
        functionName: "getPoll",
        args: [parseInt(pollId)],
    });

    // Extract Poll Information
    const question = pollData?.[0] || "";
    const options = pollData?.[1] || [];
    const isActive = pollData?.[2] ?? false;

    // Scaffold Write Hook for Voting
    const { writeContractAsync: voteAsync } = useScaffoldWriteContract({
        contractName: "VotingPlatform",
    });

    const handleVote = async () => {
        if (selectedOption === null) {
            alert("Please select an option to vote.");
            return;
        }

        try {
            await voteAsync({
                functionName: "vote",
                args: [parseInt(pollId), selectedOption],
            });
            alert("Vote cast successfully!");
        } catch (e) {
            console.error("Error casting vote:", e);
            //alert("Failed to cast vote.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{question ? `Poll: ${question}` : "Poll"}</h1>

                {isLoading ? (
                    <p className="text-gray-600">Loading poll...</p>
                ) : isActive ? (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Options:</h2>
                        <ul className="space-y-2">
                            {options.map((option, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="pollOption"
                                            value={index}
                                            onChange={() => setSelectedOption(index)}
                                            className="accent-blue-600"
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`w-full mt-4 px-4 py-2 text-white font-semibold rounded-lg transition ${selectedOption === null
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            onClick={handleVote}
                            disabled={selectedOption === null}
                        >
                            Submit Vote
                        </button>
                    </div>
                ) : (
                    <p className="text-red-500 text-lg font-semibold">This poll is closed.</p>
                )}
            </div>
        </div>
    );
}
