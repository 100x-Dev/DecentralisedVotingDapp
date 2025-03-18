"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const PollPage = () => {
    const params = useParams();
    const pollId = params.pollId;
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const { writeContractAsync } = useScaffoldWriteContract("VotingPlatform");
    const { data: poll, isLoading } = useScaffoldReadContract({
        contractName: "VotingPlatform",
        functionName: "getPoll",
        args: [typeof pollId === "string" ? BigInt(pollId) : BigInt(0)],
        enabled: typeof pollId === "string",
    });

    const handleVote = async () => {
        if (selectedOption === null || typeof pollId !== "string") {
            alert("Please select an option before voting");
            return;
        }

        try {
            await writeContractAsync({
                functionName: "vote",
                args: [BigInt(pollId), BigInt(selectedOption)],
            });
            alert("Vote cast successfully!");
        } catch (error) {
            console.error("Error casting vote:", error);
            alert("Failed to cast vote. Please try again.");
        }
    };

    // Render based on conditions
    if (typeof pollId !== "string") {
        return <p className="text-center">Invalid poll ID</p>;
    }

    if (isLoading) {
        return <p className="text-center">Loading poll data...</p>;
    }

    if (!poll) {
        return <p className="text-center">Poll not found</p>;
    }

    const question = poll[0] || "";
    const options = poll[1] || [];
    const isActive = poll[2] ?? false;

    if (!isActive) {
        return <p className="text-center">This poll is no longer active</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-purple-700">{question}</h1>
                <div className="space-y-4">
                    {options.map((option: string, index: number) => (
                        <div
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition ${selectedOption === index ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                                }`}
                            onClick={() => setSelectedOption(index)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
                <button
                    className={`w-full mt-4 px-4 py-2 text-white font-semibold rounded-lg transition ${selectedOption === null ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    onClick={handleVote}
                    disabled={selectedOption === null}
                >
                    Cast Vote
                </button>
            </div>
        </div>
    );
};

export default PollPage;