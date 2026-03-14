export const metadata = {
  title: "HUM 301 Exam Prep",
  description: "Science, Technology and Human Existence and Society exam practice app"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
