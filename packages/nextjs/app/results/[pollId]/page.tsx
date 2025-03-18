"use client";

import { useParams, useRouter } from "next/navigation";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const PollResults = () => {
  const { pollId } = useParams();
  const router = useRouter();

  // Fetch poll votes
  const {
    data: pollVotes,
    isLoading: votesLoading,
    isError: votesError,
  } = useScaffoldReadContract({
    contractName: "VotingPlatform",
    functionName: "getPollVotes",
    args: [BigInt(pollId as string)],
  });

  // Fetch poll options
  const {
    data: pollOptions,
    isLoading: optionsLoading,
    isError: optionsError,
  } = useScaffoldReadContract({
    contractName: "VotingPlatform",
    functionName: "getPoll",
    args: [BigInt(pollId as string)],
  });

  // Debugging logs
  console.log("Fetched poll votes:", pollVotes);
  console.log("Fetched poll options:", pollOptions);

  if (votesLoading || optionsLoading) return <p className="text-blue-600 text-center">Loading poll results...</p>;
  if (votesError || optionsError || !pollVotes || !pollOptions)
    return <p className="text-red-600 text-center font-semibold">Error fetching results</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">📊 Poll Results</h2>
      <p className="text-lg font-semibold">Poll ID: {pollId}</p>

      <ul className="mt-4 space-y-2">
        {pollVotes.map((votes: bigint, index: number) => (
          <li key={index} className="p-3 border border-gray-300 rounded-md bg-gray-100">
            <span className="text-gray-700 font-medium">{pollOptions[index]}:</span>
            <span className="text-black font-bold ml-2">{Number(votes)} votes</span>
          </li>
        ))}
      </ul>

      <button
        className="mt-5 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition"
        onClick={() => router.back()}
      >
        🔙 Back
      </button>
    </div>
  );
};

export default PollResults;
