import { useState } from "react";
import { useRouter } from "next/navigation";
// Import router for navigation
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// Import Scaffold-ETH hook

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]); // At least two options
  const router = useRouter(); // Initialize router

  // Scaffold-ETH write contract hook
  const { writeContractAsync: createPollAsync } = useScaffoldWriteContract({
    contractName: "VotingPlatform",
  });

  // Function to add an option field dynamically
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Function to update an option text
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Function to submit the poll
  const submitPoll = async () => {
    try {
      if (question.trim() === "" || options.some(option => option.trim() === "")) {
        alert("Please enter a valid question and at least two options.");
        return;
      }

      // Call smart contract function
      await createPollAsync({
        functionName: "createPoll",
        args: [question, options],
      });

      alert("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]); // Reset form after submission
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🗳️ Create a Poll</h2>

      {/* Question Input */}
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        placeholder="Enter poll question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />

      {/* Poll Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={e => updateOption(index, e.target.value)}
          />
        ))}
      </div>

      {/* Add Option Button */}
      <button
        className="w-full mt-3 px-4 py-2 text-blue-700 font-medium rounded-lg border border-blue-500 hover:bg-blue-100 transition"
        onClick={addOption}
      >
        ➕ Add Option
      </button>

      {/* Submit Button */}
      <button
        className="w-full mt-3 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        onClick={submitPoll}
      >
        ✅ Create Poll
      </button>

      {/* Navigation to End Poll Page */}
      <button
        className="w-full mt-3 px-4 py-2 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition"
        onClick={() => router.push("/endPoll")}
      >
        🔧 Manage Your Polls
      </button>
    </div>
  );
};

export default CreatePoll;
