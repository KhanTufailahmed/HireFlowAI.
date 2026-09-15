import ai from "./ai.js";

const evaluateAssessment = async (questions) => {
  try {
    const assessmentData = questions.map((item) => ({
      questionId: item._id.toString(),
      question: item.question,
      expectedKeyPoints: item.expectedKeyPoints,
      candidateAnswer: item.candidateAnswer,
    }));

    const prompt = `
You are an AI technical assessment evaluator.

Evaluate the candidate's answers to the technical assessment.

ASSESSMENT:
${JSON.stringify(assessmentData, null, 2)}

INSTRUCTIONS:

1. Evaluate each answer based on:
   - technical correctness
   - coverage of expected key points
   - practical understanding

2. Give each answer a score from 0 to 10.

3. Do not require the candidate to use the exact same wording as the expected key points.

4. Give credit when the candidate explains the same concept correctly using different terminology.

5. Do not invent information that is not present in the candidate's answer.

6. Provide short feedback for every answer.

7. Return an evaluation for every question using its exact questionId.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          text: prompt,
        },
      ],

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            evaluations: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  questionId: {
                    type: "string",
                  },

                  score: {
                    type: "number",
                  },

                  feedback: {
                    type: "string",
                  },
                },

                required: ["questionId", "score", "feedback"],
              },
            },
          },

          required: ["evaluations"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.log("Assessment Evaluation Error:", error);
    throw error;
  }
};

export default evaluateAssessment;