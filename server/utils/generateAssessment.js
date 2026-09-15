import ai from "./ai.js";

const generateAssessment = async (job, resumeData, screening) => {
  try {
    const prompt = `
You are an AI technical assessment generator.

Generate exactly 5 randomized medium-difficulty technical questions
for a candidate applying for the following job.

JOB TITLE:
${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.requiredSkills.join(", ")}

CANDIDATE SKILLS:
${resumeData.skills.join(", ")}

CANDIDATE EXPERIENCE:
${resumeData.experience.join("\n")}

CANDIDATE PROJECTS:
${resumeData.projects.join("\n")}

MATCHED JOB SKILLS:
${screening.matchedSkills.join(", ")}

MISSING JOB SKILLS:
${screening.missingSkills.join(", ")}

INSTRUCTIONS:

1. Generate exactly 5 questions.
2. Questions must be medium difficulty.
3. Questions should test practical understanding, not simple definitions.
4. Base questions primarily on the job requirements.
5. Personalize some questions using technologies or experience claimed in the resume.
6. Questions should not all be about the same technology.
7. Avoid trivia.
8. Do not provide answers.
9. For every question, internally generate 3 to 5 expected key points.
10. The expected key points will later be used to evaluate the candidate's answer.
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
            questions: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  question: {
                    type: "string",
                  },

                  expectedKeyPoints: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },

                required: ["question", "expectedKeyPoints"],
              },
            },
          },

          required: ["questions"],
        },
      },
    });

    const result = JSON.parse(response.text);

    return result;
  } catch (error) {
    console.log("Assessment Generation Error:", error);
    throw error;
  }
};

export default generateAssessment;