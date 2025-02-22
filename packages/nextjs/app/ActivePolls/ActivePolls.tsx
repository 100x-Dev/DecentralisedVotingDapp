"use client"; // Required for using useRouter() in the App Router
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ActivePolls = () => {
    const router = useRouter();

    const { data: activePolls, isLoading, isError } = useScaffoldReadContract({
        contractName: "VotingPlatform",
        functionName: "getActivePolls",
        watch: true,
    });

    if (isLoading) return <p className="text-blue-600 text-center">Loading active polls...</p>;
    if (isError || !activePolls) return <p className="text-red-600 text-center font-semibold">Error fetching active polls</p>;

    // Ensure activePolls is correctly formatted
    const pollIds: number[] = (activePolls && activePolls[0]) || [];
    const pollQuestions: string[] = (activePolls && activePolls[1]) || [];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">🗳️ Active Polls</h2>

            {pollIds.length === 0 ? (
                <p className="text-gray-500 text-center">No active polls available.</p>
            ) : (
                <ul className="space-y-4">
                    {pollIds.map((pollId, index) => (
                        <li key={pollId} className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                            <p className="text-xl font-semibold text-purple-700">
                                🏷️ Poll {index + 1}
                            </p>
                            <p className="text-gray-800">{pollQuestions[index]}</p>
                            <button
                                className="mt-3 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                onClick={() => router.push(`/poll/${pollId}`)}
                            >
                                🗳️ Vote Now
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActivePolls;
