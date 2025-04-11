// api.tsx
import axios from "axios";

const JUDGE0_API =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

const RAPID_API_KEY = "your_rapidapi_key"; // ⛔ Replace this with your actual key

const languageIds: { [key: string]: number } = {
  cpp: 54,
  java: 62,
  // Add more if needed
};

export async function runWithJudge0(
  code: string,
  language: string
): Promise<string> {
  try {
    const language_id = languageIds[language];
    if (!language_id) {
      return "Unsupported language for Judge0!";
    }

    const response = await axios.post(
      JUDGE0_API,
      {
        source_code: code,
        language_id,
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "1c6d404826msh8ae2565a4e6bcadp1a661fjsn7135a54968e5",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    return response.data.stdout || response.data.stderr || "No output.";
  } catch (error: any) {
    return `Judge0 error: ${error.message}`;
  }
}
