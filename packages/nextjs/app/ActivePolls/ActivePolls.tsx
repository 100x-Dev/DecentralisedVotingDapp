"use client";

// Required for using useRouter() in the App Router
import { useRouter } from "next/navigation";
// Use next/navigation instead of next/router
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ActivePolls = () => {
    const router = useRouter();

    const {
        data: allPolls,
        isLoading,
        isError,
    } = useScaffoldReadContract({
        contractName: "VotingPlatform",
        functionName: "getAllPolls", // Fetch all polls, not just active ones
        watch: true,
    });

    if (isLoading) return <p className="text-blue-600 text-center">Loading polls...</p>;
    if (isError || !allPolls) return <p className="text-red-600 text-center font-semibold">Error fetching polls</p>;

    // Ensure allPolls is correctly formatted
    const pollIds: number[] = allPolls && allPolls[0] ? Array.from(allPolls[0]).map(id => Number(id)) : [];
    const pollQuestions: string[] = allPolls && allPolls[1] ? Array.from(allPolls[1]) : [];
    const pollStatuses: boolean[] = allPolls && allPolls[2] ? Array.from(allPolls[2]) : [];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">🗳️ All Polls</h2>

            {pollIds.length === 0 ? (
                <p className="text-gray-500 text-center">No polls available.</p>
            ) : (
                <ul className="space-y-4">
                    {pollIds.map((pollId, index) => (
                        <li key={pollId} className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                            <p className="text-xl font-semibold text-purple-700">🏷️ Poll {index + 1}</p>
                            <p className="text-gray-800">{pollQuestions[index]}</p>
                            <p className={`mt-2 font-medium ${pollStatuses[index] ? "text-green-600" : "text-red-600"}`}>
                                {pollStatuses[index] ? "✅ Active" : "❌ Inactive"}
                            </p>

                            <div className="mt-3 space-x-2">
                                {pollStatuses[index] && (
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                        onClick={() => router.push(`/poll/${pollId}`)}
                                    >
                                        🗳️ Vote Now
                                    </button>
                                )}

                                <button
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                    onClick={() => router.push(`/results/${pollId}`)}
                                >
                                    📊 View Results
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActivePolls;
