import ai from "./ai.js";

const screenResume = async (fileBuffer, job) => {
  try {
    const prompt = `
You are an AI resume screening assistant.

Analyze the attached candidate resume.

First extract the candidate's relevant information.

Then evaluate the resume against the following job requirements.

JOB TITLE:
${job.title}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.requiredSkills.join(", ")}

MINIMUM EXPERIENCE:
${job.minimumExperience} years

SCORING INSTRUCTIONS:

1. Compare the candidate's skills with the required skills.
2. Consider relevant professional experience.
3. Consider relevant projects.
4. Consider whether the candidate satisfies the minimum experience.
5. Do not assume or invent skills that are not supported by the resume.
6. Give a resume screening score between 0 and 100.
7. Provide a short explanation of the score.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: fileBuffer.toString("base64"),
          },
        },
        {
          text: prompt,
        },
      ],

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            resumeData: {
              type: "object",

              properties: {
                skills: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                education: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                experience: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                projects: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                totalExperience: {
                  type: "number",
                },
              },

              required: [
                "skills",
                "education",
                "experience",
                "projects",
                "totalExperience",
              ],
            },

            screening: {
              type: "object",

              properties: {
                matchedSkills: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                missingSkills: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },

                score: {
                  type: "number",
                },

                summary: {
                  type: "string",
                },
              },

              required: [
                "matchedSkills",
                "missingSkills",
                "score",
                "summary",
              ],
            },
          },

          required: ["resumeData", "screening"],
        },
      },
    });

    const result = JSON.parse(response.text);

    return result;
  } catch (error) {
    console.log("AI Screening Error:", error);
    throw error;
  }
};

export default screenResume;