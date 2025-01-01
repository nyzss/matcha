import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendMail = async (to: string, code: string) => {

    const link = `${process.env.FRONTEND_URL}/verify-email?code=${code}`

    return await transporter.sendMail({
        from: '"Matcha" <okoca@matchaa.me>',
        to,
        subject: "Confirm your email",
        html: templateMail(code, link),
    });
};

export const templateMail = (code: string, link: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Confirm Your Account</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
                    rel="stylesheet"
                />
                <style>
                    body {
                        font-family: "Inter", sans-serif;
                        font-optical-sizing: auto;
                        background-color: #f9fafb;
                        color: #111827;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        padding: 20px;
                    }
                    .email-header {
                        font-size: 32px;
                        font-weight: 800;
                        padding: 10px 0;
                        border-bottom: 1px solid #e5e7eb;
                        color: #0d0d0d;
                    }
                    .email-body {
                        padding: 20px 0;
                    }
                    .email-body p {
                        margin: 16px 0;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #111827;
                    }
                    .email-code {
                        font-size: 24px;
                        font-weight: 700;
                        color: #4a3e8c; /* Darker purple */
                        background: #e8e3f7; /* Softer background */
                        padding: 12px 24px;
                        border-radius: 4px;
                        display: inline-block;
                    }
                    .email-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 22px;
                        font-size: 15px;
                        color: #ffffff; /* White text */
                        background-color: #000000;
                        text-decoration: none;
                        border-radius: 4px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transition: background-color 0.3s, transform 0.2s;
                        font-weight: 600;
                    }
                    .email-button:hover {
                        background-color: #333333;
                        transform: translateY(-1px);
                    }
                    .email-footer {
                        padding: 20px 0;
                        border-top: 1px solid #e5e7eb;
                        font-size: 14px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Welcome to Matcha</div>
                    <div class="email-body">
                        <p>
                            Thank you for joining Matcha! Use the code below to confirm
                            your account:
                        </p>
                        <div class="email-code">${code}</div>
                        <p>
                            Or, you can confirm your account by clicking the button
                            below:
                        </p>
                        <a href="${link}" class="email-button">Confirm Account</a>
                    </div>
                    <div class="email-footer">
                        <p>&copy; 2024 Matcha. School project<sup>™</sup></p>
                    </div>
                </div>
            </body>
        </html>
    `;
};
