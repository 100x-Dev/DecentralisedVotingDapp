"use client";

import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const EndPoll = () => {
    const router = useRouter();
    const { address } = useAccount(); // Get user address

    // Fetch polls created by the user
    const {
        data: userPolls,
        isLoading,
        isError,
    } = useScaffoldReadContract({
        contractName: "VotingPlatform",
        functionName: "getUserPolls",
        args: [address || "0x0000000000000000000000000000000000000000"], // Handle undefined address
        watch: true,
    });

    // Fix: Use `writeContractAsync`
    const { writeContractAsync } = useScaffoldWriteContract("VotingPlatform");

    if (isLoading) return <p className="text-blue-600 text-center">Loading your polls...</p>;
    if (isError || !userPolls || !userPolls[0] || !userPolls[1] || !userPolls[2])
        return <p className="text-red-600 text-center font-semibold">No polls found</p>;

    // Extract poll data
    const pollIds: bigint[] = Array.from(userPolls[0]);
    const pollQuestions: string[] = Array.from(userPolls[1]);
    const pollStatuses: boolean[] = Array.from(userPolls[2]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">🚀 Your Polls</h2>

            {pollIds.length === 0 ? (
                <p className="text-gray-500 text-center">You have not created any polls.</p>
            ) : (
                <ul className="space-y-4">
                    {pollIds.map((pollId, index) => (
                        <li key={pollId} className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                            <p className="text-xl font-semibold text-purple-700">🏷️ {pollQuestions[index]}</p>
                            <p className={`mt-2 font-medium ${pollStatuses[index] ? "text-green-600" : "text-red-600"}`}>
                                {pollStatuses[index] ? "✅ Active" : "❌ Closed"}
                            </p>

                            {pollStatuses[index] && (
                                <button
                                    className="mt-3 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                                    onClick={async () => {
                                        try {
                                            await writeContractAsync({ functionName: "closePoll", args: [pollId] });
                                            router.refresh(); // Refresh the page after closing
                                        } catch (error) {
                                            console.error("Error closing poll:", error);
                                        }
                                    }}
                                >
                                    🛑 End Poll
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Back Button */}
            <button
                className="mt-5 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
                onClick={() => router.push("/")}
            >
                🔙 Back to Home
            </button>
        </div>
    );
};

export default EndPoll;
