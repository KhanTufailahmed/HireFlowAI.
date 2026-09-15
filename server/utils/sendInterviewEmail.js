import resend from "./resend.js";

const sendInterviewEmail = async (candidate, job, interview) => {
  try {
    const interviewDate = new Date(
      interview.interviewDate
    ).toLocaleString("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const { data, error } = await resend.emails.send({
      from: "HireFlow AI <onboarding@resend.dev>",

      // Resend test domain only allows verified test recipient
      to: [process.env.TEST_EMAIL],

      subject: `Interview Scheduled - ${job.title}`,

      html: `
        <h2>Congratulations ${candidate.name}!</h2>

        <p>
          You have successfully cleared the assessment and
          have been selected by the hiring team.
        </p>

        <p>
          Your interview for
          <strong>${job.title}</strong>
          has been scheduled.
        </p>

        <p>
          <strong>Candidate Email:</strong>
          ${candidate.email}
        </p>

        <p>
          <strong>Date & Time:</strong>
          ${interviewDate}
        </p>

        <p>
          <strong>Mode:</strong>
          ${interview.mode}
        </p>

        ${
          interview.meetingLink
            ? `
              <p>
                <strong>Meeting Link:</strong>
                <a href="${interview.meetingLink}">
                  Join Interview
                </a>
              </p>
            `
            : ""
        }

        <p>Best of luck!</p>

        <p>
          Regards,<br/>
          HireFlow AI
        </p>
      `,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log("Interview Email Error:", error);
    throw error;
  }
};

export default sendInterviewEmail;